import { assertThrows } from "https://deno.land/std@0.128.0/testing/asserts.ts";
import { ParseDocument } from "../src/documents.ts";

Deno.test("Test parsing of invalid xml", async function () {
  const xml = await Deno.readTextFile("./tests/data/invalid.xml");
  assertThrows(
    () => {
      const result = ParseDocument(xml);
    },
    undefined,
    "Unknown XML document",
  );
});
