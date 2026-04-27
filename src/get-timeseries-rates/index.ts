/* node modules */
import dayjs from 'dayjs';

/* app imports */
import { API_ROOT } from '../shared/index.js';
import validateAndFormatDate from '../shared/validate-and-format-date.js';
import { TPeriod, TTimeSeriesRate } from '../types/index.js';

/* types */
type TInput = {
  base: string;
  from: TPeriod;
  to: TPeriod;
  quotes?: string[];
};
type TOutput = TTimeSeriesRate[];

/* module */
async function getTimeSeriesRates(props: TInput): Promise<TOutput> {
  /* props - destruct */
  const { base, from, to, quotes } = props;

  /* get: dates */
  const fromDt: string = validateAndFormatDate(from);
  const toDt: string = validateAndFormatDate(to);

  if (dayjs(fromDt).isAfter(dayjs(toDt))) {
    throw new Error(
      'Date Input Validation: From Date cannot be after To Date!',
    );
  } else {
    /* setup: url */
    const params = new URLSearchParams({ base, from: fromDt, to: toDt });
    if (quotes && quotes.length > 0) {
      params.set('quotes', quotes.join(','));
    }
    const API_URL = `${API_ROOT}/rates?${params.toString()}`;

    /* fetch */
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(
        '[frankfurter-api-dev-client-v2]: get timeseries rates error',
      );
    } else {
      return response.json();
    }
  }
}

/* exports */
export { getTimeSeriesRates };
