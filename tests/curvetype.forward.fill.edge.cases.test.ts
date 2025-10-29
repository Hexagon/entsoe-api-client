import { assertEquals } from "https://deno.land/std@0.128.0/testing/asserts.ts";
import { ParseDocument, PublicationDocument } from "../src/documents.ts";

Deno.test("Test forward fill edge cases for A03 curve type", async function (t) {
  // Test A03 with missing first position - should not create points with undefined values
  await t.step("A03 with missing first position should skip undefined values", async () => {
    const xmlMissingFirst = `<?xml version="1.0" encoding="UTF-8"?>
<Publication_MarketDocument xmlns="urn:iec62325.351:tc57wg16:451-3:publicationdocument:7:0">
	<mRID>TestA03MissingFirst</mRID>
	<revisionNumber>1</revisionNumber>
	<type>A44</type>
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
				<position>3</position>
				<price.amount>55.00</price.amount>
			</Point>
			<Point>
				<position>5</position>
				<price.amount>60.00</price.amount>
			</Point>
		</Period>
	</TimeSeries>
</Publication_MarketDocument>`;

    const result = ParseDocument(xmlMissingFirst) as PublicationDocument;
    const points = result.timeseries[0].periods?.[0].points;

    // Should only have 4 points: position 3, 4, 5, 6 (no undefined values at positions 1 and 2)
    assertEquals(points?.length, 4);
    
    // First point should be position 3 with actual data
    assertEquals(points?.[0].position, 3);
    assertEquals(points?.[0].price, 55.00);

    // Position 4 should be forward filled from position 3
    assertEquals(points?.[1].position, 4);
    assertEquals(points?.[1].price, 55.00);

    // Position 5 should have actual data
    assertEquals(points?.[2].position, 5);
    assertEquals(points?.[2].price, 60.00);

    // Position 6 should be forward filled from position 5
    assertEquals(points?.[3].position, 6);
    assertEquals(points?.[3].price, 60.00);

    // Verify no points with undefined prices exist
    for (const point of points || []) {
      if (point.price !== undefined) {
        assertEquals(typeof point.price, "number");
      }
    }
  });

  // Test A03 with empty points array
  await t.step("A03 with no points should return empty array", async () => {
    const xmlNoPoints = `<?xml version="1.0" encoding="UTF-8"?>
<Publication_MarketDocument xmlns="urn:iec62325.351:tc57wg16:451-3:publicationdocument:7:0">
	<mRID>TestA03NoPoints</mRID>
	<revisionNumber>1</revisionNumber>
	<type>A44</type>
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
		</Period>
	</TimeSeries>
</Publication_MarketDocument>`;

    const result = ParseDocument(xmlNoPoints) as PublicationDocument;
    const points = result.timeseries[0].periods?.[0].points;

    // Should have empty array when no points provided
    assertEquals(points?.length, 0);
  });

  // Test A03 with only last position having data
  await t.step("A03 with only last position should not forward fill backwards", async () => {
    const xmlOnlyLast = `<?xml version="1.0" encoding="UTF-8"?>
<Publication_MarketDocument xmlns="urn:iec62325.351:tc57wg16:451-3:publicationdocument:7:0">
	<mRID>TestA03OnlyLast</mRID>
	<revisionNumber>1</revisionNumber>
	<type>A44</type>
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
				<position>6</position>
				<price.amount>100.00</price.amount>
			</Point>
		</Period>
	</TimeSeries>
</Publication_MarketDocument>`;

    const result = ParseDocument(xmlOnlyLast) as PublicationDocument;
    const points = result.timeseries[0].periods?.[0].points;

    // Should only have 1 point (position 6) since forward fill doesn't go backwards
    assertEquals(points?.length, 1);
    assertEquals(points?.[0].position, 6);
    assertEquals(points?.[0].price, 100.00);
  });
});
