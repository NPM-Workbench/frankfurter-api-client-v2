![Banner](https://github.com/user-attachments/assets/83382ec3-d36d-4813-afca-a22f68e37591)
![npm](https://img.shields.io/npm/v/frankfurter-api-client-v2)
![downloads](https://img.shields.io/npm/dw/frankfurter-api-client-v2)
![license](https://img.shields.io/npm/l/frankfurter-api-client-v2)
![NPM Unpacked Size](https://img.shields.io/npm/unpacked-size/frankfurter-api-client-v2)

# frankfurter-api-client-v2

A lightweight, type-safe JavaScript/TypeScript client for the <b>Frankfurter Currency Exchange Rates API (Version 2)</b>, designed for developers who want clean abstractions, strong date validation, and a minimal API surface. This package wraps the Frankfurter API with strict input validation, predictable error handling, and zero runtime configuration.

This is the <b>V2</b> version of the client, powered by the official [Frankfurter API V2](https://frankfurter.dev/). No API Keys are required.

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

async function myFunc() {
  try {
    const response = await getLatestRates({
      base: 'EUR',
      quotes: ['USD', 'INR'] /* optional input. for specific currency codes. */,
    });
    console.log(response);
  } catch (error) {
    console.error('Failed to get latest rates:', error.message);
  }
}
/* call */
await myFunc();

/* Sample Response Schema: 200-OK
[
  {
    "date": "2026-04-29",
    "base": "EUR",
    "quote": "AED",
    "rate": 4.2989
  },
  ...
  ...
]
*/
```

2. 📁 Get Historical Rates For Specific Date

```javascript
import { getHistoricalRatesForDate } from 'frankfurter-api-client-v2';

async function myFunc() {
  try {
    const data = await getHistoricalRatesForDate({
      base: 'USD',
      period: { date: 1, month: 5, year: 2015 },
      quotes: ['EUR', 'GBP'] /* optional input. for specific currency codes. */,
    });
    console.log(data);
  } catch (error) {
    console.error('Failed to get historical rates:', error.message);
  }
}
/* call */
await myFunc();

/* Sample Response Schema: 200-OK
[
  {
    "date": "1999-01-04",
    "base": "EUR",
    "quote": "AED",
    "rate": 4.3151
  },
  ...
  ...
]
*/
```

3. 📁 Get Time Series Rates Between Two Dates

```javascript
import { getTimeSeriesRates } from 'frankfurter-api-client-v2';

async function myFunc() {
  try {
    const data = await getTimeSeriesRates({
      base: 'EUR',
      from: { date: 1, month: 1, year: 2025 },
      to: { date: 5, month: 1, year: 2025 },
      quotes: ['USD', 'THB'] /* optional input. for specific currency codes. */,
    });
    console.log(data);
  } catch (error) {
    console.error('Failed to get time series rates:', error.message);
  }
}
/* call */
await myFunc();

/* Sample Response Scheme: 200-OK
[
  {
    "date": "2026-01-01",
    "base": "EUR",
    "quote": "USD",
    "rate": 1.1751
  },
  ...
  ...
]
*/
```

4. 📁 Get Supported Currencies

```javascript
import { getSupportedCurrencies } from 'frankfurter-api-client-v2';

async function myFunc() {
  try {
    const data = await getSupportedCurrencies({
      legacy: false,
    }); /* if true, then gives legacy as well */
    console.log(data);
  } catch (error) {
    console.error('Failed to get supported currencies:', error.message);
  }
}
/* call */
await myFunc();

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
  ...
  ...
]
*/
```

5. 📁 Get Currency Info

```javascript
import { getCurrencyInfo } from 'frankfurter-api-client-v2';

async function myFunc() {
  try {
    const data = await getCurrencyInfo({
      code: 'EUR' /* required - currency code */,
    });
    console.log(data);
  } catch (error) {
    console.error('Failed to get currency info:', error.message);
  }
}
/* call */
await myFunc();

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

async function myFunc() {
  try {
    const data = await getAllProviders();
    console.log(data);
  } catch (error) {
    console.error('Failed to get all providers:', error.message);
  }
}
/* call */
await myFunc();

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
  ...
  ...
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
