/**
 * entsoe-api-client
 *
 * @file Functions to make generic and document specific queries to ENTSO-e REST API
 *
 * @author Hexagon <hexagon@GitHub>
 * @license MIT
 */

const ENTSOE_ENDPOINT = "https://web-api.tp.entsoe.eu/api";

import { Areas } from "./definitions/areas.ts";
import { DocumentTypes } from "./definitions/documenttypes.ts";
import {
  BalancingDocument,
  ConfigurationDocument,
  CriticalNetworkElementDocument,
  GLDocument,
  ParseDocument,
  PublicationDocument,
  TransmissionNetworkDocument,
  UnavailabilityDocument,
} from "./documents.ts";
import { ProcessTypes } from "./definitions/processtypes.ts";
import { PsrTypes } from "./definitions/psrtypes.ts";
import { TextWriter, Uint8ArrayReader, ZipReader } from "../deps.ts";

// Type definition for zip entry with getData method
interface ZipEntryWithData {
  getData: (writer: TextWriter) => Promise<void>;
  filename?: string;
  directory?: boolean;
}

// Type guard to check if entry has getData method
function hasGetData(entry: unknown): entry is ZipEntryWithData {
  return !!entry && typeof (entry as Record<string, unknown>).getData === "function";
}
import { BusinessTypes } from "./definitions/businesstypes.ts";
import { QueryParameters } from "./parameters.ts";

/**
 * Helper to validate input parameters
 *
 * @private
 *
 * @param securityToken - Entsoe API security token/key
 * @param params - Object with all required parameters
 * @param [force] - Force querying, do not throw on invalid/unknown parameters
 *
 * @returns - Query string object ready to use
 */
