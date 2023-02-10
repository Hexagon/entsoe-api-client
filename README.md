# entsoe-api-client

Unofficial ENTSO-e REST API Client for Deno and Node. Complete. Easy to use. Minimal.

[![Module type: CJS+ESM](https://img.shields.io/badge/npm-cjs%2Besm-brightgreen)](https://www.npmjs.org/package/entsoe-api-client)
[![NPM Downloads](https://img.shields.io/npm/dm/entsoe-api-client.svg)](https://www.npmjs.org/package/entsoe-api-client)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Hexagon/entsoe-api-client/blob/master/LICENSE) 


## Features

  * Supports all requests listed in [Entso-e REST API Documentation](https://transparency.entsoe.eu/content/static_content/Static%20content/web%20api/Guide.html)
  * Support zip-file endpoints, unzips documents transparently
  * [Examples](/examples) written to support both Node and Deno
  * Supports Deno *and* Node
  * Fully Typed, written in [TypeScript](https://www.typescriptlang.org/)
  * ESM (Deno, Node) and CommonJS (Node) support
  * Adds description to codes while parsing the documents


## Installation

Make sure to use a recent version of your runtime, Node.js `>=18` and Deno `>=1.26` is supported.

**Deno**
```javascript
import { QueryConfiguration } from "https://deno.land/x/entsoe_api_client/mod.ts";
```

**Node**
```
npm install entsoe-api-client --save
```


## Documentation

Documents structure and parameters returned by this library closely resemble what you find in [ENTSO-e REST API documentation](https://transparency.entsoe.eu/content/static_content/Static%20content/web%20api/Guide.html), so have a look there too.

If you want a `Publication_MarketDocument`, the corresponding function in this library is `QueryPublication`. In the resulting document (object), the key `receiver_MarketParticipant.mRID` will become `receiverMarketParticipantId`. The same goes for parameters. We recommend have auto-completion enabled in your editor, the types will give great help in navigating the parameters and document objects.

Another difference compared to source documents is that most ids automatically get a complementary description, where applicable. 
As an example `businessType`=`B33` in the raw xml will result in keys `businessType: "B33"` and `businessTypeDescription: "Area Control Error"` in the output.

> **Note** 
> Full library and method documentation can be found at [deno.land/x/entsoe_api_client](https://deno.land/x/entsoe_api_client@0.9.4/mod.ts).

### Methods

| Method                      | Interface                                                                               | Description                                                                                                        |
|-----------------------------|-----------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------|
| Query                       | (securityToken, params)<br>=><br>Promise<unknown[]>                  | Fetch any document, and return a array of typed and<br>parsed JavaScript object(s). Primarily internal, but exported. |
| QueryPublication            | (securityToken, params)<br>=><br>Promise<PublicationDocument[]>      | Request Publication_MarketDocument(s), and return<br>a array of typed and parsed JavaScript object(s)                 |
| QueryGL                     | (securityToken, params)<br>=><br>Promise<GLDocument[]>               | Same, for GL_MarketDocument                                                                                        |
| QueryUnavailability         | (securityToken, params)<br>=><br>Promise<UnavailabilityDocument[]>   | Same, for Unavailability_MarketDocument                                                                            |
| QueryConfiguration          | (securityToken, params)<br>=><br>Promise<ConfigurationDocument[]>    | Same, for Configuration_MarketDocument                                                                             |
| QueryBalancing              | (securityToken, params)<br>=><br>Promise<BalancingDocument[]>        | Same, for Balancing_MarketDocument(s)                                                                              |
| QueryTransmissionNetwork    | (securityToken, params)<br>=><br>Promise<TransmissionNetworkD...>    | Same, for Transmission_MarketDocument(s)                                                                           |
| QueryCriticalNetworkElement | (securityToken, params)<br>=><br>Promise<CriticalNetworkEleme...>    | Same, for CriticalNetworkElement_MarketDocument(s)                                                                 |
| ParseDocument               | (xmlDocument)<br>=><br>PublicationDocument\|BalancingDoc...                           | Parses raw XML into a typed object. <br>Primarily internal, but exported and usable.                               |
| FirstAreaByIdentifier       | (identifier)<br>=><br>string[] \| undefined                                           | Finds internal id (10YL-1001A00074) of all areas<br> having aspecific identier (CTA\|SE, BZN\|DE-LU etc...)        |
| AllAreasByIdentifier        | (identifier)<br>=><br>string \| undefined                                             | Same as above, but return first match                                                                              |

### Parameters

All parameters that can be passes to `Query()`, `QueryPublication()` etc.

| Parameter Name                         | Type   | Name in ENSO-e REST API                     | Note                                                       |
|----------------------------------------|--------|---------------------------------------------|------------------------------------------------------------|
| documentType                           | string | DocumentType                                |                                                            |
| processType (optional)                 | string | ProcessType                                 |                                                            |
| businessType (optional)                | string | BusinessType                                |                                                            |
| psrType (optional)                     | string | PsrType                                     |                                                            |
| inDomain (optional)                    | string | In_Domain                                   |                                                            |
| inBiddingZoneDomain (optional)         | string | InBiddingZone_Domain                        |                                                            |
| biddingZoneDomain (optional)           | string | BiddingZone_Domain                          |                                                            |
| outDomain (optional)                   | string | Out_Domain                                  |                                                            |
| outBiddingZoneDomain (optional)        | string | OutBiddingZone_Domain                       |                                                            |
| startDateTime(optional)                | Date   | TimeInterval                                | ISO8601 string                                             |
| endDateTime (optional)                 | Date   | TimeInterval                                | ISO8601 string                                             |
| startDateTimeUpdate (optional)         | Date   | TimeIntervalUpdate                          | ISO8601 string                                             |
| endDateTimeUpdate (optional)           | Date   | TimeIntervalUpdate                          | ISO8601 string                                             |
| offset (optional)                      | number | Offset                                      | Enables fetching more than x documents by using pagination |
| implementationDateAndOrTime (optional) | string | Implementation_DateAndOrTime                | ISO8601 string                                             |
| contractMarketAgreementType (optional) | string | Contract_MarketAgreement.Type               |                                                            |
| auctionType (optional)                 | string | Auction.Type                                |                                                            |
| auctionCategory (optional)             | string | Auction.Category                            |                                                            |
| classificationSequenceAICPosition (optional)| string | ClassificationSequence_(...).Position  |                                                            |
| connectingDomain (optional)            | string | connecting_Domain                           |                                                            |
| standardMarketProduct (optional)       | string | Standard_MarketProduct                      |                                                            |
| originalMarketProduct(optional)        | string | Original_MarketProduct                      |                                                            |
| registeredResource (optional)          | string | registeredResource                          |                                                            |
| acquiringDomain (optional)             | string | Acquiring_Domain                            |                                                            |
| mRID (optional)                        | string | mRID                                        |                                                            |
| docStatus (optional)                   | string | DocStatus                                   |                                                            |

## Examples

Examples can be found in the [/examples](/examples) directory.

To run the examples, pass your ENTSO-e API key by environment variable `API_TOKEN`.

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

## Contributing

[![Deno CI](https://github.com/Hexagon/entsoe-api-client/actions/workflows/deno.yml/badge.svg)](https://github.com/Hexagon/entsoe-api-client/actions/workflows/deno.yml) 
[![Node CI](https://github.com/Hexagon/entsoe-api-client/actions/workflows/nodejs.yml/badge.svg)](https://github.com/Hexagon/entsoe-api-client/actions/workflows/nodejs.yml) 

All contributions are welcome.

Module is developed in Deno. Node module is generated by [dnt](https://deno.land/manual@v1.30.3/advanced/publishing/dnt), using [scripts/build_npm.ts](/scripts/build_npm.ts).

See [Contribution Guide](/CONTRIBUTING.md)

> **Note**
> Please run `deno task precommit` before each commit, to make sure every file is tested/formatted/linted to standards.


## Donations

Sponsor me on GitHub, or

<a href='https://ko-fi.com/C1C7IEEYF' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi1.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>


## License

MIT
