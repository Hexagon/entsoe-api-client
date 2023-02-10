/**
 * Main entrypoint of entsoe_api_client.
 * 
 * Re-exports all functions and interfaces that are indended for public use.
 *
 * @module entsoe_api_client
 * @author Hexagon <hexagon@GitHub>
 * @license MIT
 */

export { Query, QueryPublication, QueryGL, QueryUnavailability, QueryConfiguration, QueryBalancing, QueryTransmissionNetwork, QueryCriticalNetworkElement } from "./src/query.ts";
export type { QueryParameters } from "./src/parameters.ts";

export { ParseDocument } from "./src/documents.ts";
export type { ConfigurationDocument, GLDocument, PublicationDocument, UnavailabilityDocument, TransmissionNetworkDocument, CriticalNetworkElementDocument, BalancingDocument } from "./src/documents.ts";

export { FirstAreaByIdentifier } from "./src/definitions/areas.ts";
export { AllAreasByIdentifier } from "./src/definitions/areas.ts";
