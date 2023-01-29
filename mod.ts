/* ------------------------------------------------------------------------------------

  entsoe-api-client - MIT License - Hexagon <hexagon@GitHub>

  ------------------------------------------------------------------------------------

  License:

	Copyright (c) 2022 Hexagon <hexagon@GitHub>

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.

  ------------------------------------------------------------------------------------  */

const ENTSOE_ENDPOINT = "https://web-api.tp.entsoe.eu/api";

import { Areas } from "./src/parameters/areas.js";
import { DocumentType } from "./src/parameters/documenttype.js";
import { ParseDocument, QueryResult } from "./src/parsedocument.ts";
import { ProcessType } from "./src/parameters/processtype.js";
import { PsrType } from "./src/parameters/psrtype.js";
import { ZipReader, Uint8ArrayReader, TextWriter } from "./deps.js";

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

const Query = async (securityToken: string, params: QueryParameters): Promise<QueryResult> => {

  const query = ComposeQuery(securityToken, params);

  // Construct url and get result
  const result = await fetch(`${ENTSOE_ENDPOINT}?${query}`),
    resultText = await result.text();

  // Check for 401
  if (result.status === 401) {
    throw new Error("401 Unauthorized. Missing or invalid security token.");
  }

  // Parse result
  const resultJson: QueryResult = await ParseDocument(resultText);

  return resultJson;
};


const QueryZipped = async (securityToken: string, params: QueryParameters): Promise<QueryResult[]> => {

  const query = ComposeQuery(securityToken, params);
  
  // Construct url and get result
  const result = await fetch(`${ENTSOE_ENDPOINT}?${query}`);

  // Check for 401
  if (result.status === 401) {
    throw new Error("401 Unauthorized. Missing or invalid security token.");
  }

  // Check for xml - handle separately
  if (result.headers.get('content-type') === 'application/xml') {
    // Parse result
    const resultJson: QueryResult = await ParseDocument(await result.text());
    return [resultJson];
  }

  // Placeholder for documents
  const documents: QueryResult[] = [];
  
  // Unzip response, which hopefully is a Uint8Array containing a zip file
  let zipReader;
  try {
      const zipDataReader = new Uint8ArrayReader(new Uint8Array(await result.arrayBuffer()))
      zipReader = new ZipReader(zipDataReader);
      for(const xmlFileEntry of await zipReader.getEntries()) {
          // Unzip file
          const stringDataWriter = new TextWriter();
          await xmlFileEntry.getData(stringDataWriter);
          const xmlFileData = await stringDataWriter.getData()
                        
          // Parse result
          const resultJson: QueryResult = await ParseDocument(xmlFileData);

          documents.push(resultJson);
      }  
  } finally {
      await zipReader?.close();
  }

  return documents;

};

export type { QueryResult };
export { Query, QueryZipped };
