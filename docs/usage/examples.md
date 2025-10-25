---
layout: page
title: "Examples"
parent: Usage
nav_order: 2  
---

# Examples

---

Examples for entsoe-api-client can be found in the [main/examples](https://github.com/Hexagon/entsoe-api-client/tree/main/examples) directory of the GitHub repository.

**Notable Examples:**
- `spot-prices-today.js` - Basic price document querying
- `generation-per-unit.js` - Generation data aggregation 
- `curve-type-a03.js` - Demonstrates A03 curve type support
- `forward-fill-a03.js` - Shows automatic forward fill functionality for variable sized blocks

To run the examples, pass your ENTSO-e API key as an environment variable called `API_TOKEN`.

**Deno**

Powershell
```
$env:API_TOKEN="your-api-token"; deno run -A .\spot-prices-today.ts
```
Bash
```
API_TOKEN="your-api-token" deno run -A .\spot-prices-today.ts
```

**Node**

Powershell
```
$env:API_TOKEN="your-api-token"; node .\spot-prices-today.ts
```
Bash
```
API_TOKEN="your-api-token" node .\spot-prices-today.ts
```
