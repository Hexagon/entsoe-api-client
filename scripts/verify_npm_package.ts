#!/usr/bin/env -S deno run --allow-run --allow-read

/**
 * Verification script to ensure the npm package contains the required files
 * Run this after building the npm package to verify it will work correctly
 */

// Check if npm directory exists
try {
  await Deno.stat("npm");
} catch {
  console.error("❌ npm directory not found. Run 'deno task build <version>' first.");
  Deno.exit(1);
}

console.log("🔍 Verifying npm package structure...\n");

// Check critical directories exist
const criticalDirs = [
  "npm/esm/src",
  "npm/script/src",
  "npm/esm/src/documents",
  "npm/script/src/documents",
  "npm/esm/src/definitions",
  "npm/script/src/definitions",
];

let hasErrors = false;

for (const dir of criticalDirs) {
  try {
    const stat = await Deno.stat(dir);
    if (stat.isDirectory) {
      console.log(`✅ ${dir} exists`);
    } else {
      console.error(`❌ ${dir} exists but is not a directory`);
      hasErrors = true;
    }
  } catch {
    console.error(`❌ ${dir} not found`);
    hasErrors = true;
  }
}

// Check .npmignore file
console.log("\n🔍 Checking .npmignore file...\n");

try {
  const npmignore = await Deno.readTextFile("npm/.npmignore");
  const lines = npmignore.split("\n");

  if (lines[0] === "/src/") {
    console.log("✅ .npmignore correctly excludes only root /src/ directory");
  } else if (lines[0] === "src/") {
    console.error(
      '❌ .npmignore has "src/" which would exclude esm/src/ and script/src/',
    );
    hasErrors = true;
  } else {
    console.warn(`⚠️  .npmignore first line is unexpected: ${lines[0]}`);
  }
} catch (error) {
  console.error(`❌ Could not read .npmignore: ${error.message}`);
  hasErrors = true;
}

// Run npm pack --dry-run to check what would be published
console.log("\n🔍 Checking npm pack output...\n");

try {
  const process = new Deno.Command("npm", {
    args: ["pack", "--dry-run"],
    cwd: "npm",
    stdout: "piped",
    stderr: "piped",
  });

  const { stdout, stderr } = await process.output();
  const output = new TextDecoder().decode(stdout) +
    new TextDecoder().decode(stderr);

  const esmSrcCount = (output.match(/esm\/src\//g) || []).length;
  const scriptSrcCount = (output.match(/script\/src\//g) || []).length;

  if (esmSrcCount > 0) {
    console.log(`✅ esm/src/ files in package: ${esmSrcCount}`);
  } else {
    console.error("❌ No esm/src/ files found in package!");
    hasErrors = true;
  }

  if (scriptSrcCount > 0) {
    console.log(`✅ script/src/ files in package: ${scriptSrcCount}`);
  } else {
    console.error("❌ No script/src/ files found in package!");
    hasErrors = true;
  }

  // Check that root src is NOT included
  const rootSrcPattern = /\ssrc\//;
  const rootSrcMatches = output.split("\n").filter((line) =>
    line.match(rootSrcPattern) && !line.includes("esm/src/") &&
    !line.includes("script/src/")
  );

  if (rootSrcMatches.length === 0) {
    console.log("✅ Root src/ directory correctly excluded from package");
  } else {
    console.error(
      `❌ Root src/ files incorrectly included in package: ${rootSrcMatches.length}`,
    );
    hasErrors = true;
  }
} catch (error) {
  console.error(`❌ Could not run npm pack: ${error.message}`);
  hasErrors = true;
}

if (hasErrors) {
  console.error("\n❌ Package verification failed!");
  Deno.exit(1);
} else {
  console.log("\n✅ Package verification passed! Ready to publish.");
  Deno.exit(0);
}
