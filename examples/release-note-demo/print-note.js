import { readFileSync } from "node:fs";

const notePath = new URL("./release-note.md", import.meta.url);
const note = readFileSync(notePath, "utf8").trim();

console.log("Release note preview");
console.log("====================");
console.log(note);

