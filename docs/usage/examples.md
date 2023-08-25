---
layout: page
title: "Examples"
nav_order: 2
---

# Examples

---

Examples for entsoe-api-client can be found in the [main/examples](https://github.com/Hexagon/entsoe-api-client/tree/main/examples) directory of the GitHub repository.

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
