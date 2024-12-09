# Advanced Stock Price Checker

Application created as part of the interview process for Peak. Its main functionality is polling stock prices and calculating a rolling average from the last 10 values per stock.

## Running the application

1. Install dependencies `npm i`
1. Create .env by copying .env.example to the same location.
1. A [Finnhub](https://finnhub.io) API key is required for fetching stock prices. `API_FINNHUB_API_KEY` environment variable should be set to this value.
1. The easiest way to run the application with a Postgres instance is by using Docker:

```bash
docker-compose up
```

## Sending requests

The easiest way to try out the endpoints is through the Swagger UI available at http://localhost:3000
