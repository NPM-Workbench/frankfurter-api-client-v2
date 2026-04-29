/* imports */
import { http, HttpHandler, HttpResponse } from 'msw';
import { API_ROOT } from '../../shared/index.js';
import { TTimeSeriesRate } from '../../types/index.js';

/* mock data */
const mockTimeSeriesRate: TTimeSeriesRate = {
  base: '',
  quote: '',
  date: '',
  value: 1,
};

/* 200 OK */
const getTimeSeriesRatesOkHandler: HttpHandler = http.get<{
  base: string;
  from: string;
  to: string;
  quotes?: string;
}>(`${API_ROOT}/rates`, ({ request }) => {
  /* props */
  const url = new URL(request.url);
  const base = String(url.searchParams.get('base')).toUpperCase();
  const from = String(url.searchParams.get('from'));
  const to = String(url.searchParams.get('to'));
  const quotesParam = url.searchParams.get('quotes');
  let mockData: TTimeSeriesRate[];

  if (!quotesParam) {
    mockData = Array.from({ length: 2 }).map((_, index) => ({
      ...mockTimeSeriesRate,
      base,
      quote: `mock-quote-${index + 1}`,
      date: index === 0 ? from : to,
    }));
  } else {
    const quotes = quotesParam.split(',').map((item) => item.toUpperCase());
    mockData = quotes.map((quote, index) => ({
      ...mockTimeSeriesRate,
      base,
      quote,
      date: index % 2 === 0 ? from : to,
    }));
  }

  return HttpResponse.json(mockData, { status: 200 });
});

/* 422 Unprocessable Entity */
const getTimeSeriesRatesInvalidBaseHandler: HttpHandler = http.get<{
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
const getTimeSeriesRatesFetchErrorHandler: HttpHandler = http.get<{
  base: string;
  from: string;
  to: string;
}>(`${API_ROOT}/rates`, () => {
  return HttpResponse.error();
});

/* exports */
export {
  mockTimeSeriesRate,
  getTimeSeriesRatesOkHandler,
  getTimeSeriesRatesInvalidBaseHandler,
  getTimeSeriesRatesFetchErrorHandler,
};
