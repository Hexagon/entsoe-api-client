import { QueryPublication } from "https://deno.land/x/entsoe_api_client@0.4.0/mod.ts";

// Prepare dates
const
    dateToday = new Date(),
    dateTomorrow = new Date();
dateToday.setHours(0,0,0,0);
dateTomorrow.setDate(dateTomorrow.getDate()+1);
dateTomorrow.setHours(0,0,0,0);

// Run ENTSO-e transparency playform query
const result = await QueryPublication(
     Deno.env.get("API_TOKEN"), // Your entsoe api-token
     {
        documentType: "A44",              // A44 - Price document
        processType: "A01",               // A01 - Day ahead
        inDomain: "SE2",            // In_Domain: For A44 - Electricity price area
        outDomain: "SE2",           // Out_Domain: For A44 - Electricity price area
        startDateTime: dateToday,         // Start date
        endDateTime: dateTomorrow         // End date
    }
); 

// Get first TimeSeries
const ts = result[0].timeseries[0];

// Print meta data
console.table({
    start: ts.period.startDate.toISOString(),
    end: ts.period.endDate.toISOString(),
    resoluton: ts.period.resolution,
    currency: ts.currency,
    unit: ts.unit,
});

// Print spot prices per hour
console.table(ts.period.points);
