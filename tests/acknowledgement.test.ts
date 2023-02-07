import { assertThrows } from "https://deno.land/std@0.128.0/testing/asserts.ts";
import { ParseDocument } from "../src/parsedocument.ts";

Deno.test("Test parsing of acknowledgement (should throw with correct reason and code)", async function () {
  const xml = await Deno.readTextFile("./tests/data/acknowledgement.invalidrequest.xml");
  assertThrows(
    () => {
      const result = ParseDocument(xml);
    },
    undefined,
    "No matching data found",
  );
});
