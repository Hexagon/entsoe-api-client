/**
 * entsoe-api-client
 * 
 * @file Main entrypoint of the library, exports all functions and interfaces from this library this is indended for public use. 
 * 
 * @author Hexagon <hexagon@GitHub>
 * @license MIT
 * 
 * Full license:
 * 
 * Copyright (c) 2022 Hexagon <hexagon@GitHub>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

const ENTSOE_ENDPOINT = "https://web-api.tp.entsoe.eu/api";

import { Areas } from "./src/parameters/areas.js";
import { DocumentType } from "./src/parameters/documenttype.js";
import { GLDocument, ParseDocument, PublicationDocument, UnavailabilityDocument } from "./src/parsedocument.ts";
import { ProcessType } from "./src/parameters/processtype.js";
import { PsrType } from "./src/parameters/psrtype.js";
import { ZipReader, Uint8ArrayReader, TextWriter } from "./deps.ts";

/**
 * All available parameters
 */
interface QueryParameters {
  documentType: string;
  processType?: string;
  psrType?: string;
  inDomain?: string;
  inBiddingZoneDomain?: string;
  biddingZoneDomain?: string;
  outDomain?: string;
  outBiddingZoneDomain?: string;
  startDateTime?: Date;
  endDateTime?: Date;
  startDateTimeUpdate?: Date;
  endDateTimeUpdate?: Date;
  offset?: number;
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

  // Validate outDomain, add to parameter list
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

  if (!params.startDateTime && !params.startDateTimeUpdate) {
    throw new Error("startDateTime or startDateTimeUpdate must be specified");
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
  if (result.headers.get('content-type')?.includes('xml')) {
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

/** Export all functions intended for public use */
export { Query, QueryPublication, QueryGL, QueryUnavailability };

/** Export all types intended for public use */
export type { GLDocument, PublicationDocument, UnavailabilityDocument, QueryParameters };
