// Builds ../mock-interview.html from the markdown in 02-Mock-Interview and 03-Answer-Bank.
// Run:  node build.js      (re-run after editing any of the markdown files)
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..", "..");
const cards = [];

// 1) Full mock: "## ROUND n – Title", questions "### Qn. text" or "#### Qn. text"
{
  const md = fs.readFileSync(path.join(root, "02-Mock-Interview", "Full-Mock-Interview.md"), "utf8");
  let round = "";
  let cur = null;
  const flush = () => { if (cur) { cur.a = cur.a.trim().replace(/\n---\s*$/, "").trim(); cards.push(cur); cur = null; } };
  for (const line of md.split(/\r?\n/)) {
    const r = line.match(/^## (ROUND \d+[^\n]*)/);
    const q = line.match(/^#{3,4} (Q\d+)\.\s*(.*)$/);
    if (r) { flush(); round = r[1].replace(/\s*\(.*\)$/, ""); continue; }
    if (q) { flush(); cur = { id: q[1], group: round, src: "Mock", q: q[2], a: "" }; continue; }
    if (/^#{2,4} /.test(line) || /^## Scoring/.test(line)) { flush(); continue; }
    if (cur) cur.a += line + "\n";
  }
  flush();
}

// 2) Answer banks: "**Q: question**" then answer until next **Q: or a heading
for (const file of fs.readdirSync(path.join(root, "03-Answer-Bank")).filter(f => f.endsWith(".md")).sort()) {
  const md = fs.readFileSync(path.join(root, "03-Answer-Bank", file), "utf8");
  const title = (md.match(/^# Answer Bank \d+ – (.*)$/m) || [, file])[1];
  let cur = null, n = 0;
  const flush = () => { if (cur && cur.a.trim()) { cur.a = cur.a.trim(); cards.push(cur); } cur = null; };
  for (const line of md.split(/\r?\n/)) {
    const q = line.match(/^\*\*Q: (.*?)\*\*\s*(.*)$/);
    if (q) { flush(); n++; cur = { id: `${file.slice(0, 2)}-${n}`, group: title, src: "Bank", q: q[1], a: q[2] ? q[2] + "\n" : "" }; continue; }
    if (/^#{1,3} /.test(line)) { flush(); continue; }
    if (cur) cur.a += line + "\n";
  }
  flush();
}

const template = fs.readFileSync(path.join(__dirname, "template.html"), "utf8");
const json = JSON.stringify(cards).replace(/</g, "\\u003c");
const out = template.replace("/*__CARDS__*/[]", json).replace("__BUILT__", new Date().toISOString().slice(0, 10));
fs.writeFileSync(path.join(__dirname, "..", "mock-interview.html"), out);
const groups = [...new Set(cards.map(c => c.group))];
console.log(`Wrote mock-interview.html with ${cards.length} questions in ${groups.length} groups:`);
for (const g of groups) console.log(`  ${cards.filter(c => c.group === g).length.toString().padStart(3)}  ${g}`);
