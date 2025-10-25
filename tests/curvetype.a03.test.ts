import { assertEquals } from "https://deno.land/std@0.128.0/testing/asserts.ts";
import { ParseDocument, PublicationDocument } from "../src/documents.ts";

Deno.test("Test parsing of PublicationDocument with A03 curveType and forward fill", async function (t) {
  const xml = await Deno.readTextFile("./tests/data/publication.a03curvetype.xml");
  const result = ParseDocument(xml) as PublicationDocument;
  assertEquals(result.rootType, "publication");

  await t.step("Document type, with description", async () => {
    assertEquals(result.documentType, "A44");
    assertEquals(result.documentTypeDescription, "Price Document");
  });

  await t.step("Document ts curveType A03", async () => {
    assertEquals(result.timeseries[0].curveType, "A03");
  });

  await t.step("Document ts curveTypeDescription for A03", async () => {
    assertEquals(result.timeseries[0].curveTypeDescription, "Variable sized block");
  });

  await t.step("Forward fill functionality for A03", async () => {
    const points = result.timeseries[0].periods?.[0].points;
    assertEquals(points?.length, 6); // Should have 6 points (6 hours)

    // Position 1: Original data
    assertEquals(points?.[0].position, 1);
    assertEquals(points?.[0].price, 50.00);

    // Position 2: Forward filled from position 1
    assertEquals(points?.[1].position, 2);
    assertEquals(points?.[1].price, 50.00);

    // Position 3: Original data
    assertEquals(points?.[2].position, 3);
    assertEquals(points?.[2].price, 55.00);

    // Position 4: Forward filled from position 3
    assertEquals(points?.[3].position, 4);
    assertEquals(points?.[3].price, 55.00);

    // Position 5: Forward filled from position 3
    assertEquals(points?.[4].position, 5);
    assertEquals(points?.[4].price, 55.00);

    // Position 6: Original data
    assertEquals(points?.[5].position, 6);
    assertEquals(points?.[5].price, 60.00);
  });

  await t.step("Document ts businessType", async () => {
    assertEquals(result.timeseries[0].businessType, "A43");
    assertEquals(result.timeseries[0].businessTypeDescription, "Requested capacity (without price)");
  });
});
