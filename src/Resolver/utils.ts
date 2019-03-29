import { httpGet, httpPut, httpDelete, httpPost } from '../utils/http';
import Resolver from '.';
import { PaginatedList, DEFAULT_LIST_SIZE } from '../utils/types';
import { buildQueryParams } from '../utils';
import {
  GetResolverOptions,
  ListResolverOptions,
  ListResolverResponse,
  ResolverPayload,
  ResolverResponseCommon,
  ResolverResponse,
  ResolverTypes,
  SingleResolverResponse,
} from './types';
import { stringLiteral } from '@babel/types';

/**
 * Creates a Resolver.
 *
 * When using POST, an @id will be autogenerated if not present in the payload.
 * When using PUT, not having an @id will cause an error.
 * If an @id is present, it will be used in both POST and PUT methods.
 *
 */
export async function createResolver(
  orgLabel: string,
  projectLabel: string,
  resolverPayload: ResolverPayload,
  method: "POST" | "PUT" = "POST",
): Promise<Resolver> {
  try {
    const id = resolverPayload["@id"] ? encodeURIComponent(resolverPayload["@id"]) : '';
    const httpRequest = method === "POST" ? httpPost : httpPut;
    const needsId = method === "PUT" && id;
    const url = `/projects/${orgLabel}/${projectLabel}${needsId ? id : ''}`
    const resolverResponse: SingleResolverResponse = await httpRequest(
      url,
      resolverPayload,
    );
    return new Resolver(orgLabel, projectLabel, { ...resolverResponse, ...resolverPayload });
  } catch (error) {
    throw error;
  }
}

/**
 * Overwrites a resolver's payload.
 *
 * Need to pass the latest revision ID to make sure the latest state
 * was accounted for.
 */
export async function updateResolver(
  orgLabel: string,
  projectLabel: string,
  resolverId: string,
  rev: string,
  resolverPayload: ResolverPayload,
): Promise<Resolver> {
  try {
    const resolverResponse: SingleResolverResponse = await httpPut(
      `/projects/${orgLabel}/${projectLabel}${encodeURIComponent(resolverId)}?rev=${rev}`,
      resolverPayload,
    );
    return new Resolver(orgLabel, projectLabel, { ...resolverResponse, ...resolverPayload });
  } catch (error) {
    throw error;
  }
}

/**
 * Get a resolver payload.
 *
 * By default, the latest revision if fetched.
 * Specify `rev` in the options to fetch a specific revision.
 * Specify `tag` in the options to fetch the revision with a given tag.
 * These options are mutually exclusive.
 */
export async function getResolver(
  orgLabel: string,
  projectLabel: string,
  resolverId: string,
  options?: GetResolverOptions,
): Promise<Resolver> {
  const opts: string = buildQueryParams(options);
  try {
    const resolverResponse: ResolverResponse = await httpGet(
      `/resolvers/${orgLabel}/${projectLabel}/${encodeURIComponent(resolverId)}${opts}`,
    );
    return new Resolver(orgLabel, projectLabel, resolverResponse);
  } catch (error) {
    throw error;
  }
}

export async function listResolvers(
  orgLabel: string,
  projectLabel: string,
  options: ListResolverOptions = {
    from: 0,
    size: DEFAULT_LIST_SIZE,
    deprecated: false,
  },
): Promise<PaginatedList<Resolver>> {
  const opts: string = buildQueryParams(options);
  try {
    const resolverResponse: ListResolverResponse = await httpGet(
      `/resolvers/${orgLabel}/${projectLabel}${opts}`,
    );
    const total: number = resolverResponse._total;
    const index: number = (options && options.from) || 1;
    const resolverIds = resolverResponse._results.map(
      (commonResponse: ResolverResponseCommon) => encodeURIComponent(commonResponse["@id"])
    );

    const getAndInstanciate = async (resolverId: string): Promise<Resolver> => {
      const resolver = await getResolver(orgLabel, projectLabel, resolverId);
      return resolver;
    };

    const results: Resolver[] = await Promise.all(resolverIds.map(resolverId => getAndInstanciate(resolverId)));

    return {
      total,
      index,
      results,
    };
  } catch (error) {
    throw error;
  }
}

export const normalizeType = (type: string): string => <string>type.split("/").pop();

export const isValidType = (normalizedType: string): normalizedType is ResolverTypes => {
  return ["InProject", "CrossProject"].includes(normalizedType);
};
