# entsoe-api-client

Unofficial ENTSO-e REST API Client for Deno and Node. Comprehensive. User-friendly. Minimalistic.

[![Module type: CJS+ESM](https://img.shields.io/badge/npm-cjs%2Besm-brightgreen)](https://www.npmjs.org/package/entsoe-api-client)
[![NPM Downloads](https://img.shields.io/npm/dm/entsoe-api-client.svg)](https://www.npmjs.org/package/entsoe-api-client)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Hexagon/entsoe-api-client/blob/master/LICENSE) 

Check out the full documentation at [https://entsoe-api-client.56k.guru](https://entsoe-api-client.56k.guru)

## Features

  * Supports all requests listed in [Entso-e REST API Documentation](https://transparency.entsoe.eu/content/static_content/Static%20content/web%20api/Guide.html)
  * Supports zip-file endpoints and transparently unzips documents
  * Includes [examples](/examples) that support both Deno and Node
  * Supports both Deno and Node (>=18.0)
  * Written in fully typed [TypeScript](https://www.typescriptlang.org/)
  * Offers ESM (for Deno and Node) and CommonJS (for Node) support
  * Adds descriptions to codes while parsing the documents

## Quick usage

Here's a quick example on how a entsoe api query is made using entsoe-api-client.

```js
// Run ENTSO-e transparency playform query
const result = await QueryPublication(
    typeof process !== "undefined" ?  // Your entsoe api-token by environment variable
        process.env.API_TOKEN // ... in Node
        : Deno.env.get("API_TOKEN"), // ... in Deno
     {
        documentType: "A44",              // A44 - Price document
        processType: "A01",               // A01 - Day ahead
        inDomain: Area("BZN|SE2"),            // In_Domain: For A44 - Electricity price area
        outDomain: Area("BZN|SE2"),           // Out_Domain: For A44 - Electricity price area
        startDateTime: dateToday,         // Start date
        endDateTime: dateTomorrow         // End date
    }
); 
```

For full documentation on installation and usage, refer to the full documentation at [https://entsoe-api-client.56k.guru](https://entsoe-api-client.56k.guru).

Examples can be found in the [/examples](/examples) directory.

To run the examples, pass your ENTSO-e API key as an environment variable called `API_TOKEN`.
**Deno**

Powershell
```
$env:API_TOKEN="your-api-token"; deno run -A .\spot-prices-today.ts
```
Bash
```
API_TOKEN="your-api-token" deno run -A .\spot-prices-today.ts
```

**Node**

Powershell
```
$env:API_TOKEN="your-api-token"; node .\spot-prices-today.ts
```
Bash
```
API_TOKEN="your-api-token" node .\spot-prices-today.ts
```

## Contributing & Support

entsoe-api-client is founded and actively maintained by Hexagon. If you find value in entsoe-api-client and want to contribute:

Code Contributions: See our Contribution Guide for details on how to contribute code.

Sponsorship and Donations: See github.com/sponsors/hexagon

Your trust, support, and contributions drive the project. Every bit, irrespective of its size, is deeply appreciated.


## License

MIT License
