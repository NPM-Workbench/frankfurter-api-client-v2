/* app imports */
import { API_ROOT } from '../shared/index.js';
import { TCurrencyProvider } from '../types/index.js';

/* types */
type TOutput = TCurrencyProvider[];

/* module */
async function getAllProviders(): Promise<TOutput> {
  /* setup */
  const API_URL = `${API_ROOT}/providers`;

  /* fetch */
  const response = await fetch(API_URL);

  /* end */
  if (!response.ok) {
    throw new Error('[frankfurter-api-dev-client-v2]: get all providers error');
  } else {
    return response.json();
  }
}

/* exports */
export { getAllProviders };
