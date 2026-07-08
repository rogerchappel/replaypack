#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const requiredFiles = [
  "dist/cli.js",
  "dist/index.js",
  "examples/basic.replaypack.jsonl",
  "schemas/replaypack-v1.schema.json",
  "README.md",
  "LICENSE",
  "SECURITY.md",
  "CHANGELOG.md",
  "CONTRIBUTING.md",
];

const output = execFileSync("npm", ["pack", "--dry-run", "--json"], {
  encoding: "utf8",
  stdio: ["ignore", "pipe", "inherit"],
});

const [pack] = JSON.parse(output);
const packedFiles = new Set(pack.files.map((file) => file.path));
const missing = requiredFiles.filter((file) => !packedFiles.has(file));

if (missing.length > 0) {
  console.error(`Package smoke failed; missing ${missing.join(", ")}`);
  process.exit(1);
}

const tmp = mkdtempSync(join(tmpdir(), "replaypack-package-smoke-"));

try {
  const packOutput = execFileSync("npm", ["pack", "--json", "--pack-destination", tmp], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  });
  const [tarball] = JSON.parse(packOutput);
  const tarballPath = join(tmp, tarball.filename);
  const appDir = join(tmp, "app");
  mkdirSync(appDir);

  execFileSync("npm", ["init", "-y"], {
    cwd: appDir,
    stdio: ["ignore", "ignore", "inherit"],
  });
  execFileSync("npm", ["install", tarballPath], {
    cwd: appDir,
    stdio: ["ignore", "ignore", "inherit"],
  });

  const fixture = join(appDir, "input.txt");
  writeFileSync(fixture, "hello replaypack\n", "utf8");

  const bin = process.platform === "win32"
    ? join(appDir, "node_modules", ".bin", "replaypack.cmd")
    : join(appDir, "node_modules", ".bin", "replaypack");
  const packPath = join(appDir, "installed.replaypack.jsonl");
  const markdownPath = join(appDir, "installed.md");

  execFileSync(bin, ["--help"], { cwd: appDir, stdio: ["ignore", "ignore", "inherit"] });
  execFileSync(bin, [
    "record",
    "--name",
    "installed",
    "--output",
    packPath,
    "--fixture",
    fixture,
    "--",
    process.execPath,
    "-e",
    "console.log('hello replaypack')",
  ], { cwd: appDir, stdio: ["ignore", "ignore", "inherit"] });
  execFileSync(bin, ["verify", packPath], { cwd: appDir, stdio: ["ignore", "ignore", "inherit"] });
  const rendered = execFileSync(bin, ["render", packPath, "--format", "markdown"], {
    cwd: appDir,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  });
  writeFileSync(markdownPath, rendered, "utf8");

  if (!rendered.includes("ReplayPack: installed") || !rendered.includes("hello replaypack")) {
    console.error("Package smoke failed; installed CLI render output missed expected evidence.");
    process.exit(1);
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

console.log(`Package smoke passed with ${pack.files.length} files and an installed CLI check.`);
