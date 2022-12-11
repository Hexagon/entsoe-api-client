import { parse } from "https://deno.land/x/xml/mod.ts";

const ParseDocument = (xmlDocument) => {

    // Parse document
    const doc = parse(xmlDocument);

    // Check that root element exists
    if (!doc.Publication_MarketDocument) {
        if(doc.Acknowledgement_MarketDocument) {
            throw new Error(`Request failed. Code '${doc.Acknowledgement_MarketDocument.Reason.code}', Reason '${doc.Acknowledgement_MarketDocument.Reason.text}'`)
        } else {
            throw new Error("Unknown XML document structure received");
        }
    }

    // Return MarketDocument
    return doc.Publication_MarketDocument;

};

export { ParseDocument };