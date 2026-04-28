/* imports */
import { TCurrency } from '../../types/index.js';

/* without legacy */
export const mockSupportedCurrencies: TCurrency[] = [
  {
    iso_code: 'ZMW',
    iso_numeric: '967',
    name: 'Zambian Kwacha',
    symbol: 'K',
    start_date: '2000-01-04',
    end_date: '2026-04-25',
  },
  {
    iso_code: 'ZWG',
    iso_numeric: '924',
    name: 'Zimbabwe Gold',
    symbol: 'ZiG',
    start_date: '2024-09-02',
    end_date: '2026-04-24',
  },
];

/* with legacy */
export const mockSupportedCurrenciesLegacy: TCurrency[] = [
  ...mockSupportedCurrencies,
  {
    iso_code: 'ZWN',
    iso_numeric: '942',
    name: 'Zimbabwean Dollar',
    symbol: '$',
    start_date: '2006-09-01',
    end_date: '2006-10-25',
  },
  {
    iso_code: 'ZWR',
    iso_numeric: '935',
    name: 'Zimbabwean Dollar',
    symbol: '$',
    start_date: '2008-08-06',
    end_date: '2010-05-26',
  },
];
