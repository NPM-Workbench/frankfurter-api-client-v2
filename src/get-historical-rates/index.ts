/* node modules */
import { TPeriod, THistoricalRate } from '../types/index.js';

/* app imports */
import { API_ROOT } from '../shared/index.js';
import validateAndFormatDate from '../shared/validate-and-format-date.js';

/* types */
type TInput = { base: string; period: TPeriod; quotes?: string[] };
type TOutput = THistoricalRate[];

/* module */
async function getHistoricalRatesForDate(props: TInput): Promise<TOutput> {
  /* props - destruct */
  const { base, period, quotes } = props;

  /* setup */
  const dateStr = validateAndFormatDate(period);
  const params = new URLSearchParams({ base, date: dateStr });
  if (quotes && quotes.length > 0) {
    params.set('quotes', quotes.join(','));
  }
  const API_URL = `${API_ROOT}/rates?${params.toString()}`;

  /* fetch */
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(
      '[frankfurter-api-dev-client-v2]: get historical rates for date error',
    );
  } else {
    return response.json();
  }
}

/* exports */
export { getHistoricalRatesForDate };
