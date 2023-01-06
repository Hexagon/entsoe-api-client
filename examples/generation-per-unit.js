import { Query } from "https://deno.land/x/entsoe_api_client@0.1.7/mod.ts";
import { PsrType } from "https://deno.land/x/entsoe_api_client@0.1.7/src/parameters/psrtype.js";

// Prepare dates
const
    dateToday = new Date(),
    dateTomorrow = new Date();

dateToday.setDate(dateToday.getDate()-1);
dateToday.setHours(0,0,0,0);
dateTomorrow.setDate(dateToday.getDate()+2);
dateTomorrow.setHours(0,0,0,0);

// Run ENTSO-e transparency playform query
const result = await Query(
    Deno.env.get("API_TOKEN"), // Your entsoe api-token
    {
        documentType: "A75",        // A75 - Actual generation per type
        processType: "A16",         // A16 - Realised
        inDomain: "BZN|DE-LU",         // In_Domain
        outDomain: "BZN|DE-LU",        // Out_Domain
        startDateTime: dateToday,   // Start date
        endDateTime: dateTomorrow,  // End date
    }
);


// Compose a nice result set
const output = {
    data: [{
        position: 0,
        date: new Date(dateToday),
        TOTAL: 0
    }]
};

for (const ts of result.TimeSeries) {
    // We expect hourly data, use PT60M and ignore other periods
    if (ts.Period.resolution==="PT60M") {
        for (const point of ts.Period.Point) {
            const psrTypeTranslation = PsrType[ts.MktPSRType.psrType];
            output.data[0].TOTAL += point.quantity;
            output.data[0][psrTypeTranslation] = (output.data[0][psrTypeTranslation] ?? 0) + point.quantity;
            if (output.data[point.position]) {
                output.data[point.position].TOTAL += point.quantity;
                output.data[point.position][psrTypeTranslation] = point.quantity;
            } else {
                output.data[point.position] = {
                    position: point.position,
                    date: new Date(dateToday.getTime() + 3600 * 1000 * (point.position-1)),
                    [psrTypeTranslation]: point.quantity,
                    TOTAL: point.quantity
                }
            }
        }
    }
}

console.table(output.data);

/*
Example output
┌───────┬──────────┬──────────────────────────┬────────┬────────────┬───────────────────────┬─────────┬───────┬───────┬──────────────┐
│ (idx) │ position │ date                     │ TOTAL  │ Fossil Gas │ Hydro Water Reservoir │ Nuclear │ Other │ Solar │ Wind Onshore │
├───────┼──────────┼──────────────────────────┼────────┼────────────┼───────────────────────┼─────────┼───────┼───────┼──────────────┤
│     0 │        0 │ 2023-01-03T23:00:00.000Z │ 465831 │          0 │                202477 │  133290 │ 31919 │    21 │        98124 │
│     1 │        1 │ 2023-01-03T23:00:00.000Z │  18072 │          0 │                  8808 │    5795 │  1372 │     0 │         2097 │
│     2 │        2 │ 2023-01-04T00:00:00.000Z │  17249 │          0 │                  8112 │    5795 │  1374 │     0 │         1968 │
│     3 │        3 │ 2023-01-04T01:00:00.000Z │  16264 │          0 │                  7197 │    5795 │  1356 │     0 │         1916 │
│     4 │        4 │ 2023-01-04T02:00:00.000Z │  16261 │          0 │                  7036 │    5795 │  1358 │     0 │         2072 │
│     5 │        5 │ 2023-01-04T03:00:00.000Z │  16803 │          0 │                  7375 │    5796 │  1374 │     0 │         2258 │
│     6 │        6 │ 2023-01-04T04:00:00.000Z │  18080 │          0 │                  8173 │    5795 │  1372 │     0 │         2740 │
│     7 │        7 │ 2023-01-04T05:00:00.000Z │  19898 │          0 │                  9377 │    5796 │  1394 │     0 │         3331 │
│     8 │        8 │ 2023-01-04T06:00:00.000Z │  21065 │          0 │                 10104 │    5797 │  1411 │     0 │         3753 │
│     9 │        9 │ 2023-01-04T07:00:00.000Z │  21711 │          0 │                 10359 │    5796 │  1413 │     0 │         4143 │
│    10 │       10 │ 2023-01-04T08:00:00.000Z │  22029 │          0 │                 10398 │    5797 │  1419 │     1 │         4414 │
│    11 │       11 │ 2023-01-04T09:00:00.000Z │  21957 │          0 │                  9985 │    5795 │  1410 │     3 │         4764 │
│    13 │       13 │ 2023-01-04T11:00:00.000Z │  22095 │          0 │                  9934 │    5793 │  1409 │     6 │         4953 │
│    14 │       14 │ 2023-01-04T12:00:00.000Z │  21807 │          0 │                  9604 │    5795 │  1416 │     4 │         4988 │
│    15 │       15 │ 2023-01-04T13:00:00.000Z │  21905 │          0 │                  9572 │    5796 │  1419 │     2 │         5116 │
│    16 │       16 │ 2023-01-04T14:00:00.000Z │  22214 │          0 │                  9713 │    5795 │  1398 │     0 │         5308 │
│    17 │       17 │ 2023-01-04T15:00:00.000Z │  22644 │          0 │                  9999 │    5796 │  1396 │     0 │         5453 │
│    18 │       18 │ 2023-01-04T16:00:00.000Z │  22851 │          0 │                 10030 │    5793 │  1400 │     0 │         5628 │
│    19 │       19 │ 2023-01-04T17:00:00.000Z │  21977 │          0 │                  9075 │    5795 │  1396 │     0 │         5711 │
│    20 │       20 │ 2023-01-04T18:00:00.000Z │  21226 │          0 │                  8318 │    5796 │  1373 │     0 │         5739 │
│    21 │       21 │ 2023-01-04T19:00:00.000Z │  19931 │          0 │                  7101 │    5795 │  1371 │     0 │         5664 │
│    22 │       22 │ 2023-01-04T20:00:00.000Z │  19320 │          0 │                  6577 │    5796 │  1338 │     0 │         5609 │
│    23 │       23 │ 2023-01-04T21:00:00.000Z │  18358 │          0 │                  5682 │    5795 │  1331 │     0 │         5550 │
└───────┴──────────┴──────────────────────────┴────────┴────────────┴───────────────────────┴─────────┴───────┴───────┴──────────────┘
*/
