/* app imports */
import { API_ROOT } from '../shared/index.js';
import { TLatestRate } from '../types/index.js';

/* types */
type TInput = { base: string; quotes?: string[] };
type TOutput = TLatestRate[];

/* module */
async function getLatestRates(props: TInput): Promise<TOutput> {
  /* props - destruct */
  const { base, quotes } = props;

  /* setup */
  const params = new URLSearchParams();
  params.set('base', base);
  if (quotes && quotes.length > 0) {
    params.set('quotes', quotes.join(','));
  }
  const API_URL = `${API_ROOT}/rates?${params.toString()}`;

  /* fetch */
  const response = await fetch(API_URL);

  /* end */
  if (!response.ok) {
    throw new Error('[frankfurter-api-dev-client-v2]: get latest rates error');
  } else {
    return response.json();
  }
}

/* exports */
export { getLatestRates };
