import { assertEquals, assertThrows } from "https://deno.land/std@0.128.0/testing/asserts.ts";
import { formatEntsoeDate, toEntsoeFormat } from "../src/helpers/date.ts";

Deno.test("toEntsoeFormat - formats Date objects correctly", function () {
  // Basic date formatting
  assertEquals(toEntsoeFormat(new Date("2024-01-15T10:30:00.000Z")), "2024-01-15T10:30Z");

  // Dates with non-zero seconds should have seconds stripped
  assertEquals(toEntsoeFormat(new Date("2024-01-15T10:30:45.123Z")), "2024-01-15T10:30Z");

  // Edge case: midnight
  assertEquals(toEntsoeFormat(new Date("2024-01-01T00:00:00.000Z")), "2024-01-01T00:00Z");

  // Edge case: end of day
  assertEquals(toEntsoeFormat(new Date("2024-12-31T23:59:59.999Z")), "2024-12-31T23:59Z");

  // Single digit month and day should be zero-padded
  assertEquals(toEntsoeFormat(new Date("2024-01-05T05:05:00.000Z")), "2024-01-05T05:05Z");
});

Deno.test("formatEntsoeDate - handles Date objects", function () {
  // Date objects should be formatted correctly
  assertEquals(formatEntsoeDate(new Date("2024-01-15T10:30:00.000Z"), "testParam"), "2024-01-15T10:30Z");

  // Dates with non-zero seconds should have seconds stripped
  assertEquals(formatEntsoeDate(new Date("2024-01-15T10:30:45.123Z"), "testParam"), "2024-01-15T10:30Z");
});

Deno.test("formatEntsoeDate - handles ISO 8601 strings in correct format", function () {
  // Strings already in correct format should be returned as-is
  assertEquals(formatEntsoeDate("2024-01-15T10:30Z", "testParam"), "2024-01-15T10:30Z");
  assertEquals(formatEntsoeDate("2024-12-31T23:59Z", "testParam"), "2024-12-31T23:59Z");
});

Deno.test("formatEntsoeDate - converts parseable date strings", function () {
  // ISO 8601 with seconds should be converted
  assertEquals(formatEntsoeDate("2024-01-15T10:30:45.123Z", "testParam"), "2024-01-15T10:30Z");

  // Standard ISO format with seconds
  assertEquals(formatEntsoeDate("2024-01-15T10:30:00Z", "testParam"), "2024-01-15T10:30Z");
});

Deno.test("formatEntsoeDate - throws on invalid strings", function () {
  assertThrows(
    () => formatEntsoeDate("not a date", "testParam"),
    Error,
    "testParam string must be ISO 8601 UTC",
  );
});

Deno.test("formatEntsoeDate - throws on invalid Date objects", function () {
  assertThrows(
    () => formatEntsoeDate(new Date("invalid"), "testParam"),
    Error,
    "testParam not valid",
  );
});

Deno.test("formatEntsoeDate - uses parameter name in error messages", function () {
  assertThrows(
    () => formatEntsoeDate("not a date", "startDateTime"),
    Error,
    "startDateTime",
  );

  assertThrows(
    () => formatEntsoeDate("not a date", "startDateTimeUpdate"),
    Error,
    "startDateTimeUpdate",
  );
});
