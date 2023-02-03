/**
 * entsoe-api-client
 * 
 * @file Example on getting forecaster generation within a country
 *       from ENTSO-e Rest API.
 * 
 * @author Hexagon <hexagon@GitHub>
 * @license MIT
 **/

import { QueryGL } from "https://deno.land/x/entsoe_api_client@0.5.1/mod.ts";

// Prepare dates
const
    dateToday = new Date(),
    dateTomorrow = new Date();
dateToday.setHours(0,0,0,0);
dateTomorrow.setDate(dateTomorrow.getDate()+1);
dateTomorrow.setHours(0,0,0,0);

// Run ENTSO-e transparency playform query
const result = await QueryGL(
    Deno.env.get("API_TOKEN") || "", // Your entsoe api-token
    {
        documentType: "A71",        // A71 - Generation forecast
        processType: "A01",         // A01 - Day ahead
        inDomain: "Sweden (SE)",    
        outDomain: "Sweden (SE)",   
        startDateTime: dateToday,   // Start date
        endDateTime: dateTomorrow   // End date
    }
);

// Get first TimeSeries
const ts = result[0].timeseries[0];

// Print meta data
console.table({
    start: ts.periods[0].startDate.toISOString(),
    end: ts.periods[0].endDate.toISOString(),
    unit: ts.quantityMeasureUnit,
});

// Print spot prices per hour
console.table(ts.periods[0].points);
