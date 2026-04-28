/* node modules */
import { jest } from '@jest/globals';

/* app imports */
import createMSWMockServer from '../../shared/msw-mock-server.js';
import { API_ROOT } from '../../shared/index.js';
import { getLatestRates } from '../index.js';
import {
  getLatestRatesFetchErrorHandler,
  getLatestRatesInvalidBaseHandler,
  getLatestRatesOkHandler,
  getLatestRatesOkWithQuotesHandler,
  mockLatestRates,
} from './msw-handlers.js';
import { TLatestRate } from '../../types/index.js';

/* suite */
describe('Get Latest Rates', () => {
  let fetchSpy: jest.SpiedFunction<typeof global.fetch>;
  let mswServer: ReturnType<typeof createMSWMockServer>;

  /* life-cycle */
  beforeAll(() => {
    mswServer = createMSWMockServer([getLatestRatesOkHandler]);
    mswServer.listen();
  });
  afterEach(() => {
    mswServer.resetHandlers();
    fetchSpy.mockRestore();
  });
  afterAll(() => mswServer.close());

  /* 1 */
  test('returns ok response, with base currency code only', async () => {
    /* setup */
    fetchSpy = jest.spyOn(global, 'fetch');
    const baseCur = 'usd';
    const response = await getLatestRates({ base: baseCur });
    const mockRes: TLatestRate[] = mockLatestRates.map((item) => ({
      ...item,
      base: baseCur.toUpperCase(),
    }));

    /* assert */
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(`${API_ROOT}/rates?base=${baseCur}`);
    expect(response).toMatchObject(mockRes);
  });

  /* 2 */
  test('throws fetch error, when there is no connectivity', async () => {
    /* setup */
    fetchSpy = jest.spyOn(global, 'fetch');
    const baseCur = 'eur';
    mswServer.use(getLatestRatesFetchErrorHandler);

    /* assert */
    await expect(getLatestRates({ base: baseCur })).rejects.toThrow();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(`${API_ROOT}/rates?base=${baseCur}`);
  });

  /* 3 */
  test('throws error when base currency is invalid', async () => {
    /* setup */
    fetchSpy = jest.spyOn(global, 'fetch');
    const baseCur = 'invalid';
    mswServer.use(getLatestRatesInvalidBaseHandler);

    /* assert */
    await expect(getLatestRates({ base: baseCur })).rejects.toThrow(
      '[frankfurter-api-dev-client-v2]: get latest rates error',
    );
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(`${API_ROOT}/rates?base=${baseCur}`);
  });

  /* 4 */
  test('returns ok response, with base currency code and quotes', async () => {
    /* setup */
    fetchSpy = jest.spyOn(global, 'fetch');
    const baseCur = 'usd';
    const quotes = ['eur', 'inr', 'gbp'];
    mswServer.use(getLatestRatesOkWithQuotesHandler);
    const response = await getLatestRates({ base: baseCur, quotes });
    const mockRes: TLatestRate[] = quotes.map((quote) => ({
      ...mockLatestRates[0],
      base: baseCur.toUpperCase(),
      quote: quote.toUpperCase(),
    }));

    /* assert */
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(
      `${API_ROOT}/rates?base=${baseCur}&quotes=eur%2Cinr%2Cgbp`,
    );
    expect(response).toMatchObject(mockRes);
  });
});
