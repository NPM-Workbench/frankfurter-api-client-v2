![Banner](https://github.com/user-attachments/assets/005818f1-dcce-4976-b91e-ddf40a8a5d3b)
![npm](https://img.shields.io/npm/v/frankfurter-api-client-v2)
![downloads](https://img.shields.io/npm/dw/frankfurter-api-client-v2)
![license](https://img.shields.io/npm/l/frankfurter-api-client-v2)
![NPM Unpacked Size](https://img.shields.io/npm/unpacked-size/frankfurter-api-client-v2)

# frankfurter-api-client-v2

A lightweight, type-safe JavaScript/TypeScript client for the <b>Frankfurter Currency Exchange Rates API (Version 2)</b>, designed for developers who want clean abstractions, strong date validation, and a minimal API surface. This package wraps the Frankfurter API with strict input validation, predictable error handling, and zero runtime configuration.

This is the <b>V2</b> version of the client, powered by the official [Frankfurter API V2](https://www.frankfurter.app/). No API Keys are required.

### 📦 Installation

```console
npm install frankfurter-api-client-v2
```

### 📘 Features

1. TypeScript-first with full type definitions
2. Strict date validation (including leap years & future dates)
3. Supports historical rates, time-series queries, currency info, and provider data
4. Minimal dependencies: dayjs only
5. Clean, promise-based API - Works in both Node.js and modern browsers

### 📕 Error Handling

All functions in this package are async and may throw errors due to network issues, invalid input, or API errors. **Always wrap your calls in try-catch blocks** to handle errors gracefully:

```javascript
try {
  const data = await getLatestRates({ base: 'EUR' });
  console.log(data);
} catch (error) {
  console.error('Failed to get rates:', error.message);
}
```

### 🔤 Example Usage

1. 📁 Get Latest Exchange Rates

```javascript
import { getLatestRates } from 'frankfurter-api-client-v2';

const response = await getLatestRates({
  base: 'EUR',
  symbols: ['USD', 'INR'] /* symbols part in the input props is optional */,
});

/* Sample Response Schema: 200-OK
[
  {
    "date": "2026-04-29",
    "base": "EUR",
    "quote": "AED",
    "rate": 4.2989
  },
  {
    "date": "2026-04-28",
    "base": "EUR",
    "quote": "AFN",
    "rate": 75.35
  },
  ...
  ...
  ...
]
*/
```

2. 📁 Get Historical Rates For Specific Date

```javascript
import { getHistoricalRatesForDate } from 'frankfurter-api-client-v2';

const data = await getHistoricalRatesForDate({
  base: 'USD',
  symbols: ['EUR', 'GBP'] /* symbols part in the input props is optional */,
  date: '2023-10-12' /* YYYY-MM-DD format */,
});

/* Sample Response Schema: 200-OK
[
  {
    "date": "1999-01-04",
    "base": "EUR",
    "quote": "AED",
    "rate": 4.3151
  },
  {
    "date": "1999-01-04",
    "base": "EUR",
    "quote": "AFN",
    "rate": 5600
  },
  {
    "date": "1999-01-04",
    "base": "EUR",
    "quote": "ALL",
    "rate": 162.06
  },
  ....
  ....
  ....
]
*/
```

3. 📁 Get Time Series Rates Between Two Dates

```javascript
import { getTimeSeriesRates } from 'frankfurter-api-client-v2';

const data = await getTimeSeriesRates({
  base: 'EUR',
  symbols: ['USD'] /* symbols part in the input props is optional */,
  start: '2023-01-01' /* YYYY-MM-DD format */,
  end: '2023-01-05' /* YYYY-MM-DD format */,
});

/* Sample Response Scheme: 200-OK
[
  {
    "date": "2026-01-01",
    "base": "EUR",
    "quote": "USD",
    "rate": 1.1751
  },
  {
    "date": "2026-01-02",
    "base": "EUR",
    "quote": "USD",
    "rate": 1.1737
  },
  {
    "date": "2026-01-03",
    "base": "EUR",
    "quote": "USD",
    "rate": 1.1722
  },
  ...
  ...
  ...
]
*/
```

4. 📁 Get Supported Currencies

```javascript
import { getSupportedCurrencies } from 'frankfurter-api-client-v2';
const data = await getSupportedCurrencies(); /* no input props required */

/* Sample Response Schema: 200-OK
[
  {
    "iso_code": "IMP",
    "iso_numeric": "",
    "name": "Isle of Man Pound",
    "symbol": "£",
    "start_date": "1949-12-21",
    "end_date": "2026-04-29"
  },
  {
    "iso_code": "INR",
    "iso_numeric": "356",
    "name": "Indian Rupee",
    "symbol": "₹",
    "start_date": "1994-03-01",
    "end_date": "2026-04-29"
  },
  ...
  ...
  ...
]
*/
```

5. 📁 Get Currency Info

```javascript
import { getCurrencyInfo } from 'frankfurter-api-client-v2';

const data = await getCurrencyInfo({
  currency: 'USD' /* required - currency code */,
});

/* Sample Response Schema: 200-OK
{
  "iso_code": "EUR",
  "iso_numeric": "978",
  "name": "Euro",
  "symbol": "€",
  "start_date": "1993-01-04",
  "end_date": "2026-04-29",
  "providers": ["BAM", "BANXICO", "BCB"..., ..., ...]
}
*/
```

6. 📁 Get All Providers

```javascript
import { getAllProviders } from 'frankfurter-api-client-v2';

const data = await getAllProviders(); /* no input props required */

/*
[
  {
    "key": "FBIL",
    "name": "Financial Benchmarks India",
    "country_code": "IN",
    "rate_type": "reference rate",
    "pivot_currency": "INR",
    "data_url": "https://www.fbil.org.in/#/refrates",
    "terms_url": "https://www.fbil.org.in/#/termsandcondition",
    "start_date": "2018-07-10",
    "end_date": "2026-04-22",
    "publishes_missed": 4,
    "currencies": [
      "AED",
      "EUR",
      "GBP",
      "IDR",
      "INR",
      "JPY",
      "USD"
    ]
  },
  ...,
  ...,
  ...,
]
*/
```

### 📗 Test Coverage

```
PASS src/get-supported-currencies/tests/get-supported-currencies.test.ts
  Get Supported Currencies
    ✓ returns ok response, legacy false
    ✓ returns ok response, legacy true
    ✓ throws fetch error, when there is no connectivity

PASS src/get-latest-rates/tests/get-latest-rates.test.ts
  Get Latest Rates
    ✓ returns ok response, with base currency code only
    ✓ throws fetch error, when there is no connectivity
    ✓ throws error when base currency is invalid
    ✓ returns ok response, with base currency code and quotes

PASS src/get-historical-rates/tests/get-historical-rates.test.ts
  Get Historical Rates
    ✓ returns ok response, with base currency code and period
    ✓ throws fetch error, when there is no connectivity
    ✓ throws error when base currency is invalid
    ✓ returns ok response, with base currency code, period and quotes

PASS src/get-all-providers/tests/get-all-providers.test.ts
  Get All Providers
    ✓ returns ok response, 200 status
    ✓ throws fetch error, when there is no connectivity

PASS src/get-currency-info/tests/get-currency-info.test.ts
  Get Currency Info
    ✓ returns ok response, 200 status
    ✓ throws error, 404 status
    ✓ throws fetch error, when there is no connectivity

PASS src/get-timeseries-rates/tests/get-timeseries-rates.test.ts
  Get TimeSeries Rates
    ✓ returns ok response, with base currency code, from and to
    ✓ throws fetch error, when there is no connectivity
    ✓ throws error when base currency is invalid
    ✓ returns ok response, with base currency code, from, to and quotes
    ✓ throws validation error when from date is after to date

Test Suites: 6 passed, 6 total
Tests:       21 passed, 21 total
Snapshots:   0 total
```

```
--------------------------------|---------|----------|---------|---------|-------------------
File                            | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------------------|---------|----------|---------|---------|-------------------
All files                       |   98.72 |    90.41 |     100 |   98.72 |
 get-all-providers              |      96 |       75 |     100 |      96 |
  index.ts                      |      96 |       75 |     100 |      96 | 18
 get-all-providers/tests        |     100 |      100 |     100 |     100 |
  msw-handlers.ts               |     100 |      100 |     100 |     100 |
 get-currency-info              |     100 |      100 |     100 |     100 |
  index.ts                      |     100 |      100 |     100 |     100 |
 get-currency-info/tests        |     100 |      100 |     100 |     100 |
  msw-handlers.ts               |     100 |      100 |     100 |     100 |
 get-historical-rates           |     100 |      100 |     100 |     100 |
  index.ts                      |     100 |      100 |     100 |     100 |
 get-historical-rates/tests     |     100 |      100 |     100 |     100 |
  msw-handlers.ts               |     100 |      100 |     100 |     100 |
 get-latest-rates               |     100 |      100 |     100 |     100 |
  index.ts                      |     100 |      100 |     100 |     100 |
 get-latest-rates/tests         |     100 |      100 |     100 |     100 |
  msw-handlers.ts               |     100 |      100 |     100 |     100 |
 get-supported-currencies       |    90.9 |    83.33 |     100 |    90.9 |
  index.ts                      |    90.9 |    83.33 |     100 |    90.9 | 24-26
 get-supported-currencies/tests |     100 |      100 |     100 |     100 |
  data.ts                       |     100 |      100 |     100 |     100 |
  msw-handlers.ts               |     100 |      100 |     100 |     100 |
 get-timeseries-rates           |     100 |      100 |     100 |     100 |
  index.ts                      |     100 |      100 |     100 |     100 |
 get-timeseries-rates/tests     |     100 |      100 |     100 |     100 |
  msw-handler.ts                |     100 |      100 |     100 |     100 |
 shared                         |   91.07 |    28.57 |     100 |   91.07 |
  index.ts                      |     100 |      100 |     100 |     100 |
  msw-mock-server.ts            |     100 |      100 |     100 |     100 |
  validate-and-format-date.ts   |   87.17 |    16.66 |     100 |   87.17 | 17,19,21,29,31
--------------------------------|---------|----------|---------|---------|-------------------
```

### 📘 Contributing

Contributions, suggestions, and improvements are welcome.<br/>
Feel free to open issues or pull requests.

### ❤️ Support

Like this project? Support it with a github star, it would mean a lot to me! Cheers and Happy Coding.
