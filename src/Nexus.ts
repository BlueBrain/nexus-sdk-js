import store from './store';
import Organization from './Organization';
import { CreateOrgPayload, ListOrgOptions } from './Organization/types';
import { PaginatedList } from './utils/types';

type NexusConfig = {
  environment?: string;
  token?: string;
};

export default class Nexus {
  static store = store;

  static setEnvironment(environment: string): void {
    store.update('api', state => ({
      ...state,
      baseUrl: environment,
    }));
  }

  static setToken(token: string): void {
    if (!token || token === undefined || token.length === 0) {
      throw new Error('Token is invalid.');
    }
    store.update('auth', state => ({
      ...state,
      accessToken: token,
    }));
  }

  static removeToken(): void {
    store.update('auth', state => ({
      ...state,
      accessToken: undefined,
    }));
  }

  constructor(config?: NexusConfig) {
    if (config) {
      if (config.environment) {
        Nexus.setEnvironment(config.environment);
      }
      if (config.token) {
        Nexus.setToken(config.token);
      }
    }
  }

  async getOrganization(label: string): Promise<Organization> {
    return Organization.get(label);
  }

  async listOrganizations(
    listOrgOptions?: ListOrgOptions,
  ): Promise<PaginatedList<Organization>> {
    try {
      return Organization.list(listOrgOptions);
    } catch (error) {
      throw error;
    }
  }

  async createOrganization(
    label: string,
    orgPayload?: CreateOrgPayload,
  ): Promise<Organization> {
    try {
      return Organization.create(label, orgPayload);
    } catch (error) {
      throw error;
    }
  }

  async updateOrganization(
    label: string,
    rev: number,
    orgPayload: CreateOrgPayload,
  ): Promise<Organization> {
    try {
      return Organization.update(label, rev, orgPayload);
    } catch (error) {
      throw error;
    }
  }

  async deprecateOrganization(
    label: string,
    rev: number,
  ): Promise<Organization> {
    try {
      return Organization.deprecate(label, rev);
    } catch (error) {
      throw error;
    }
  }
}