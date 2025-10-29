/**
 * entsoe-api-client
 *
 * @file Functions to parse and validade raw ENTSO-e documents to nice objects
 *
 * @author Hexagon <hexagon@GitHub>
 * @license MIT
 */

import { XMLParser } from "../deps.ts";
import { SourceDocument } from "./documents/common.ts";
import { ParsePublication, PublicationDocument } from "./documents/publication.ts";
import { GLDocument, ParseGL } from "./documents/gl.ts";
import { ParseUnavailability, UnavailabilityDocument } from "./documents/unavailability.ts";
import { ConfigurationDocument, ParseConfiguration } from "./documents/configuration.ts";
import { ParseTransmissionNetwork, TransmissionNetworkDocument } from "./documents/transmissionnetwork.ts";
import { BalancingDocument, ParseBalancing } from "./documents/balancing.ts";
import { CriticalNetworkElementDocument, ParseCriticalNetworkElement } from "./documents/criticalnetworkelement.ts";

/**
 * Takes raw XML from ENTSO-e Rest API, checks the document type, parses using
 * the appropiate parser, ant returns a typed and cleaned object representing the document.
 *
 * Mainly intended to be used internally in entsoe-api-client library through the `Query` function.
 *
 * @public
 * @category Parsing
 *
 * @param d - Raw XML from ENTSO-e Rest API
 *
 * @returns - Typed, cleaned and validated document
 */
const ParseDocument = (
  xmlDocument: string,
): PublicationDocument | GLDocument | UnavailabilityDocument | TransmissionNetworkDocument | BalancingDocument => {
  // Parse XML
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@",
  });
  const doc = parser.parse(xmlDocument) as SourceDocument;

  // Check document type
  if (doc.Publication_MarketDocument) {
    return ParsePublication(doc.Publication_MarketDocument);
  } else if (doc.GL_MarketDocument) {
    return ParseGL(doc.GL_MarketDocument);
  } else if (doc.Unavailability_MarketDocument) {
    return ParseUnavailability(doc.Unavailability_MarketDocument);
  } else if (doc.Configuration_MarketDocument) {
    return ParseConfiguration(doc.Configuration_MarketDocument);
  } else if (doc.TransmissionNetwork_MarketDocument) {
    return ParseTransmissionNetwork(doc.TransmissionNetwork_MarketDocument);
  } else if (doc.Balancing_MarketDocument) {
    return ParseBalancing(doc.Balancing_MarketDocument);
  } else if (doc.CriticalNetworkElement_MarketDocument) {
    return ParseCriticalNetworkElement(doc.CriticalNetworkElement_MarketDocument);
  } else if (doc.Acknowledgement_MarketDocument) {
    const invalidRootNode = doc.Acknowledgement_MarketDocument;
    throw new Error(
      `Request failed. Code '${invalidRootNode.Reason.code}', Reason '${invalidRootNode.Reason.text}'`,
    );
  } else {
    throw new Error("Unknown XML document structure received");
  }
};

export type {
  BalancingDocument,
  ConfigurationDocument,
  CriticalNetworkElementDocument,
  GLDocument,
  PublicationDocument,
  TransmissionNetworkDocument,
  UnavailabilityDocument,
};
export { ParseDocument };
