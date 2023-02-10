import { assertEquals } from "https://deno.land/std@0.128.0/testing/asserts.ts";
import { CriticalNetworkElementDocument, ParseDocument } from "../src/documents.ts";

Deno.test("Test parsing of CriticalNetworkElement", async function (t) {
  const xml = await Deno.readTextFile("./tests/data/criticalnetworkelement.xml");
  await t.step("Parse", async (t) => {
    const result: CriticalNetworkElementDocument = ParseDocument(xml);
    assertEquals(result.rootType, "criticalnetworkelement");
    await t.step("mRID", async (t) => {
      await assertEquals(result.mRID, "f50b1e74b9cb41aba3d88f8a219e208d");
    });
    await t.step("Document creation time is Date object and correct", async (t) => {
      assertEquals(result.created?.getTime(), 1456472062000);
    });
    await t.step("Document type (and description)", async (t) => {
      assertEquals(result.documentType, "B11");
      assertEquals(result.documentTypeDescription, "Flow-based allocations");
    });
    await t.step("Document Revision", async (t) => {
      assertEquals(result.revision, 1);
    });
    await t.step("Document timeInterval", async (t) => {
      assertEquals(result.timeInterval?.start.toISOString(), "2015-12-31T23:00:00.000Z");
      assertEquals(result.timeInterval?.end.toISOString(), "2016-12-31T23:00:00.000Z");
    });
    await t.step("Document ts businessType", async (t) => {
      assertEquals(result.timeseries[0].businessType, "B39");
      assertEquals(result.timeseries[0].businessTypeDescription, undefined); // B39 does not exist in parameter file, yet
    });
    await t.step("Document ts curveType", async (t) => {
      assertEquals(result.timeseries[0].curveType, "A01");
    });
    await t.step("Document ts constraintTimeSeries.businessType", async (t) => {
      assertEquals(((result.timeseries[0].periods?.[0].points?.[0].constraintTimeSeries) as any).businessType, "B09");
    });
    await t.step("Document ts constraintTimeSeries...mRID", async (t) => {
      assertEquals(
        ((result.timeseries[0].periods?.[0].points?.[0].constraintTimeSeries) as any).Monitored_RegisteredResource.PTDF_Domain.mRID,
        "10YBE----------2",
      );
    });
  });
});
