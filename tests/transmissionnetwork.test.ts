import { assertEquals } from "https://deno.land/std@0.128.0/testing/asserts.ts";
import { ParseDocument, TransmissionNetworkDocument } from "../src/parsedocument.ts";

Deno.test("Test parsing of TransmissionNetwork", async function (t) {
  const xml = await Deno.readTextFile("./tests/data/transmissionnetwork.xml");
  await t.step("Parse", async (t) => {
    const result: TransmissionNetworkDocument = ParseDocument(xml);
    assertEquals(result.rootType, "transmissionnetwork");
    await t.step("mRID", async (t) => {
      await assertEquals(result.mRID, "18df89badd5e4bf8996332299541be3c");
    });
    await t.step("Document creation time is Date object and correct", async (t) => {
      assertEquals(result.created?.getTime(), 1462869396000);
    });
    await t.step("Document type (and description)", async (t) => {
      assertEquals(result.documentType, "A90");
      assertEquals(result.documentTypeDescription, "Interconnection network expansion");
    });
    await t.step("Document Revision", async (t) => {
      assertEquals(result.revision, 1);
    });
    await t.step("Document timeInterval", async (t) => {
      assertEquals(result.timeInterval?.start.toISOString(), "2016-01-04T23:00:00.000Z");
      assertEquals(result.timeInterval?.end.toISOString(), "2016-01-05T00:00:00.000Z");
    });
    await t.step("Document ts inDomain", async (t) => {
      assertEquals(result.timeseries[0].inDomain, "10YCZ-CEPS-----N");
    });
    await t.step("Document ts outDomain", async (t) => {
      assertEquals(result.timeseries[0].outDomain, "10YDE-VE-------2");
    });
    await t.step("Document ts businessType", async (t) => {
      assertEquals(result.timeseries[0].businessType, "B01");
      assertEquals(result.timeseries[0].businessTypeDescription, "Interconnector network evolution");
    });
    await t.step("Document ts curveType", async (t) => {
      assertEquals(result.timeseries[0].curveType, "A01");
    });
    await t.step("Document ts quantityMeasureUnit", async (t) => {
      assertEquals(result.timeseries[0].quantityMeasureUnit, "MAW");
    });
    await t.step("Document ts endDate", async (t) => {
      assertEquals(result.timeseries[0].endDate?.toISOString(), "2016-12-31T00:00:00.000Z");
    });
    await t.step("Document ts assetRegisteredResourceId", async (t) => {
      assertEquals(result.timeseries[0].assetRegisteredResourceId, "27T-PST-HRA-DE-X");
    });
    await t.step("Document ts assetRegisteredResourcePsrType", async (t) => {
      assertEquals(result.timeseries[0].assetRegisteredResourcePsrType, "B24");
      assertEquals(result.timeseries[0].assetRegisteredResourcePsrTypeDescription, "Transformer");
    });
    await t.step("Document ts assetRegisteredResourcePsrType", async (t) => {
      assertEquals(result.timeseries[0].assetRegisteredResourceLocationName, "CZ");
    });
  });
});
