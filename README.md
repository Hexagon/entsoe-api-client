# entsoe-api-client

ENTSO-e transparency platform API Client built for Deno. Complete. Easy to use. Minimal.

[![Deno CI](https://github.com/Hexagon/entsoe-api-client/actions/workflows/deno.yml/badge.svg)](https://github.com/Hexagon/entsoe-api-client/actions/workflows/deno.yml) 
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Hexagon/entsoe-api-client/blob/master/LICENSE) 

*   Works in Deno >=1.16
*   Supports [TypeScript](https://www.typescriptlang.org/)
*   Support most aspects of Entso-e transparency platform REST API
*   Unzips and parses zip-file endpoints (e.g. outage documents) transparently
*   Includes examples for getting Outages, Spot-prices, actual generation and generation forecast

### Examples

See [/examples](/examples) folder for complete examples.

Pass your entso-e API key by environment variable API_TOKEN when running the examples.

To get todays spot prices:

Powershell

```
$env:API_TOKEN="your-api-token"; deno run -A .\spot-prices-today.ts
```

Bash

```
API_TOKEN="your-api-token" deno run -A .\spot-prices-today.ts
```

## Contributing

All contributions are welcome. See [Contribution Guide](/CONTRIBUTING.md)

## License

MIT
