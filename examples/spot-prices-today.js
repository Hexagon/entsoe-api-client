import { Query } from "https://deno.land/x/entsoe_api_client@0.0.1/mod.js";

// Prepare dates
const
    dateToday = new Date(),
    dateTomorrow = new Date();
dateToday.setHours(0,0,0,0);
dateTomorrow.setDate(dateTomorrow.getDate()+1);
dateTomorrow.setHours(0,0,0,0);

// Run query
const result = await Query(
    "your-api-key-here", // Your entsoe api-token
    "A44",                  // A44 - Day-ahead prices
    "SE2",                  // In_Domain: For A44 - Electricity price area
    "SE2",                  // Out_Domain: For A44 - Electricity price area
    dateToday, // Start date
    dateTomorrow  // End date
);

const ts = result.TimeSeries;

// Print meta data
console.table({
    start: ts.Period.timeInterval.start,
    end: ts.Period.timeInterval.end,
    currency: ts["currency_Unit.name"],
    unit: ts["price_Measure_Unit.name"]
});

// Print spot prices per hour
console.table(ts.Period.Point);
