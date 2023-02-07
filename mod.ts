/**
 * Main entrypoint of entsoe_api_client.
 * 
 * Exports all functions and interfaces that are indended for public use.
 *
 * @module entsoe_api_client
 * @author Hexagon <hexagon@GitHub>
 * @license MIT
 */

const ENTSOE_ENDPOINT = "https://web-api.tp.entsoe.eu/api";

import { Areas } from "./src/parameters/areas.js";
import { DocumentType } from "./src/parameters/documenttype.js";
import { ConfigurationDocument, GLDocument, ParseDocument, PublicationDocument, UnavailabilityDocument, TransmissionNetworkDocument, CriticalNetworkElementDocument, BalancingDocument } from "./src/parsedocument.ts";
import { ProcessType } from "./src/parameters/processtype.js";
import { PsrType } from "./src/parameters/psrtype.js";
import { ZipReader, Uint8ArrayReader, TextWriter } from "./deps.ts";
import { BusinessType } from "./src/parameters/businesstype.js";

/**
 * All available parameters
 */
interface QueryParameters {

  /** DocumentType */
  documentType: string;

  /** ProcessType */
  processType?: string;

  /** BusinessType */
  businessType?: string;
  
  /** PsrType */
  psrType?: string;
  
  /** In_Domain */
  inDomain?: string;
  
  /** InBiddingZone_Domain */
  inBiddingZoneDomain?: string;

  /** BiddingZone_Domain */
  biddingZoneDomain?: string;
  
  /** Out_Domain */
  outDomain?: string;

  /** OutBiddingZone_Domain */
  outBiddingZoneDomain?: string;

  /** Combine with endDateTime to construct a TimeInterval */
  startDateTime?: Date;

  /** Combine with startDateTime to construct a TimeInterval  */
  endDateTime?: Date;

  /** Combine with endDateTimeUpdate to cnstruct a TimeIntervalUpdate */
  startDateTimeUpdate?: Date;

  /** Combine with startDateTimeUpdate to cnstruct a TimeIntervalUpdate */
  endDateTimeUpdate?: Date;

  /** Offset - Enables fetching more than X documents by using "pagination" */
  offset?: number;

  /** Implementation_DateAndOrTime, ISO8601 string */
  implementationDateAndOrTime?: string;

  /** Contract_MarketAgreement.Type */
  contractMarketAgreementType?: string;

  /** Auction.Type */
  auctionType?: string;

  /** Auction.Category */
  auctionCategory?: string;

  /** ClassificationSequence_AttributeInstanceComponent.Position */
  classificationSequenceAICPosition?: string;

  /** connecting_Domain */
  connectingDomain?: string;

  /** Standard_MarketProduct */
  standardMarketProduct?: string;

  /** Original_MarketProduct */
  originalMarketProduct?: string;

  /** registeredResource */
  registeredResource?: string;

  /** Acquiring_Domain */
  acquiringDomain?: string;

  /** mRID */
  mRID?: string;

  /** DocStatus */
  docStatus?: string;
  
}

/**
 * Helper to validate input parameters
 * 
 * @private
 * 
 * @param securityToken - Entsoe API security token/key
 * @param params - Object with all required parameters
 * 
 * @returns - Query string object ready to use
 */
