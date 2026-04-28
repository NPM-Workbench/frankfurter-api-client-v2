/* imports */
import { http, HttpResponse } from 'msw';
import { API_ROOT } from '../../shared/index.js';

/* mock data */
const mockProviders: Record<string, any>[] = [
  {
    key: 'BAM',
    name: 'Bank Al-Maghrib',
    country_code: 'MA',
    rate_type: 'transfer rate',
    pivot_currency: 'MAD',
    data_url: 'https://apihelpdesk.centralbankofmorocco.ma/apis',
    terms_url: null,
    start_date: '1999-01-04',
    end_date: '2026-04-27',
    publishes_missed: 0,
    currencies: ['AED', 'AUD'],
  },
  {
    key: 'BANREP',
    name: 'Banco de la República',
    country_code: 'CO',
    rate_type: 'representative market',
    pivot_currency: 'COP',
    data_url: 'https://www.banrep.gov.co/es/estadisticas/trm',
    terms_url: null,
    start_date: '2000-01-04',
    end_date: '2026-04-28',
    publishes_missed: 0,
    currencies: ['COP', 'USD'],
  },
];

/* handlers */
const getAllProvidersOkHandler = http.get(`${API_ROOT}/providers`, () => {
  return HttpResponse.json([...mockProviders], { status: 200 });
});

const getAllProvidersFetchErrorHandler = http.get(
  `${API_ROOT}/providers`,
  () => {
    return HttpResponse.error();
  },
);

/* exports */
export {
  mockProviders,
  getAllProvidersOkHandler,
  getAllProvidersFetchErrorHandler,
};
