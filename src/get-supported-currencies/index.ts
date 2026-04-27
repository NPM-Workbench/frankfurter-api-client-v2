/* app imports */
import { API_ROOT } from '../shared/index.js';
import { TCurrency } from '../types/index.js';

/* types */
type TInput = { legacy: boolean };
type TOutput = TCurrency[];

/* module */
async function getSupportedCurrencies(props: TInput): Promise<TOutput> {
  /* props - destruct */
  const { legacy } = props;

  /* setup */
  const API_URL = legacy
    ? `${API_ROOT}/currencies?scope=all`
    : `${API_ROOT}/currencies`;

  /* fetch */
  const response = await fetch(API_URL);

  /* end */
  if (!response.ok) {
    throw new Error(
      '[frankfurter-api-dev-client-v2]: get supported currencies error',
    );
  } else {
    return response.json();
  }
}

/* exports */
export { getSupportedCurrencies };
