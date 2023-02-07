import { assertEquals, assertThrows } from "https://deno.land/std@0.128.0/testing/asserts.ts";
import { ISO8601DurToSec } from "../src/duration.ts";

Deno.test("Test shortcuts", async function (t) {
  assertEquals(ISO8601DurToSec("P1D"), 86400);
  assertEquals(ISO8601DurToSec("PT60M"), 3600);
  assertEquals(ISO8601DurToSec("PT30M"), 1800);
  assertEquals(ISO8601DurToSec("PT15M"), 900);
  assertEquals(ISO8601DurToSec("PT1M"), 60);
});

Deno.test("Test non shortcuts", async function () {
  assertEquals(ISO8601DurToSec("PT14M"), 840);
  assertEquals(ISO8601DurToSec("PT1H"), 3600);
});

Deno.test("Test combinations", async function () {
  assertEquals(ISO8601DurToSec("PT1H14M"), 4440);
  assertEquals(ISO8601DurToSec("PT1.5M1S"), 91);
});

Deno.test("Test negative combinations", async function () {
  assertEquals(ISO8601DurToSec("-PT1H14M"), -4440);
  assertEquals(ISO8601DurToSec("-PT1.5M1S"), -91);
});

Deno.test("Throws if using greater year etc.", async function () {
  assertThrows(
    () => {
      ISO8601DurToSec("P1Y");
    },
    undefined,
    "P1Y",
  );
});

Deno.test("Throws if using greater month etc.", async function () {
  assertThrows(
    () => {
      ISO8601DurToSec("P1M");
    },
    undefined,
    "P1M",
  );
});

Deno.test("Throws if using greater week etc.", async function () {
  assertThrows(
    () => {
      ISO8601DurToSec("P1W");
    },
    undefined,
    "P1W",
  );
});

Deno.test("Throws if using greater dat etc.", async function () {
  assertThrows(
    () => {
      ISO8601DurToSec("P2D");
    },
    undefined,
    "P2D",
  );
});
