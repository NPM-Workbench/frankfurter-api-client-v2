/* imports */
import { http, HttpResponse, HttpHandler } from 'msw';
import {
  mockSupportedCurrencies,
  mockSupportedCurrenciesLegacy,
} from './data.js';
import { API_ROOT } from '../../shared/index.js';

/* 200 OK */
const getSupportedCurrenciesOkHandler: HttpHandler = http.get(
  `${API_ROOT}/currencies`,
  ({ request }) => {
    const url = new URL(request.url);

    if (url.searchParams.get('scope') === 'all') {
      return HttpResponse.json([...mockSupportedCurrenciesLegacy], {
        status: 200,
      });
    } else {
      return HttpResponse.json([...mockSupportedCurrencies], {
        status: 200,
      });
    }
  },
);

/* fetch error */
const getSupportedCurrenciesFetchErrorHandler: HttpHandler = http.get(
  `${API_ROOT}/currencies`,
  () => {
    return HttpResponse.error();
  },
);

/* exports */
export {
  getSupportedCurrenciesOkHandler,
  getSupportedCurrenciesFetchErrorHandler,
};
