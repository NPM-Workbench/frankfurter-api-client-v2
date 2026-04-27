/* app imports */
import { API_ROOT } from '../shared/index.js';
import { TCurrencyInfo } from '../types/index.js';

/* types */
type TInput = { code: string };
type TOutput = TCurrencyInfo;

/* module */
async function getCurrencyInfo(props: TInput): Promise<TOutput> {
  /* props - destruct */
  const { code } = props;

  /* setup */
  const API_URL = `${API_ROOT}/currency/${code}`;

  /* fetch */
  const response = await fetch(API_URL);

  /* end */
  if (!response.ok) {
    throw new Error('[frankfurter-api-dev-client-v2]: get currency info error');
  } else {
    return response.json();
  }
}

/* exports */
export { getCurrencyInfo };
