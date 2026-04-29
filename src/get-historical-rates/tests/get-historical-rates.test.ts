/* node modules */
import { jest } from '@jest/globals';

/* app imports */
import createMSWMockServer from '../../shared/msw-mock-server.js';
import { API_ROOT } from '../../shared/index.js';
import { getHistoricalRatesForDate } from '../index.js';
import {
  getHistoricalRatesFetchErrorHandler,
  getHistoricalRatesInvalidBaseHandler,
  getHistoricalRatesOkHandler,
} from './msw-handlers.js';

/* suite */
describe('Get Historical Rates', () => {
  let fetchSpy: jest.SpiedFunction<typeof global.fetch>;
  let mswServer: ReturnType<typeof createMSWMockServer>;

  /* life-cycle */
  beforeAll(() => {
    mswServer = createMSWMockServer([getHistoricalRatesOkHandler]);
    mswServer.listen();
  });
  afterEach(() => {
    mswServer.resetHandlers();
    fetchSpy.mockRestore();
  });
  afterAll(() => mswServer.close());

  /* 1 */
  test('returns ok response, with base currency code and period', async () => {
    /* setup */
    fetchSpy = jest.spyOn(global, 'fetch');
    const baseCur = 'usd';
    const response = await getHistoricalRatesForDate({
      base: baseCur,
      period: { year: 2026, month: 4, date: 28 },
    });

    /* assert */
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(
      `${API_ROOT}/rates?base=${baseCur}&date=2026-04-28`,
    );
    expect(response.length).toBe(2);
    expect(response[0]).toMatchObject({
      base: baseCur.toUpperCase(),
      quote: 'mock-quote-1',
      value: 1,
    });
  });

  /* 2 */
  test('throws fetch error, when there is no connectivity', async () => {
    /* setup */
    fetchSpy = jest.spyOn(global, 'fetch');
    const baseCur = 'eur';
    mswServer.use(getHistoricalRatesFetchErrorHandler);

    /* assert */
    await expect(
      getHistoricalRatesForDate({
        base: baseCur,
        period: { year: 2026, month: 4, date: 28 },
      }),
    ).rejects.toThrow();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(
      `${API_ROOT}/rates?base=${baseCur}&date=2026-04-28`,
    );
  });

  /* 3 */
  test('throws error when base currency is invalid', async () => {
    /* setup */
    fetchSpy = jest.spyOn(global, 'fetch');
    const baseCur = 'invalid';
    mswServer.use(getHistoricalRatesInvalidBaseHandler);

    /* assert */
    await expect(
      getHistoricalRatesForDate({
        base: baseCur,
        period: { year: 2026, month: 4, date: 28 },
      }),
    ).rejects.toThrow(
      '[frankfurter-api-dev-client-v2]: get historical rates for date error',
    );
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(
      `${API_ROOT}/rates?base=${baseCur}&date=2026-04-28`,
    );
  });

  /* 4 */
  test('returns ok response, with base currency code, period and quotes', async () => {
    /* setup */
    fetchSpy = jest.spyOn(global, 'fetch');
    const baseCur = 'usd';
    const quotes = ['eur', 'inr', 'gbp'];
    const response = await getHistoricalRatesForDate({
      base: baseCur,
      period: { year: 2026, month: 4, date: 28 },
      quotes,
    });

    /* assert */
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(
      `${API_ROOT}/rates?base=${baseCur}&date=2026-04-28&quotes=eur%2Cinr%2Cgbp`,
    );
    expect(response.length).toBe(quotes.length);
    expect(response[0]).toMatchObject({
      base: baseCur.toUpperCase(),
      quote: quotes[0].toUpperCase(),
      value: 1,
    });
  });
});
