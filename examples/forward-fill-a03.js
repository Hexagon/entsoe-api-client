/**
 * Example demonstrating curve type A03 forward fill functionality
 * 
 * This example shows how the library now supports forward fill for 
 * curve type A03 (Variable sized block), automatically filling missing 
 * data points with the last known value.
 */

import { ParseDocument } from "../mod.ts";

// Example XML with A03 curve type and sparse data points
const xmlWithA03ForwardFill = `<?xml version="1.0" encoding="UTF-8"?>
<Publication_MarketDocument xmlns="urn:iec62325.351:tc57wg16:451-3:publicationdocument:7:0">
	<mRID>SampleA03ForwardFill</mRID>
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
				<end>2024-01-01T06:00Z</end>
			</timeInterval>
			<resolution>PT1H</resolution>
			<Point>
				<position>1</position>
				<price.amount>100.00</price.amount>
			</Point>
			<Point>
				<position>3</position>
				<price.amount>120.00</price.amount>
			</Point>
			<Point>
				<position>6</position>
				<price.amount>90.00</price.amount>
			</Point>
		</Period>
	</TimeSeries>
</Publication_MarketDocument>`;

// Parse the document
const document = ParseDocument(xmlWithA03ForwardFill);

if (document.rootType === "publication") {
  const timeseries = document.timeseries[0];
  const period = timeseries.periods?.[0];
  
  console.log("Curve Type:", timeseries.curveType); // A03
  console.log("Curve Type Description:", timeseries.curveTypeDescription); // Variable sized block
  console.log("Period Resolution:", period?.resolution); // PT1H
  console.log("Total Points:", period?.points.length); // 6 (forward filled)
  
  console.log("\nData points with forward fill:");
  console.table(period?.points.map(point => ({
    Position: point.position,
    Time: point.startDate.toISOString().substring(0, 19) + 'Z',
    Price: point.price,
    Source: [1, 3, 6].includes(point.position) ? 'Original' : 'Forward Fill'
  })));
  
  console.log("\nForward fill in action:");
  console.log("Position 1: €100.00 (original data)");
  console.log("Position 2: €100.00 (forward filled from position 1)");
  console.log("Position 3: €120.00 (original data)");
  console.log("Position 4: €120.00 (forward filled from position 3)");
  console.log("Position 5: €120.00 (forward filled from position 3)");
  console.log("Position 6: €90.00 (original data)");
}