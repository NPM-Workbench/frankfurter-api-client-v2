/* imports */
import { http, HttpHandler, HttpResponse } from 'msw';
import { API_ROOT } from '../../shared/index.js';
import { THistoricalRate } from '../../types/index.js';

/* mock data */
const mockHistoricalRate: THistoricalRate = {
  base: '',
  quote: '',
  date: '',
  value: 1,
};

/* 200 OK */
const getHistoricalRatesOkHandler: HttpHandler = http.get<{
  base: string;
  date: string;
  quotes?: string;
}>(`${API_ROOT}/rates`, ({ request }) => {
  /* props */
  const url = new URL(request.url);
  const base = String(url.searchParams.get('base')).toUpperCase();
  const date = String(url.searchParams.get('date'));
  const quotesParam = url.searchParams.get('quotes');
  let mockData: THistoricalRate[];

  if (!quotesParam) {
    mockData = Array.from({ length: 2 }).map((_, index) => {
      const clone = {
        ...mockHistoricalRate,
        base,
        quote: `mock-quote-${index + 1}`,
        date,
      };
      return clone;
    });
  } else {
    const quotes = quotesParam.split(',').map((item) => item.toUpperCase());
    mockData = quotes.map((quote) => {
      const clone = {
        ...mockHistoricalRate,
        base,
        quote,
        date,
      };
      return clone;
    });
  }
  return HttpResponse.json(mockData, { status: 200 });
});

/* 422 Unprocessable Entity */
const getHistoricalRatesInvalidBaseHandler: HttpHandler = http.get<{
  base: string;
}>(`${API_ROOT}/rates`, ({ request }) => {
  /* props */
  const url = new URL(request.url);
  const base = String(url.searchParams.get('base')).toUpperCase();

  return HttpResponse.json(
    { message: `Invalid base currency: ${base}` },
    { status: 422 },
  );
});

/* fetch error */
const getHistoricalRatesFetchErrorHandler: HttpHandler = http.get<{
  base: string;
  date: string;
}>(`${API_ROOT}/rates`, () => {
  return HttpResponse.error();
});

/* exports */
export {
  mockHistoricalRate,
  getHistoricalRatesOkHandler,
  getHistoricalRatesInvalidBaseHandler,
  getHistoricalRatesFetchErrorHandler,
};
