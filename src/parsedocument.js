import { parse } from "https://deno.land/x/xml/mod.ts";

const ParseDocument = (xmlDocument) => {

    // Parse document
    const doc = parse(xmlDocument);

    const rootNode = doc.Publication_MarketDocument || doc.GL_MarketDocument;

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

    // Return MarketDocument
    return rootNode;

};

export { ParseDocument };