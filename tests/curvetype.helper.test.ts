import { assertEquals } from "https://deno.land/std@0.128.0/testing/asserts.ts";
import { CurveType } from "../mod.ts";

Deno.test("Test CurveType helper function", async function (t) {
  await t.step("Find A03 by name", async () => {
    assertEquals(CurveType("Variable sized block"), "A03");
  });

  await t.step("Find A01 by name", async () => {
    assertEquals(CurveType("Sequential fixed size block"), "A01");
  });

  await t.step("Find A02 by name", async () => {
    assertEquals(CurveType("Point"), "A02");
  });

  await t.step("Return undefined for unknown curve type", async () => {
    assertEquals(CurveType("Unknown curve type"), undefined);
  });
});