const ComposeQuery = (securityToken: string, params: QueryParameters, force?: boolean | undefined): URLSearchParams => {
  const query = new URLSearchParams({
    securityToken,
  });

  // Validate documentType, add to parameter list
  if (!(params.documentType in DocumentTypes) && !force) {
    throw new Error("Invalid document type requested");
  } else {
    query.append("DocumentType", params.documentType);
  }

  // Validate processType if requested , add to parameter list
  if (params.processType !== undefined) {
    if (!(params.processType in ProcessTypes) && !force) {
      throw new Error("Invalid process type requested");
    } else {
      query.append("ProcessType", params.processType);
    }
  }

  // Validate businessType if requested , add to parameter list
  if (params.businessType !== undefined) {
    if (!(params.businessType in BusinessTypes) && !force) {
      throw new Error("Invalid business type requested");
    } else {
      query.append("BusinessType", params.businessType);
    }
  }

  // Validate processType if requested , add to parameter list
  if (params.psrType !== undefined) {
    if (!(params.psrType in PsrTypes) && !force) {
      throw new Error("Invalid psr type requested");
    } else {
      query.append("PsrType", params.psrType);
    }
  }

  // Validate inDomain, add to parameter list
  if (params.inDomain) {
    if (!(params.inDomain in Areas) && !force) {
      throw new Error("inDomain not valid");
    } else {
      query.append("In_Domain", params.inDomain);
    }
  }

  // Validate inBiddingZoneDomain, add to parameter list
  if (params.inBiddingZoneDomain) {
    if (!(params.inBiddingZoneDomain in Areas) && !force) {
      throw new Error("inBiddingZoneDomain not valid");
    } else {
      query.append("InBiddingZone_Domain", params.inBiddingZoneDomain);
    }
  }

  // Validate biddingZoneDomain, add to parameter list
  if (params.biddingZoneDomain) {
    if (!(params.biddingZoneDomain in Areas) && !force) {
      throw new Error("biddingZoneDomain not valid");
    } else {
      query.append("BiddingZone_Domain", params.biddingZoneDomain);
    }
  }

  // Validate offset, add to parameter list
  if (params.offset !== void 0) {
    if (params.offset > 5000) {
      throw new Error("Offset too large");
    }
    if (params.offset < 0) {
      throw new Error("Offset too small");
    }
    query.append("offset", params.offset.toString());
  }

  // Validate outDomain, add to parameter list
  if (params.outDomain) {
    if (!(params.outDomain in Areas) && !force) {
      throw new Error("outDomain not valid");
    } else {
      query.append("Out_Domain", params.outDomain);
    }
  }

  // Validate outBiddingZoneDomain, add to parameter list
  if (params.outBiddingZoneDomain) {
    if (!(params.outBiddingZoneDomain in Areas) && !force) {
      throw new Error("outBiddingZoneDomain not valid");
    } else {
      query.append("OutBiddingZone_Domain", params.outBiddingZoneDomain);
    }
  }

  // Validate contractMarketAgreementType, add to parameter list
  if (params.contractMarketAgreementType) {
    query.append("Contract_MarketAgreement.Type", params.contractMarketAgreementType);
  }

  // Validate auctionType, add to parameter list
  if (params.auctionType) {
    query.append("Auction.Type", params.auctionType);
  }

  // Validate classificationSequenceAICPosition, add to parameter list
  if (params.classificationSequenceAICPosition) {
    query.append("ClassificationSequence_AttributeInstanceComponent.Position", params.classificationSequenceAICPosition);
  }

  // Validate auctionCategory, add to parameter list
  if (params.auctionCategory) {
    query.append("Auction.Category", params.auctionCategory);
  }

  // Validate connectingDomain, add to parameter list
  if (params.connectingDomain) {
    query.append("connecting_Domain", params.connectingDomain);
  }

  // Validate standardMarketProduct, add to parameter list
  if (params.standardMarketProduct) {
    query.append("Standard_MarketProduct", params.standardMarketProduct);
  }

  // Validate connectingDomain, add to parameter list
  if (params.originalMarketProduct) {
    query.append("Original_MarketProduct", params.originalMarketProduct);
  }

  // Validate connectingDomain, add to parameter list
  if (params.registeredResource) {
    query.append("registeredResource", params.registeredResource);
  }

  // Validate connectingDomain, add to parameter list
  if (params.acquiringDomain) {
    query.append("Acquiring_Domain", params.acquiringDomain);
  }

  // Validate mRID, add to parameter list
  if (params.mRID) {
    query.append("mRID", params.mRID);
  }

  // Validate docStatus, add to parameter list
  if (params.docStatus) {
    query.append("DocStatus", params.docStatus);
  }

  // Validate startDateTimeUpdate, endDateTimeUpdate, construct timeIntervalUpdate
  if (params.startDateTimeUpdate) {
    if (!params.endDateTimeUpdate) {
      throw new Error("endDateTimeUpdate must be specified when startDateTimeUpdate is provided");
    }
    const formatEntsoeIsoDate = (d: Date | string) => {
      if (typeof d === "string") {
        const iso = d.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z$/) ? d : null;
        if (iso) return iso;
        const parsed = new Date(d);
        if (!isNaN(parsed.getTime())) {
          return parsed.toISOString().replace(":00.000Z", ":00Z");
        }
        throw new Error("startDateTimeUpdate/endDateTimeUpdate string must be ISO 8601 UTC (YYYY-MM-DDTHH:mmZ)");
      } else if (d instanceof Date && !isNaN(d.getTime())) {
        return d.toISOString().replace(":00.000Z", ":00Z");
      } else {
        throw new Error("startDateTimeUpdate/endDateTimeUpdate not valid, should be Date object or ISO 8601 string");
      }
    };
    const start = formatEntsoeIsoDate(params.startDateTimeUpdate);
    const end = formatEntsoeIsoDate(params.endDateTimeUpdate as Date | string);
    const timeInterval = `${start}/${end}`;
    query.append("TimeIntervalUpdate", timeInterval);
  }

  // Validate startDateTime, endDateTime, construct timeInterval
  if (params.startDateTime) {
    if (!params.endDateTime) {
      throw new Error("endDateTime must be specified when startDateTime is provided");
    }
    // Accept Date or string (YYYYMMDDHHmm)
    const formatEntsoeIsoDate = (d: Date | string) => {
      // Always return YYYY-MM-DDTHH:mmZ (no seconds)
      const toEntsoe = (date: Date) => {
        // Get YYYY-MM-DDTHH:mmZ
        return date.getUTCFullYear() +
          "-" + String(date.getUTCMonth() + 1).padStart(2, "0") +
          "-" + String(date.getUTCDate()).padStart(2, "0") +
          "T" + String(date.getUTCHours()).padStart(2, "0") +
          ":" + String(date.getUTCMinutes()).padStart(2, "0") + "Z";
      };
      if (typeof d === "string") {
        // Accept ISO 8601 string, or try to parse to Date
        const iso = d.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z$/) ? d : null;
        if (iso) return iso;
        const parsed = new Date(d);
        if (!isNaN(parsed.getTime())) {
          return toEntsoe(parsed);
        }
        throw new Error("startDateTime/endDateTime string must be ISO 8601 UTC (YYYY-MM-DDTHH:mmZ)");
      } else if (d instanceof Date && !isNaN(d.getTime())) {
        return toEntsoe(d);
      } else {
        throw new Error("startDateTime/endDateTime not valid, should be Date object or ISO 8601 string");
      }
    };
    const start = formatEntsoeIsoDate(params.startDateTime);
    const end = formatEntsoeIsoDate(params.endDateTime as Date | string);
    const timeInterval = `${start}/${end}`;
    query.append("TimeInterval", timeInterval);
  }

  // Validate implementationDateAndOrTime, add to parameters
  if (params.implementationDateAndOrTime) {
    if (typeof params.implementationDateAndOrTime !== "string") {
      throw new Error("implementationDateAndOrTime not valid, should be string in ISO8601 format");
    }
    query.append("Implementation_DateAndOrTime", params.implementationDateAndOrTime);
  }

  if ((!params.startDateTime && !params.startDateTimeUpdate && !params.implementationDateAndOrTime) && !force) {
    throw new Error("startDateTime, startDateTimeUpdate or implementationDateAndOrTime must be specified");
  }

  return query;
};

