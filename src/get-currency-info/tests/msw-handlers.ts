/* imports */
import { http, HttpHandler, HttpResponse } from 'msw';
import { API_ROOT } from '../../shared/index.js';
import { TCurrencyInfo } from '../../types/index.js';

/* mock data */
const mockCurrencyInfo: TCurrencyInfo = {
  iso_code: '',
  iso_numeric: '356',
  name: 'Mock Currency Name',
  symbol: '-',
  start_date: '1994-03-01',
  end_date: '2026-04-27',
  providers: ['BAM', 'BCEAO'],
};

/* 200 OK */
const getCurrencyInfoOkHandler: HttpHandler = http.get<{ code: string }>(
  `${API_ROOT}/currency/:code`,
  ({ params }) => {
    /* props */
    const { code } = params;
    const mockInfo = {
      ...mockCurrencyInfo,
      iso_code: String(code).toUpperCase(),
    };

    return HttpResponse.json(mockInfo, { status: 200 });
  },
);

/* 404 Not Found */
const getCurrencyInfo404Handler: HttpHandler = http.get<{ code: string }>(
  `${API_ROOT}/currency/:code`,
  ({ params }) => {
    const { code } = params;
    return HttpResponse.json(
      { message: `Currency not found: ${code.toUpperCase()}` },
      { status: 404 },
    );
  },
);

/* fetch error */
const getCurrencyInfoFetchErrorHandler: HttpHandler = http.get<{
  code: string;
}>(`${API_ROOT}/currency/:code`, () => {
  return HttpResponse.error();
});

/* exports */
export {
  mockCurrencyInfo,
  getCurrencyInfoOkHandler,
  getCurrencyInfo404Handler,
  getCurrencyInfoFetchErrorHandler,
};
