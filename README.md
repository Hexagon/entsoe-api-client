# entsoe-api-client

ENTSO-e transparency platform API Client built for Deno. Complete. Easy to use. Minimal.

[![Deno CI](https://github.com/Hexagon/entsoe-api-client/actions/workflows/deno.yml/badge.svg)](https://github.com/Hexagon/entsoe-api-client/actions/workflows/deno.yml) 
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Hexagon/entsoe-api-client/blob/master/LICENSE) 

*   Works in Deno >=1.16
*   Supports [TypeScript](https://www.typescriptlang.org/)
*   Support most aspects of Entso-e transparency platform REST API
*   Unzips and parses zip-file endpoints (e.g. outage documents) transparently

### Examples

See [/examples](/examples) folder for complete examples, like getting spot prices or total generation per hour.

Pass your entso-e API key by environment variable API_TOKEN, example for getting todays spot prices.

Powershell

```
$env:API_TOKEN="your-api-token"; deno run -A .\spot-prices-today.js
```

Bash

```
API_TOKEN="your-api-token" deno run -A .\generation-today.js
```

## Contributing

See [Contribution Guide](/CONTRIBUTING.md)

## License

MIT