/**
 * Function to request generic documents from the ENTSO-e Rest API
 *
 * Identifies the fetched document, validates key features and returns an array of typed documents
 *
 * Will throw if recieving a document other than the ones currently supported,
 * which is
 *
 *   - Publication_MarketDocument
 *   - GL_MarketDocument
 *   - Unavailability_MarketDocument
 *
 * Note: You should normally determine which document type you'll get
 * and use the properly typed alternative. Example: If you expect a
 * Publication document - use `QueryPublication()` instead of `Query`
 *
 * @public
 *
 * @category Querying
 *
 * @param securityToken - Entsoe API security token/key
 * @param params - Object with all requested parameters
 *
 * @returns - Array of typed documents
 */
const Query = async (securityToken: string, params: QueryParameters): Promise<(PublicationDocument | GLDocument | UnavailabilityDocument)[]> => {
  const query = ComposeQuery(securityToken, params);

  // Construct url and get result
  const result = await fetch(`${ENTSOE_ENDPOINT}?${query}`);

  // Check for 401
  if (result.status === 401) {
    throw new Error("401 Unauthorized. Missing or invalid security token.");
  }

  // Placeholder for documents
  const documents = [];

  // Check for xml response - parse document and return instantly
  // Some endpoints do not respond with a content-type, assume XML om these too
  if (result.headers.get("content-type")?.includes("xml") || !result.headers.has("content-type")) {
    // Parse result
    documents.push(await ParseDocument(await result.text()));

    // Check for zip response - unzip and extract documents
  } else if (result.headers.get("content-type") === "application/zip") {
    // Unzip response, which hopefully is a Uint8Array containing a zip file
    let zipReader;
    try {
      const zipDataReader = new Uint8ArrayReader(new Uint8Array(await result.arrayBuffer()));
      zipReader = new ZipReader(zipDataReader, { useWebWorkers: false });
      for (const xmlFileEntry of await zipReader.getEntries()) {
        // Unzip file
        const stringDataWriter = new TextWriter();

        if (!hasGetData(xmlFileEntry)) break;

        await xmlFileEntry.getData(stringDataWriter);
        const xmlFileData = await stringDataWriter.getData();

        // Parse result
        const result = await ParseDocument(xmlFileData);

        if (result) documents.push(result);
      }
    } finally {
      await zipReader?.close();
    }
  }
  return documents;
};

/**
 * Fetch and process Publication_MarketDocument(s)
 *
 * Identifies the fetched document, validates key features, and returns an array of typed documents.
 *
 * If the query yield something other than Publication_MarketDocument(s), an error will be thrown.
 *
 * @public
 * @category Querying
 *
 * @param securityToken - Entsoe API security token/key
 * @param params - Obkect with all requested parameters
 *
 * @returns - Array of typed documents
 */
const QueryPublication = async (securityToken: string, params: QueryParameters): Promise<PublicationDocument[]> => {
  const result = await Query(securityToken, params);
  if (result && Array.isArray(result) && result.length && result[0].rootType === "publication") return result as PublicationDocument[];
  if (result && Array.isArray(result) && result.length && result[0].rootType !== "publication") {
    throw new Error("Got " + result[0].rootType + " when expecting publication document");
  }
  return [];
};

/**
 * Fetch and process GL_MarketDocument(s)
 *
 * Identifies the fetched document, validates key features, and returns an array of typed documents.
 *
 * If the query yield something other than GL_MarketDocument(s), an error will be thrown.
 *
 * @public
 * @category Querying
 *
 * @param securityToken - Entsoe API security token/key
 * @param params - Object with all requested parameters
 *
 * @returns - Array of typed documents
 */
const QueryGL = async (securityToken: string, params: QueryParameters): Promise<GLDocument[]> => {
  const result = await Query(securityToken, params);
  if (result && Array.isArray(result) && result.length && result[0].rootType === "gl") return result as GLDocument[];
  if (result && Array.isArray(result) && result.length && result[0].rootType !== "gl") {
    throw new Error("Got " + result[0].rootType + " when expecting gl document");
  }
  return [];
};

