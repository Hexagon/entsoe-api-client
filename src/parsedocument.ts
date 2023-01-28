import { parse } from "https://deno.land/x/xml@2.0.4/mod.ts";

interface EntsoeQueryTimeInterval {
  start: string;
}

interface EntsoeQueryPoint {
  position: number;
  "price.amount"?: number;
  quantity?: number;
}

interface EntsoeQueryPeriod {
  timeInterval: EntsoeQueryTimeInterval;
  Point: EntsoeQueryPoint[];
  resolution: string;
}

interface EntsoeQueryPeriodMktPSRType {
  psrType: string;
}
interface EntsoeQueryEntry {
  Period: EntsoeQueryPeriod;
  "outBiddingZone_Domain.mRID"?: string;
  "inBiddingZone_Domain.mRID"?: string;
  MktPSRType?: EntsoeQueryPeriodMktPSRType;
} 

interface QueryResult {
  TimeSeries: EntsoeQueryEntry[];
}

interface UnsafeQueryResult {
  TimeSeries: EntsoeQueryEntry | EntsoeQueryEntry[];
}

interface InvalidQueryResultReason {
  code: string;
  text: string;
}

interface InvalidQueryResult {
  Reason: InvalidQueryResultReason;
}

const ParseDocument = (xmlDocument: string): QueryResult => {
  // Parse document
  const doc = parse(xmlDocument);

  const rootNode: UnsafeQueryResult =
    (doc.Publication_MarketDocument || doc.GL_MarketDocument || doc.Unavailability_MarketDocument) as unknown as UnsafeQueryResult;

  // Check that root element exists
  if (!rootNode) {
    if (doc.Acknowledgement_MarketDocument) {
      const invalidRootNode: InvalidQueryResult = doc.Acknowledgement_MarketDocument as unknown as InvalidQueryResult;
      throw new Error(
        `Request failed. Code '${invalidRootNode.Reason.code}', Reason '${invalidRootNode.Reason.text}'`,
      );
    } else {
      throw new Error("Unknown XML document structure received");
    }
  }

  // Check if TimeSeries is a single element or Array
  // - If single element, convert to array with one element
  if (rootNode.TimeSeries && !Array.isArray(rootNode.TimeSeries)) {
    rootNode.TimeSeries = [rootNode.TimeSeries];
  }

  const checkedDocument: QueryResult = rootNode as unknown as QueryResult;

  // Return MarketDocument
  return checkedDocument;
};

export type { QueryResult };
export { ParseDocument };
