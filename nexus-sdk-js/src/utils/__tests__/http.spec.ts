import { resetMocks, mockResponse, mock } from 'jest-fetch-mock';
import { httpGet, httpPost } from '../http';
import Nexus from '../../Nexus';
import { Headers } from 'cross-fetch';

const baseUrl = 'http://api.url';
Nexus.setEnvironment(baseUrl);

describe('http module', () => {
  describe('httpGet()', () => {
    afterEach(() => {
      resetMocks();
    });
    it('should make a call GET request to the requested URL', async () => {
      mockResponse('{}');
      httpGet('/service');
      expect(mock.calls.length).toBe(1);
      expect(mock.calls[0][0]).toEqual(`${baseUrl}/service`);
      expect(mock.calls[0][1].method).toEqual('GET');
    });
    it('should not use the base URL', async () => {
      mockResponse('{}');
      httpGet('http://whatever.com', false);
      expect(mock.calls.length).toBe(1);
      expect(mock.calls[0][0]).toEqual('http://whatever.com');
    });
    it('should make a call with the expected default headers', async () => {
      mockResponse('{}');
      httpGet('/service');
      expect(mock.calls[0][1].headers).toEqual(
        new Headers({
          'Content-Type': 'application/json',
          Accept: 'application/json',
          mode: 'cors',
        }),
      );
    });
    it('should successfully parse JSON', async () => {
      const payload = { message: 'success' };
      mockResponse(JSON.stringify(payload), { status: 200 });
      const response: JSON = await httpGet('/endpoint');
      expect(response).toEqual(payload);
    });
    it('should throw an error', async () => {
      const payload = { message: 'error' };
      mockResponse(JSON.stringify(payload), { status: 404 });
      await expect(httpGet('')).rejects.toThrow(Error);
    });
  });

  describe('httpPost()', () => {
    afterEach(() => {
      resetMocks();
    });
    it('should make a call POST request to the requested URL', async () => {
      mockResponse('{}');
      httpPost('/service');
      expect(mock.calls.length).toBe(1);
      expect(mock.calls[0][0]).toEqual(`${baseUrl}/service`);
      expect(mock.calls[0][1].method).toEqual('POST');
    });
    // it('should not use the base URL', async () => {
    //   mockResponse('{}');
    //   httpGet('http://whatever.com', false);
    //   expect(mock.calls.length).toBe(1);
    //   expect(mock.calls[0][0]).toEqual('http://whatever.com');
    // });
    // it('should make a call with the expected default headers', async () => {
    //   mockResponse('{}');
    //   httpGet('/service');
    //   expect(mock.calls[0][1].headers).toEqual(
    //     new Headers({
    //       'Content-Type': 'application/json',
    //       Accept: 'application/json',
    //       mode: 'cors',
    //     }),
    //   );
    // });
    // it('should successfully parse JSON', async () => {
    //   const payload = { message: 'success' };
    //   mockResponse(JSON.stringify(payload), { status: 200 });
    //   const response: JSON = await httpGet('/endpoint');
    //   expect(response).toEqual(payload);
    // });
    // it('should throw an error', async () => {
    //   const payload = { message: 'error' };
    //   mockResponse(JSON.stringify(payload), { status: 404 });
    //   await expect(httpGet('')).rejects.toThrow(Error);
    // });
  });
});