/**
 * Fetch and process Unavailability_MarketDocument(s)
 *
 * Identifies the fetched docuement, validates key features, and returns an array of typed documents
 *
 * If the query yield smething other than Unavailability_MarketDocument(s), an error will be thrown.
 *
 * @public
 * @category Querying
 *
 * @param securityToken - Entsoe API security token/key
 * @param params - Object with all requested parameters
 *
 * @returns - Array of typed documents
 */
const QueryUnavailability = async (securityToken: string, params: QueryParameters): Promise<UnavailabilityDocument[]> => {
  const result = await Query(securityToken, params);
  if (result && Array.isArray(result) && result.length && result[0].rootType === "unavailability") return result as UnavailabilityDocument[];
  if (result && Array.isArray(result) && result.length && result[0].rootType !== "unavailability") {
    throw new Error("Got " + result[0].rootType + " when expecting unavailability document");
  }
  return [];
};

/**
 * Fetch and process Configuration_MarketDocument(s)
 *
 * Identifies the fetched docuement, validates key features, and returns an array of typed documents
 *
 * If the query yield smething other than Configuration_MarketDocument(s), an error will be thrown.
 *
 * @public
 * @category Querying
 *
 * @param securityToken - Entsoe API security token/key
 * @param params - Object with all requested parameters
 *
 * @returns - Array of typed documents
 */
const QueryConfiguration = async (securityToken: string, params: QueryParameters): Promise<ConfigurationDocument[]> => {
  const result = await Query(securityToken, params);
  if (result && Array.isArray(result) && result.length && result[0].rootType === "configuration") return result as ConfigurationDocument[];
  if (result && Array.isArray(result) && result.length && result[0].rootType !== "configuration") {
    throw new Error("Got " + result[0].rootType + " when expecting configuration document");
  }
  return [];
};

/**
 * Fetch and process Balancing_MarketDocument(s)
 *
 * Identifies the fetched docuement, validates key features, and returns an array of typed documents
 *
 * If the query yield smething other than Balancing_MarketDocument(s), an error will be thrown.
 *
 * @public
 * @category Querying
 *
 * @param securityToken - Entsoe API security token/key
 * @param params - Object with all requested parameters
 *
 * @returns - Array of typed documents
 */
const QueryBalancing = async (securityToken: string, params: QueryParameters): Promise<BalancingDocument[]> => {
  const result = await Query(securityToken, params);
  if (result && Array.isArray(result) && result.length && result[0].rootType === "balancing") return result as BalancingDocument[];
  if (result && Array.isArray(result) && result.length && result[0].rootType !== "balancing") {
    throw new Error("Got " + result[0].rootType + " when expecting balancing document");
  }
  return [];
};

/**
 * Fetch and process TransmissionNetwork_MarketDocument(s)
 *
 * Identifies the fetched docuement, validates key features, and returns an array of typed documents
 *
 * If the query yield smething other than TransmissionNetwork_MarketDocument(s), an error will be thrown.
 *
 * @public
 * @category Querying
 *
 * @param securityToken - Entsoe API security token/key
 * @param params - Object with all requested parameters
 *
 * @returns - Array of typed documents
 */
const QueryTransmissionNetwork = async (securityToken: string, params: QueryParameters): Promise<TransmissionNetworkDocument[]> => {
  const result = await Query(securityToken, params);
  if (result && Array.isArray(result) && result.length && result[0].rootType === "transmissionnetwork") {
    return result as TransmissionNetworkDocument[];
  }
  if (result && Array.isArray(result) && result.length && result[0].rootType !== "transmissionnetwork") {
    throw new Error("Got " + result[0].rootType + " when expecting transmissionnetwork document");
  }
  return [];
};

/**
 * Fetch and process CriticalNetworkElement_MarketDocument(s)
 *
 * Identifies the fetched docuement, validates key features, and returns an array of typed documents
 *
 * If the query yield smething other than CriticalNetworkElement_MarketDocument(s), an error will be thrown.
 *
 * @public
 * @category Querying
 *
 * @param securityToken - Entsoe API security token/key
 * @param params - Object with all requested parameters
 *
 * @returns - Array of typed documents
 */
const QueryCriticalNetworkElement = async (securityToken: string, params: QueryParameters): Promise<CriticalNetworkElementDocument[]> => {
  const result = await Query(securityToken, params);
  if (result && Array.isArray(result) && result.length && result[0].rootType === "criticalnetworkelement") {
    return result as CriticalNetworkElementDocument[];
  }
  if (result && Array.isArray(result) && result.length && result[0].rootType !== "criticalnetworkelement") {
    throw new Error("Got " + result[0].rootType + " when expecting criticalnetworkelement document");
  }
  return [];
};

/** Export all functions intended for public use */
export {
  Query,
  QueryBalancing,
  QueryConfiguration,
  QueryCriticalNetworkElement,
  QueryGL,
  QueryPublication,
  QueryTransmissionNetwork,
  QueryUnavailability,
};
