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
  import { ParseDocument } from "./src/parsedocument.js";
  
  /**
   * Query ENTSO-e ...
   * @public
   * 
   * @param {string} securityToken
   * @param {string} documentType
   * @param {string} inDomain
   * @param {string} outDomain
   * @param {Date} startDateTime
   * @param {Date} endDateTime
   * 
   */
  const Query = async ( securityToken, documentType, inDomain, outDomain, startDateTime, endDateTime ) => {
    
      const params = new URLSearchParams({
          securityToken
      });
  
      // Validate documentType, add to parameter list
      if (!(documentType in DocumentType)) {
          throw new Error("Invalid document type requested");
      } else {
          params.append("DocumentType", documentType);
      }
  
      // Validate inDomain, add to parameter list
      const foundInDomain = Object.entries(Areas).find(([_key, value]) => value.includes(inDomain) );
      if (!foundInDomain) {
          throw new Error("inDomain not valid");
      } else {
          params.append("In_Domain", foundInDomain[0]);
      }
  
      // Validate outDomain, add to parameter list
      const foundOutDomain = Object.entries(Areas).find(([_key, value]) => value.includes(outDomain));
      if (!foundOutDomain) {
          throw new Error("outDomain not valid");
      } else {
          params.append("Out_Domain", foundOutDomain[0]);
      }
  
      // Validate startDateTime, endDateTime, custruct timeInterval
      if (!(startDateTime instanceof Date && !isNaN(startDateTime))) {
          throw new Error("startDateTime not valid, should be Date object");
      }
      if (!(endDateTime instanceof Date && !isNaN(endDateTime))) {
          throw new Error("endDateTime not valid, should be Date object");
      }
      const timeInterval = `${startDateTime.toISOString()}/${endDateTime.toISOString()}`;
      params.append("TimeInterval", timeInterval);

      // Construct url and get result
      const 
          result = await fetch(`${ENTSOE_ENDPOINT}?${params}`),
          resultText = await result.text();
    
      // Check for 401
      if (result.status === 401) {
        throw new Error("401 Unauthorized. Missing or invalid security token.");
      }

      // Parse result
      const
          resultJson = await ParseDocument(resultText);
      
      return resultJson;
  };
  
  export { Query };