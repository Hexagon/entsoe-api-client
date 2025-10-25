/**
 * Example demonstrating curve type A03 support
 * 
 * This example shows how the library now supports curve type A03 
 * (Variable sized block) in addition to the previously supported A01 and A02.
 */

import { ParseDocument, CurveType } from "../mod.ts";

// Example XML with curve type A03
const xmlWithA03 = `<?xml version="1.0" encoding="UTF-8"?>
<Publication_MarketDocument xmlns="urn:iec62325.351:tc57wg16:451-3:publicationdocument:7:0">
	<mRID>SampleDocumentA03</mRID>
	<revisionNumber>1</revisionNumber>
	<type>A44</type>
	<process.processType>A01</process.processType>
	<createdDateTime>2024-01-01T00:00:00Z</createdDateTime>
	<TimeSeries>
		<mRID>1</mRID>
		<businessType>A43</businessType>
		<curveType>A03</curveType>
		<Period>
			<timeInterval>
				<start>2024-01-01T00:00Z</start>
				<end>2024-01-02T00:00Z</end>
			</timeInterval>
			<resolution>PT1H</resolution>
			<Point>
				<position>1</position>
				<price.amount>50.00</price.amount>
			</Point>
		</Period>
	</TimeSeries>
</Publication_MarketDocument>`;

// Parse the document
const document = ParseDocument(xmlWithA03);

if (document.rootType === "publication") {
  const timeseries = document.timeseries[0];
  
  console.log("Curve Type:", timeseries.curveType); // A03
  console.log("Curve Type Description:", timeseries.curveTypeDescription); // Variable sized block
  
  // You can also use the helper function to find curve types by name
  console.log("A03 code:", CurveType("Variable sized block")); // A03
  console.log("A01 code:", CurveType("Sequential fixed size block")); // A01
  console.log("A02 code:", CurveType("Point")); // A02
}