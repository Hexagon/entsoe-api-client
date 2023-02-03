/**
 * entsoe-api-client
 * 
 * @file Example on getting spot prices for today and tomorrow from ENTSO-e Rest API
 * 
 * @author Hexagon <hexagon@GitHub>
 * @license MIT
 **/

import { QueryPublication } from "https://deno.land/x/entsoe_api_client@0.5.1/mod.ts";

// Prepare dates
const
    dateToday = new Date(),
    dateTomorrow = new Date();
dateToday.setHours(0,0,0,0);
dateTomorrow.setDate(dateTomorrow.getDate()+1);
dateTomorrow.setHours(0,0,0,0);

// Run ENTSO-e transparency playform query
const result = await QueryPublication(
     Deno.env.get("API_TOKEN") || "", // Your entsoe api-token
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
    start: ts.periods[0].startDate.toISOString(),
    end: ts.periods[0].endDate.toISOString(),
    resoluton: ts.periods[0].resolution,
    currency: ts.currency,
    unit: ts.unit,
});

// Print spot prices per hour
console.table(ts.periods[0].points);
