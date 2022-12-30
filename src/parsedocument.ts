import { parse } from "https://deno.land/x/xml/mod.ts";


interface EntsoeQueryTimeInterval {
    start: string;
  }
  
  interface EntsoeQueryPoint {
    position: string;
    "price.amount": string;
  }
  
  interface EntsoeQueryPeriod {
    timeInterval: EntsoeQueryTimeInterval;
    Point: EntsoeQueryPoint[];
  }
  
  interface EntsoeQueryEntry {
    Period: EntsoeQueryPeriod;
  }
  
  interface QueryResult {
    TimeSeries: EntsoeQueryEntry[]
  }

  interface UnsafeQueryResult {
    TimeSeries: EntsoeQueryEntry | EntsoeQueryEntry[]
  }

const ParseDocument = (xmlDocument: string): QueryResult => {

    // Parse document
    const doc = parse(xmlDocument);

    const rootNode: UnsafeQueryResult = (doc.Publication_MarketDocument || doc.GL_MarketDocument) as unknown as UnsafeQueryResult;

    // Check that root element exists
    if (!rootNode) {
        if(doc.Acknowledgement_MarketDocument) {
            throw new Error(`Request failed. Code '${doc.Acknowledgement_MarketDocument.Reason.code}', Reason '${doc.Acknowledgement_MarketDocument.Reason.text}'`)
        } else {
            console.log(doc);
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