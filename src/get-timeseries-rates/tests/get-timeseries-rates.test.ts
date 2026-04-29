/* node modules */
import { jest } from '@jest/globals';

/* app imports */
import createMSWMockServer from '../../shared/msw-mock-server.js';
import { API_ROOT } from '../../shared/index.js';
import { getTimeSeriesRates } from '../index.js';
import {
  getTimeSeriesRatesFetchErrorHandler,
  getTimeSeriesRatesInvalidBaseHandler,
  getTimeSeriesRatesOkHandler,
} from './msw-handler.js';

/* suite */
describe('Get TimeSeries Rates', () => {
  let fetchSpy: jest.SpiedFunction<typeof global.fetch>;
  let mswServer: ReturnType<typeof createMSWMockServer>;

  /* life-cycle */
  beforeAll(() => {
    mswServer = createMSWMockServer([getTimeSeriesRatesOkHandler]);
    mswServer.listen();
  });
  afterEach(() => {
    mswServer.resetHandlers();
    fetchSpy?.mockRestore();
  });
  afterAll(() => mswServer.close());

  /* 1 */
  test('returns ok response, with base currency code, from and to', async () => {
    /* setup */
    fetchSpy = jest.spyOn(global, 'fetch');
    const baseCur = 'usd';
    const response = await getTimeSeriesRates({
      base: baseCur,
      from: { year: 2026, month: 4, date: 25 },
      to: { year: 2026, month: 4, date: 26 },
    });

    /* assert */
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(
      `${API_ROOT}/rates?base=${baseCur}&from=2026-04-25&to=2026-04-26`,
    );
    expect(response.length).toBe(2);
    expect(response[0]).toMatchObject({
      base: baseCur.toUpperCase(),
      quote: 'mock-quote-1',
      date: '2026-04-25',
      value: 1,
    });
  });

  /* 2 */
  test('throws fetch error, when there is no connectivity', async () => {
    /* setup */
    fetchSpy = jest.spyOn(global, 'fetch');
    const baseCur = 'eur';
    mswServer.use(getTimeSeriesRatesFetchErrorHandler);

    /* assert */
    await expect(
      getTimeSeriesRates({
        base: baseCur,
        from: { year: 2026, month: 4, date: 25 },
        to: { year: 2026, month: 4, date: 28 },
      }),
    ).rejects.toThrow();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(
      `${API_ROOT}/rates?base=${baseCur}&from=2026-04-25&to=2026-04-28`,
    );
  });

  /* 3 */
  test('throws error when base currency is invalid', async () => {
    /* setup */
    fetchSpy = jest.spyOn(global, 'fetch');
    const baseCur = 'invalid';
    mswServer.use(getTimeSeriesRatesInvalidBaseHandler);

    /* assert */
    await expect(
      getTimeSeriesRates({
        base: baseCur,
        from: { year: 2026, month: 4, date: 25 },
        to: { year: 2026, month: 4, date: 28 },
      }),
    ).rejects.toThrow(
      '[frankfurter-api-dev-client-v2]: get timeseries rates error',
    );
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(
      `${API_ROOT}/rates?base=${baseCur}&from=2026-04-25&to=2026-04-28`,
    );
  });

  /* 4 */
  test('returns ok response, with base currency code, from, to and quotes', async () => {
    /* setup */
    fetchSpy = jest.spyOn(global, 'fetch');
    const baseCur = 'usd';
    const quotes = ['eur', 'inr', 'gbp'];
    const response = await getTimeSeriesRates({
      base: baseCur,
      from: { year: 2026, month: 4, date: 25 },
      to: { year: 2026, month: 4, date: 26 },
      quotes,
    });

    /* assert */
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(
      `${API_ROOT}/rates?base=${baseCur}&from=2026-04-25&to=2026-04-26&quotes=eur%2Cinr%2Cgbp`,
    );
    expect(response.length).toBe(quotes.length);
    expect(response[0]).toMatchObject({
      base: baseCur.toUpperCase(),
      quote: quotes[0].toUpperCase(),
      date: '2026-04-25',
      value: 1,
    });
  });

  /* 5 */
  test('throws validation error when from date is after to date', async () => {
    await expect(
      getTimeSeriesRates({
        base: 'usd',
        from: { year: 2026, month: 4, date: 29 },
        to: { year: 2026, month: 4, date: 28 },
      }),
    ).rejects.toThrow(
      'Date Input Validation: From Date cannot be after To Date!',
    );
  });
});
