import { assertEquals } from "https://deno.land/std@0.128.0/testing/asserts.ts";
import { ParseDocument } from "../src/documents.ts";

Deno.test(
  "Unavalability document (and combinations of single/multiple ts/periods)",
  async function (t) {
    const xml = await Deno.readTextFile("./tests/data/unavailability.consumption.xml");
    await t.step("Parse", async (t) => {
      const result = ParseDocument(xml);
      await t.step("rootType is correct", async () => {
        assertEquals(result.rootType, "unavailability");
      });
      await t.step("processType", async () => {
        assertEquals(result.processType, "A26");
        assertEquals(result.processTypeDescription, undefined); // Expected to be undefined as processType=A26 is not defined in parameters/processtype.js
      });
      await t.step("Multiple timeseries", async () => {
        assertEquals(result.timeseries.length, 2);
      });
      await t.step("timeInterval", async (t) => {
        assertEquals(result.timeInterval?.start.toISOString(), "2015-09-19T22:00:00.000Z");
        assertEquals(result.timeInterval?.end.toISOString(), "2015-09-20T22:00:00.000Z");
      });
      await t.step("businessType of TS", async () => {
        assertEquals(result.timeseries[0].businessType, "A53");
        assertEquals(result.timeseries[0].businessTypeDescription, "Planned maintenance");
      });
      await t.step("TS with single period", async () => {
        assertEquals(result.timeseries[0].periods?.length, 1);
      });
      await t.step("Period start and end date parsed correctly", async () => {
        assertEquals(
          result.timeseries[0].periods?.[0].points[0].startDate.toISOString(),
          "2015-09-19T22:00:00.000Z",
        );
        assertEquals(
          result.timeseries[0].periods?.[0].points[0].endDate.toISOString(),
          "2015-09-20T18:00:00.000Z",
        );
      });
      await t.step("Single point start and end date matches period", async () => {
        assertEquals(
          result.timeseries[0].periods?.[0].points[0].startDate,
          result.timeseries[0].periods?.[0].startDate,
        );
        assertEquals(
          result.timeseries[0].periods?.[0].points[0].endDate,
          result.timeseries[0].periods?.[0].endDate,
        );
      });
      await t.step("Skipped periods are handled correctly", async () => {
        assertEquals(
          result.timeseries[1].periods?.[0].points[0].startDate,
          result.timeseries[1].periods?.[0].startDate,
        );
        assertEquals(
          result.timeseries[1].periods?.[0].points[0].startDate.toISOString(),
          "2015-09-19T22:00:00.000Z",
        );
        assertEquals(
          result.timeseries[1].periods?.[0].points[0].endDate.toISOString(),
          "2015-09-20T01:00:00.000Z",
        );
        assertEquals(
          result.timeseries[1].periods?.[0].points[1].startDate.toISOString(),
          "2015-09-20T01:00:00.000Z",
        );
        assertEquals(
          result.timeseries[1].periods?.[0].points[1].endDate.toISOString(),
          "2015-09-20T05:00:00.000Z",
        );
        assertEquals(
          result.timeseries[1].periods?.[0].points[2].startDate.toISOString(),
          "2015-09-20T05:00:00.000Z",
        );
        assertEquals(
          result.timeseries[1].periods?.[0].points[2].endDate.toISOString(),
          "2015-09-20T07:00:00.000Z",
        );
        assertEquals(
          result.timeseries[1].periods?.[0].points[2].endDate,
          result.timeseries[1].periods?.[0].endDate,
        );
      });
      await t.step("TS with multiple periods", async () => {
        assertEquals(result.timeseries[1].periods?.length, 2);
      });
      await t.step("Period with single point", async () => {
        assertEquals(result.timeseries[0].periods?.[0].points.length, 1);
      });
      await t.step("Period with multiple points", async () => {
        assertEquals(result.timeseries[1].periods?.[0].points.length, 3);
        assertEquals(result.timeseries[1].periods?.[1].points.length, 8);
      });
    });
  },
);
