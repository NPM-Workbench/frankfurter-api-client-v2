/* node modules */
import { jest } from '@jest/globals';

/* app imports */
import createMSWMockServer from '../../shared/msw-mock-server.js';
import { API_ROOT } from '../../shared/index.js';
import { getCurrencyInfo } from '../index.js';
import {
  getCurrencyInfo404Handler,
  getCurrencyInfoFetchErrorHandler,
  getCurrencyInfoOkHandler,
  mockCurrencyInfo,
} from './msw-handlers.js';

/* suite */
describe('Get Currency Info', () => {
  let fetchSpy: jest.SpiedFunction<typeof global.fetch>;
  let mswServer: ReturnType<typeof createMSWMockServer>;

  /* life-cycle */
  beforeAll(() => {
    mswServer = createMSWMockServer([getCurrencyInfoOkHandler]);
    mswServer.listen();
  });
  afterEach(() => {
    mswServer.resetHandlers();
    fetchSpy.mockRestore();
  });
  afterAll(() => mswServer.close());

  /* 1 */
  test('returns ok response, 200 status', async () => {
    /* setup */
    fetchSpy = jest.spyOn(global, 'fetch');
    const curCode = 'inr';
    const response = await getCurrencyInfo({ code: curCode });

    /* assert */
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(`${API_ROOT}/currency/${curCode}`);
    expect(response).toMatchObject({
      ...mockCurrencyInfo,
      iso_code: curCode.toUpperCase(),
    });
  });

  /* 2 */
  test('throws error, 404 status', async () => {
    /* setup */
    fetchSpy = jest.spyOn(global, 'fetch');
    mswServer.use(getCurrencyInfo404Handler);

    /* assert */
    await expect(getCurrencyInfo({ code: 'zzz' })).rejects.toThrow();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(`${API_ROOT}/currency/zzz`);
  });

  /* 3 */
  test('throws fetch error, when there is no connectivity', async () => {
    /* setup */
    fetchSpy = jest.spyOn(global, 'fetch');
    mswServer.use(getCurrencyInfoFetchErrorHandler);

    /* assert */
    await expect(getCurrencyInfo({ code: 'usd' })).rejects.toThrow();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(`${API_ROOT}/currency/usd`);
  });
});
