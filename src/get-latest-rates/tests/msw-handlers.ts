/* imports */
import { http, HttpHandler, HttpResponse } from 'msw';
import { API_ROOT } from '../../shared/index.js';
import { TLatestRate } from '../../types/index.js';

/* mock data */
const mockLatestRates: TLatestRate[] = [
  {
    base: 'USD',
    quote: 'EUR',
    date: '2026-04-28',
    value: 0.88,
  },
  {
    base: 'USD',
    quote: 'INR',
    date: '2026-04-28',
    value: 83.42,
  },
];

/* 200 OK - base only */
const getLatestRatesOkHandler: HttpHandler = http.get<{ base: string }>(
  `${API_ROOT}/rates`,
  ({ request }) => {
    /* props */
    const url = new URL(request.url);
    const base = url.searchParams.get('base');

    /* mock data - return */
    const mockData: TLatestRate[] = mockLatestRates.map((item) => ({
      ...item,
      base: String(base).toUpperCase(),
    }));

    return HttpResponse.json(mockData, { status: 200 });
  },
);

/* 200 OK - base and quotes */
const getLatestRatesOkWithQuotesHandler: HttpHandler = http.get<{
  base: string;
  quotes: string;
}>(`${API_ROOT}/rates`, ({ request }) => {
  /* props */
  const url = new URL(request.url);
  const base = url.searchParams.get('base');
  const quotesParam = url.searchParams.get('quotes')!;
  const quotes = quotesParam.split(',').map((item) => item.toUpperCase());

  /* mock data - return */
  const mockData: TLatestRate[] = quotes.map((quote) => ({
    ...mockLatestRates[0],
    base: String(base).toUpperCase(),
    quote,
  }));

  return HttpResponse.json(mockData, { status: 200 });
});

/* fetch error */
const getLatestRatesFetchErrorHandler: HttpHandler = http.get<{ base: string }>(
  `${API_ROOT}/rates`,
  () => {
    return HttpResponse.error();
  },
);

/* 422 Unprocessable Entity */
const getLatestRatesInvalidBaseHandler: HttpHandler = http.get<{
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

/* exports */
export {
  mockLatestRates,
  getLatestRatesOkHandler,
  getLatestRatesOkWithQuotesHandler,
  getLatestRatesFetchErrorHandler,
  getLatestRatesInvalidBaseHandler,
};
