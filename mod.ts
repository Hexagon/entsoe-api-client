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

interface QueryParameters {
  documentType: string;
  processType?: string;
  psrType?: string;
  inDomain?: string;
  inBiddingZoneDomain?: string;
  outDomain?: string;
  outBiddingZoneDomain?: string;
  startDateTime: Date;
  endDateTime: Date;
}

const Query = async (securityToken: string, params: QueryParameters): Promise<QueryResult> => {
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
      value.includes(params.inDomain)
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
      value.includes(params.inBiddingZoneDomain)
    );
    if (!foundInDomain) {
      throw new Error("inBiddingZoneDomain not valid");
    } else {
      query.append("InBiddingZone_Domain", foundInDomain[0]);
    }
  }

  // Validate outDomain, add to parameter list
  if (params.outDomain) {
    const foundOutDomain = Object.entries(Areas).find(([_key, value]) =>
      value.includes(params.outDomain)
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
      value.includes(params.outBiddingZoneDomain)
    );
    if (!foundOutDomain) {
      throw new Error("outBiddingZoneDomain not valid");
    } else {
      query.append("OutBiddingZone_Domain", foundOutDomain[0]);
    }
  }

  // Validate startDateTime, endDateTime, custruct timeInterval
  if (!(params.startDateTime instanceof Date && !isNaN(params.startDateTime))) {
    throw new Error("startDateTime not valid, should be Date object");
  }
  if (!(params.endDateTime instanceof Date && !isNaN(params.endDateTime))) {
    throw new Error("endDateTime not valid, should be Date object");
  }
  const timeInterval = `${params.startDateTime.toISOString()}/${params.endDateTime.toISOString()}`;
  query.append("TimeInterval", timeInterval);

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

export type { QueryResult };
export { Query };
