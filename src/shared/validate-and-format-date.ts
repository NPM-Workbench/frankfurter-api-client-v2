/* node modules */
import dayjs from 'dayjs';

/* app import */
import { TPeriod } from '../types/index.js';

/* types */
type TInput = TPeriod;
type TOutput = string;

function validateAndFormatDate(props: TInput): TOutput {
  /* props - destruct */
  const { date, month, year } = props;
  const curYear = new Date().getFullYear();

  if (!Number.isInteger(year) || year < 1948 || year > curYear) {
    throw new Error('Date Input Validation: Invalid Year');
  } else if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error('Date Input Validation: Invalid Month');
  } else if (!Number.isInteger(date) || date < 1 || date > 31) {
    throw new Error('Date Input Validation: Invalid Date');
  } else {
    /* create the string */
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    const parsed = dayjs(dateStr, 'YYYY-MM-DD', true);

    /* check: if validation is ok or not */
    if (!parsed.isValid()) {
      throw new Error('Date Input Validation: Format Parse Failure');
    } else if (parsed.isAfter(dayjs(), 'day')) {
      throw new Error('Date Input Validation: Cannot be Greater than Today!');
    } else {
      return dateStr;
    }
  }
}

/* exports */
export default validateAndFormatDate;
