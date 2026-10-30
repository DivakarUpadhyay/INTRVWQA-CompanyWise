const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, LevelFormat,
  Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle,
} = require('docx');

const ACCENT = '1F4E79';
const out = process.argv[2];

// "**bold** rest" -> runs
function runs(text) {
  return text.split(/(\*\*[^*]+\*\*)/).filter(Boolean).map(p =>
    p.startsWith('**') ? new TextRun({ text: p.slice(2, -2), bold: true }) : new TextRun(p));
}
const bullet = t => new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: runs(t), spacing: { after: 60 } });
const h1 = t => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(t)],
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ACCENT, space: 4 } } });
const h2 = t => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(t)] });
const info = (label, value) => new Paragraph({ spacing: { after: 40 },
  children: [new TextRun({ text: label + ': ', bold: true }), ...runs(value)] });

const W = [3000, 6026];
const cell = (t, i, head) => new TableCell({
  width: { size: W[i], type: WidthType.DXA },
  shading: head ? { type: ShadingType.CLEAR, fill: ACCENT, color: 'auto' } : undefined,
  margins: { top: 80, bottom: 80, left: 120, right: 120 },
  children: [new Paragraph({ children: head ? [new TextRun({ text: t, bold: true, color: 'FFFFFF' })] : runs(t) })],
});
const fitRows = [
  ['Factor', 'Note'],
  ['Biggest blocker', '**Fluent Mandarin required**'],
  ['Core skill', 'C#/.NET + MS SQL (non-negotiable)'],
  ['Salary', 'High for Taiwan market'],
  ['Work style', 'Remote, hands-on, independent'],
];
const fitTable = new Table({
  width: { size: 9026, type: WidthType.DXA }, columnWidths: W,
  rows: fitRows.map((r, ri) => new TableRow({ tableHeader: ri === 0, children: r.map((t, i) => cell(t, i, ri === 0)) })),
});

const children = [
  new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun('Sandline Global – Senior Backend Data Engineer')] }),
  info('Company', 'eDiscovery & litigation support provider'),
  info('Type', 'Full-time · 100% Individual Contributor (no management)'),
  info('Location', 'Fully remote (must live in Taiwan) · Office: Xinyi District, Taipei (near Taipei 101)'),
  info('Salary', 'TWD 140,000 – 180,000+/month (negotiable) + ~2 months bonus'),

  h1("What You'll Do"),
  ...[
    'Build & optimize **ETL pipelines**: high-volume ingestion, metadata extraction, text parsing',
    '**Debug data problems** at code level: corruptions, encoding errors, unsupported formats',
    'Write **custom tools & automation** in C#/.NET, MS SQL, PowerShell',
    'Build **API integrations** with eDiscovery platforms (Relativity, Nuix)',
    '**Tune SQL databases**: indexing, query optimization, terabyte-scale data',
    'Work with PMs & global teams to fix **performance bottlenecks**',
    'Run **QC validation scripts** to ensure 100% accuracy before data goes to review',
  ].map(bullet),

  h1('Job Requirements'),
  h2('Must-Have'),
  ...[
    '**5+ years** experience',
    "**Bachelor's degree or above** (CS, Info Mgmt, Applied Math, Software Eng)",
    '**C# / .NET** – strictly required',
    '**MS SQL Server** – querying, DB admin, performance tuning',
    '**PowerShell** scripting',
    '**ETL** experience',
    '**Fluent Mandarin + English** (written & spoken)',
    '**Legally in Taiwan** with valid work permit',
    'Can attend **monthly in-person team events in Taipei**',
    'Independent debugger – log analysis, unknown exceptions, no supervision',
  ].map(bullet),
  h2('Tools Listed'),
  bullet('ETL, MS SQL, ANSI SQL, C#, Visual Studio, Visual C#, ASP.NET'),
  h2('Nice-to-Have'),
  ...[
    '**Relativity / Nuix** experience or APIs (big plus)',
    'Certifications: Relativity Certified Admin (RCA), Relativity Custom Dev, Nuix Workstation',
    '**Python** for secondary pipeline automation',
    "Master's degree / data analytics focus",
    'CI/CD, modular system design, integration testing',
  ].map(bullet),
  h2('Conditions to Note'),
  ...[
    'Standard hours: Mon–Fri, 9 AM – 6 PM',
    '**Evening/weekend work** possible when cases are urgent',
    '**Travel** (Taiwan / APAC / global) may be required',
    'Not for people seeking managerial/consulting roles',
    'Start date: within a month',
  ].map(bullet),

  h1('Perks & Benefits'),
  h2('Pay'),
  ...['TWD 140K – 180K+/month', 'Performance bonus (historically **~2 months**)', 'Meal allowance & transportation allowance'].map(bullet),
  h2('Flexibility'),
  ...['**100% fully remote** (within Taiwan)', 'Remote work setup support', 'No make-up workdays'].map(bullet),
  h2('Leave'),
  ...[
    '**15 days PTO** after probation, **+1 day every year**',
    'No pay deduction for sick leave',
    'Two days off per week',
    'Statutory leave: maternity, paternity/prenatal checkup, special leave',
  ].map(bullet),
  h2('Team & Office'),
  ...['Monthly team lunch & team building', 'Department dinners', 'Snack cabinet & coffee bar', 'Labor & health insurance'].map(bullet),

  h1('Quick Fit Check'),
  fitTable,
];

const doc = new Document({
  creator: 'Divakar Upadhyay',
  title: 'Sandline Global – Senior Backend Data Engineer',
  styles: {
    default: { document: { run: { font: 'Calibri', size: 22 } } },
    paragraphStyles: [
      { id: 'Title', name: 'Title', basedOn: 'Normal', run: { size: 36, bold: true, color: ACCENT }, paragraph: { spacing: { after: 200 } } },
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 28, bold: true, color: ACCENT }, paragraph: { spacing: { before: 320, after: 120 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 24, bold: true, color: '2E75B6' }, paragraph: { spacing: { before: 180, after: 80 }, outlineLevel: 1 } },
    ],
  },
  numbering: { config: [{ reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
    style: { paragraph: { indent: { left: 540, hanging: 270 } } } }] }] },
  sections: [{ properties: { page: { margin: { top: 1200, bottom: 1200, left: 1440, right: 1440 } } }, children }],
});

Packer.toBuffer(doc).then(b => { fs.writeFileSync(out, b); console.log('written', out); });
