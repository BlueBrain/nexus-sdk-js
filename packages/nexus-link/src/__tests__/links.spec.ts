import * as Links from '../links';
import { Operation } from '../types';
import { Observable } from 'rxjs';

jest.useFakeTimers();
jest.setTimeout(1500);

describe('setToken', () => {
  it('sets the  token  at the operation headers/Authorization', () => {
    const setTokenLink = Links.setToken('mytoken');
    const testLink = (operation: Operation) =>
      new Observable(observer => {
        observer.next(operation.headers['Authorization']);
        observer.complete();
      });
    const obs = setTokenLink({ path: 'testpath' }, testLink);
    let result;
    obs.subscribe(x => {
      result = x;
    });
    expect(result).toBe('bearer mytoken');
  });
  it('throws an error when no link is passed', () => {
    const setTokenLink = Links.setToken('mytoken');
    expect(() => setTokenLink({ path: 'testpath' })).toThrow();
  });
});

describe('setMethod', () => {
  it('sets the  method  at the operation', () => {
    const setMethodLink = Links.setMethod('get');
    const testLink = (operation: Operation) =>
      new Observable(observer => {
        observer.next(operation.method);
        observer.complete();
      });
    const obs = setMethodLink({ path: 'testpath' }, testLink);
    let result;
    obs.subscribe(x => {
      result = x;
    });
    expect(result).toBe('get');
  });
  it('throws an error when no link is passed', () => {
    const setMethodLink = Links.setMethod('get');
    expect(() => setMethodLink({ path: 'testpath' })).toThrow();
  });
});

describe('poll', () => {
  it('throws an error when no link is passed', () => {
    const pollLink = Links.poll(1000);
    expect(() => pollLink({ path: 'testpath' })).toThrow();
  });

  it('polls the link every x seconds', () => {
    const pollLink = Links.poll(1000);
    const testLink = (operation: Operation) =>
      new Observable(observer => {
        observer.next(1);
      });
    const obs = pollLink({ path: 'testpath' }, testLink);
    let result = 0;
    obs.subscribe(x => {
      result += x;
    });
    jest.advanceTimersByTime(1000);
    expect(result).toBe(1);
    jest.advanceTimersByTime(1000);
    expect(result).toBe(2);
  });
});

describe('triggerFetch', () => {
  it('fetches the data and parses as json by default', done => {
    const testLink = Links.triggerFetch(fetch);
    const data = { data: '12345' };
    const obs = testLink({ path: 'testpath' });

    fetchMock.mockResponseOnce(JSON.stringify(data));

    obs.subscribe(res => {
      expect(res).toMatchObject(data);
      done();
    });
  });

  it('parses the data as text', done => {
    const testLink = Links.triggerFetch(fetch);
    const data = '12345';
    const obs = testLink({ path: 'testpath', context: { parseAs: 'text' } });

    fetchMock.mockResponseOnce(data);

    obs.subscribe(res => {
      expect(res).toEqual(data);
      done();
    });
  });

  it('throws an error when tries to parse a text as json', done => {
    const testLink = Links.triggerFetch(fetch);
    const data = 'randomText';
    const obs = testLink({ path: 'testpath', context: { parseAs: 'json' } });

    fetchMock.mockResponseOnce(data);

    obs.subscribe(undefined, err => {
      expect(err).toBeTruthy();
      done();
    });
  });

  it('creates no default header if noDefaultHeader is set to true', async () => {
    const mockFetch = jest.fn();
    const testLink = Links.triggerFetch(mockFetch);
    const obs = await testLink({
      path: 'testpath',
      context: { noDefaultHeader: true },
    });

    mockFetch.mockReturnValue('data');

    obs.subscribe(res => {
      expect(res).toEqual('data');
    });

    expect(mockFetch.mock.calls[0][1]['headers']).toEqual({});
  });

  it('creates the default header with the content type: json', async () => {
    const mockFetch = jest.fn();
    const testLink = Links.triggerFetch(mockFetch);
    const obs = await testLink({ path: 'testpath' });

    mockFetch.mockReturnValue('data');

    obs.subscribe(res => {
      expect(res).toEqual('data');
    });

    expect(mockFetch.mock.calls[0][1]['headers']).toEqual({
      'Content-Type': 'application/json',
    });
  });
});
