/* node modules */
import { jest } from '@jest/globals';

/* app imports */
import createMSWMockServer from '../../shared/msw-mock-server.js';
import { API_ROOT } from '../../shared/index.js';
import { getSupportedCurrencies } from '../index.js';
import {
  mockSupportedCurrencies,
  mockSupportedCurrenciesLegacy,
} from './data.js';
import {
  getSupportedCurrenciesFetchErrorHandler,
  getSupportedCurrenciesOkHandler,
} from './msw-handlers.js';

/* suite */
describe('Get Supported Currencies', () => {
  let fetchSpy: jest.SpiedFunction<typeof global.fetch>;
  let mswServer: ReturnType<typeof createMSWMockServer>;

  /* life-cycle */
  beforeAll(() => {
    mswServer = createMSWMockServer([getSupportedCurrenciesOkHandler]);
    mswServer.listen();
  });
  afterEach(() => {
    mswServer.resetHandlers();
    fetchSpy.mockRestore();
  });
  afterAll(() => mswServer.close());

  /* 1 */
  test('returns ok response, legacy false', async () => {
    /* setup */
    fetchSpy = jest.spyOn(global, 'fetch');
    const response = await getSupportedCurrencies({ legacy: false });

    /* assert */
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(`${API_ROOT}/currencies`);
    expect(response).toMatchObject(mockSupportedCurrencies);
  });

  /* 2 */
  test('returns ok response, legacy true', async () => {
    /* setup */
    fetchSpy = jest.spyOn(global, 'fetch');
    const response = await getSupportedCurrencies({ legacy: true });

    /* assert */
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(`${API_ROOT}/currencies?scope=all`);
    expect(response).toMatchObject(mockSupportedCurrenciesLegacy);
  });

  /* 3 */
  test('throws fetch error, when there is no connectivity', async () => {
    /* setup */
    fetchSpy = jest.spyOn(global, 'fetch');
    mswServer.use(getSupportedCurrenciesFetchErrorHandler);

    /* assert */
    await expect(getSupportedCurrencies({ legacy: false })).rejects.toThrow();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(`${API_ROOT}/currencies`);
  });
});
