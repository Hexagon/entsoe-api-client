---
layout: page
title: "Usage"
nav_order: 3
has_children: true
---

# Usage

---

The structure of the documents and the parameters returned by this library closely resemble what you can find in the [ENTSO-e REST API documentation](https://transparency.entsoe.eu/content/static_content/Static%20content/web%20api/Guide.html). It is recommended that you also take a look there.

If you want a Publication_MarketDocument, the corresponding function in this library is queryPublication. In the resulting document (object), the key receiver_MarketParticipant.mRID will become receiverMarketParticipantId. The same transformation applies to the parameters. We recommend enabling auto-completion in your editor, as the types will provide great help in navigating the parameters and document objects.

Another difference compared to the source documents is that most IDs automatically come with a complementary description, where applicable. For example, `<businessType>B33</..` in the raw XML will result in the keys businessType: "B33" and businessTypeDescription: "Area Control Error" in the output.

> **Note** 
> The full library and method documentation can be found at [deno.land/x/entsoe_api_client](https://deno.land/x/entsoe_api_client@0.9.4/mod.ts).

## Methods

**Querying**
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

**Translations**

Helper functions for translating human-readable descriptions to IDs that can be used by the API.

| Method                      | Interface                                                                               | Description                                                                                                        |
|-----------------------------|-----------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------|
| Area       | (identifier)<br>=><br>string[] \| undefined                                           | Finds internal id (10YL-1001A00074) of all areas<br> having aspecific identier (CTA\|SE, BZN\|DE-LU etc...)        |
| AllAreas        | (identifier)<br>=><br>string \| undefined                                             | Same as above, but return first match                                                                              |
| DocumentType        | (name)<br>=><br>string \| undefined                                             | Get document type from Document name                                                                              |
| ProcessType        | (name)<br>=><br>string \| undefined                                             | Get process type from process name                                                                              |
| BusinessType        | (name)<br>=><br>string \| undefined                                             | Get business type from business name                                                                              |
| PsrType        | (name)<br>=><br>string \| undefined                                             | Get psr type from psr name                                                                              |
| AuctionType        | (name)<br>=><br>string \| undefined                                             | Get auction type from auction name                                                                              |
| AuctionCategory        | (name)<br>=><br>string \| undefined                                             | Get auction category type from auction category name                                                                              |
| Direction        | (name)<br>=><br>string \| undefined                                             | Get direction id from direction name                                                                              |
| DocStatus        | (name)<br>=><br>string \| undefined                                             | Get document status id from document status name                                                                              |
| MarketAgreementType        | (name)<br>=><br>string \| undefined                                             | Get market agreement type id from market agreement type name                                                                              |
| MarketProduct        | (name)<br>=><br>string \| undefined                                             | Get Market product id from market product name                                                                              |

**Parsing**

| Method                      | Interface                                                                               | Description                                                                                                        |
|-----------------------------|-----------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------|
| ParseDocument               | (xmlDocument)<br>=><br>PublicationDocument\|BalancingDoc...                           | Parses raw XML into a typed object. <br>Primarily internal, but exported and usable.                               |

> **Note**
> The parsing function is mainly intended for internal use within the library.

## Query Parameters

All parameters that can be passed to Query(), QueryPublication(), etc.

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
