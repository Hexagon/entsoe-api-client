# entsoe-api-client

ENTSO-e transparency platform API Client. Complete. Easy to use. Minimal.

[![Deno CI](https://github.com/Hexagon/entsoe-api-client/actions/workflows/deno.yml/badge.svg)](https://github.com/Hexagon/entsoe-api-client/actions/workflows/deno.yml) 
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Hexagon/entsoe-api-client/blob/master/LICENSE) 

*   Works in Deno >=1.16
*   Works in Node >=14
*   Support most aspects of Entso-e transparency platform REST API
*   Unzips and parses zip-file endpoints (e.g. outage documents) transparently
*   Includes examples for getting Outages, Spot-prices, actual generation and generation forecast
*   Native [TypeScript](https://www.typescriptlang.org/) typings

### Documentation

Full documentation is available at [https://deno.land/x/entsoe_api_client/mod.ts](https://deno.land/x/entsoe_api_client/mod.ts)

> **Note**
> These are the document types currently supported:
>
> - Publication_MarketDocument
> - GL_MarketDocument
> - Unavailability_MarketDocument
> - Configuration_MarketDocument
>
> Contributions to handling more document types would be highly appreciated.

### Installation

#### Deno

```javascript
import { QueryConfiguration } from "https://deno.land/x/entsoe_api_client/mod.ts";
```

#### Node

```
npm install entsoe-api-client --save
```

### Examples

Examples can be found in the [/examples](/examples) directory.

Pass your ENTSO-e API key by environment variable API_TOKEN when running the examples.

#### Deno

Powershell

```
$env:API_TOKEN="your-api-token"; deno run -A .\spot-prices-today.ts
```

Bash

```
API_TOKEN="your-api-token" deno run -A .\spot-prices-today.ts
```

#### Node

Powershell

```
$env:API_TOKEN="your-api-token"; node .\spot-prices-today.ts
```

Bash

```
API_TOKEN="your-api-token" node .\spot-prices-today.ts
```

## Contributing

All contributions are welcome. 

See [Contribution Guide](/CONTRIBUTING.md)

> **Note**
> Please run `deno task precommit` before each commit, to make sure every file is tested/formatted/linted to standards.

## License

MIT