const ComposeQuery = (securityToken: string, params: QueryParameters) : URLSearchParams => {

  const query = new URLSearchParams({
    securityToken,
  });

  // Validate documentType, add to parameter list
  if (!(params.documentType in DocumentType)) {
    throw new Error("Invalid document type requested");
  } else {
    query.append("DocumentType", params.documentType);
  }

  // Validate processType if requested , add to parameter list
  if (params.processType !== undefined) {
    if (!(params.processType in ProcessType)) {
      throw new Error("Invalid process type requested");
    } else {
      query.append("ProcessType", params.processType);
    }
  }

  // Validate businessType if requested , add to parameter list
  if (params.businessType !== undefined) {
    if (!(params.businessType in BusinessType)) {
      throw new Error("Invalid business type requested");
    } else {
      query.append("BusinessType", params.businessType);
    }
  }

  // Validate processType if requested , add to parameter list
  if (params.psrType !== undefined) {
    if (!(params.psrType in PsrType)) {
      throw new Error("Invalid psr type requested");
    } else {
      query.append("PsrType", params.psrType);
    }
  }

  // Validate inDomain, add to parameter list
  if (params.inDomain) {
    const foundInDomain = Object.entries(Areas).find(([_key, value]) =>
      params.inDomain && value.includes(params.inDomain)
    );
    if (!foundInDomain) {
      throw new Error("inDomain not valid");
    } else {
      query.append("In_Domain", foundInDomain[0]);
    }
  }

  // Validate inBiddingZoneDomain, add to parameter list
  if (params.inBiddingZoneDomain) {
    const foundInDomain = Object.entries(Areas).find(([_key, value]) =>
      params.inBiddingZoneDomain && value.includes(params.inBiddingZoneDomain)
    );
    if (!foundInDomain) {
      throw new Error("inBiddingZoneDomain not valid");
    } else {
      query.append("InBiddingZone_Domain", foundInDomain[0]);
    }
  }

  // Validate biddingZoneDomain, add to parameter list
  if (params.biddingZoneDomain) {
    const foundInDomain = Object.entries(Areas).find(([_key, value]) =>
      params.biddingZoneDomain && value.includes(params.biddingZoneDomain)
    );
    if (!foundInDomain) {
      throw new Error("biddingZoneDomain not valid");
    } else {
      query.append("BiddingZone_Domain", foundInDomain[0]);
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
    const foundOutDomain = Object.entries(Areas).find(([_key, value]) =>
      params.outDomain && value.includes(params.outDomain)
    );
    if (!foundOutDomain) {
      throw new Error("outDomain not valid");
    } else {
      query.append("Out_Domain", foundOutDomain[0]);
    }
  }

  // Validate outBiddingZoneDomain, add to parameter list
  if (params.outBiddingZoneDomain) {
    const foundOutDomain = Object.entries(Areas).find(([_key, value]) => 
      params.outBiddingZoneDomain && value.includes(params.outBiddingZoneDomain)
    );
    if (!foundOutDomain) {
      throw new Error("outBiddingZoneDomain not valid");
    } else {
      query.append("OutBiddingZone_Domain", foundOutDomain[0]);
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
  
  // Validate startDateTimeUpdate, endDateTimeUpdate, custruct timeIntervalUpdate
  if (params.startDateTimeUpdate) {
    if (!(params.startDateTimeUpdate instanceof Date && !isNaN(params.startDateTimeUpdate.getTime()))) {
      throw new Error("startDateTimeUpdate not valid, should be Date object");
    }
    if (!(params.endDateTimeUpdate instanceof Date && !isNaN(params.endDateTimeUpdate.getTime()))) {
      throw new Error("endDateTimeUpdate not valid, should be Date object");
    }
    const timeInterval = `${params.startDateTimeUpdate.toISOString()}/${params.endDateTimeUpdate.toISOString()}`;
    query.append("TimeIntervalUpdate", timeInterval);
  }
  
  // Validate startDateTime, endDateTime, custruct timeInterval
  if (params.startDateTime) {
    if (!(params.startDateTime instanceof Date && !isNaN(params.startDateTime.getTime()))) {
      throw new Error("startDateTime not valid, should be Date object");
    }
    if (!(params.endDateTime instanceof Date && !isNaN(params.endDateTime.getTime()))) {
      throw new Error("endDateTime not valid, should be Date object");
    }
    const timeInterval = `${params.startDateTime.toISOString()}/${params.endDateTime.toISOString()}`;
    query.append("TimeInterval", timeInterval);
  }

  // Validate implementationDateAndOrTime, add to parameters
  if (params.implementationDateAndOrTime) {
    if (typeof params.implementationDateAndOrTime !== "string") {
      throw new Error("implementationDateAndOrTime not valid, should be string in ISO8601 format");
    }
    query.append("Implementation_DateAndOrTime", params.implementationDateAndOrTime);
  }

  if (!params.startDateTime && !params.startDateTimeUpdate && !params.implementationDateAndOrTime) {
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
 * @param securityToken - Entsoe API security token/key
 * @param params - Object with all requested parameters
 * 
 * @returns - Array of typed documents 
 */
const Query = async (securityToken: string, params: QueryParameters): Promise<(PublicationDocument|GLDocument|UnavailabilityDocument)[]> => {

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
  if (result.headers.get('content-type')?.includes('xml') || !result.headers.has('content-type')) {

    // Parse result
    documents.push(await ParseDocument(await result.text()))
  
  // Check for zip response - unzip and extract documents
  } else if (result.headers.get('content-type') === 'application/zip') {

    // Unzip response, which hopefully is a Uint8Array containing a zip file
    let zipReader;
    try {
        const zipDataReader = new Uint8ArrayReader(new Uint8Array(await result.arrayBuffer()))
        zipReader = new ZipReader(zipDataReader, { useWebWorkers: false });
        for(const xmlFileEntry of await zipReader.getEntries()) {
            // Unzip file
            const stringDataWriter = new TextWriter();
            await xmlFileEntry.getData(stringDataWriter);
            const xmlFileData = await stringDataWriter.getData()
                          
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
 * 
 * @param securityToken - Entsoe API security token/key
 * @param params - Obkect with all requested parameters
 * 
 * @returns - Array of typed documents 
 */
const QueryPublication = async (securityToken: string, params: QueryParameters): Promise<PublicationDocument[]> => {
  const result = await Query(securityToken, params);
  if (result && Array.isArray(result) && result.length && result[0].rootType === "publication") return result as PublicationDocument[];
  if (result && Array.isArray(result) && result.length && result[0].rootType !== "publication") throw new Error("Got " + result[0].rootType + " when expecting publication document")
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
 * 
 * @param securityToken - Entsoe API security token/key
 * @param params - Object with all requested parameters
 * 
 * @returns - Array of typed documents 
 */
const QueryGL = async (securityToken: string, params: QueryParameters): Promise<GLDocument[]> => {
  const result = await Query(securityToken, params);
  if (result && Array.isArray(result) && result.length && result[0].rootType === "gl") return result as GLDocument[];
  if (result && Array.isArray(result) && result.length && result[0].rootType !== "gl") throw new Error("Got " + result[0].rootType + " when expecting gl document")
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
 * 
 * @param securityToken - Entsoe API security token/key
 * @param params - Object with all requested parameters
 * 
 * @returns - Array of typed documents 
 */
const QueryUnavailability = async (securityToken: string, params: QueryParameters): Promise<UnavailabilityDocument[]> => {
  const result = await Query(securityToken, params);
  if (result && Array.isArray(result) && result.length && result[0].rootType === "unavailability") return result as UnavailabilityDocument[];
  if (result && Array.isArray(result) && result.length && result[0].rootType !== "unavailability") throw new Error("Got " + result[0].rootType + " when expecting unavailability document")
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
 * 
 * @param securityToken - Entsoe API security token/key
 * @param params - Object with all requested parameters
 * 
 * @returns - Array of typed documents 
 */
const QueryConfiguration = async (securityToken: string, params: QueryParameters): Promise<ConfigurationDocument[]> => {
  const result = await Query(securityToken, params);
  if (result && Array.isArray(result) && result.length && result[0].rootType === "configuration") return result as ConfigurationDocument[];
  if (result && Array.isArray(result) && result.length && result[0].rootType !== "configuration") throw new Error("Got " + result[0].rootType + " when expecting configuration document")
  return [];
};

/** Export all functions intended for public use */
export { Query, QueryPublication, QueryGL, QueryUnavailability, QueryConfiguration };

/** Export all types intended for public use */
export type { GLDocument, PublicationDocument, UnavailabilityDocument, ConfigurationDocument, QueryParameters, TransmissionNetworkDocument, CriticalNetworkElementDocument, BalancingDocument};
