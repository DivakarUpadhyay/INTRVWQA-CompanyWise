const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, LevelFormat,
  Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle, PageBreak,
} = require('docx');

const ACCENT = '1F4E79';
const out = process.argv[2];

function runs(text) {
  return text.split(/(\*\*[^*]+\*\*)/).filter(Boolean).map(p =>
    p.startsWith('**') ? new TextRun({ text: p.slice(2, -2), bold: true }) : new TextRun(p));
}
const bullet = (t, level = 0) => new Paragraph({ numbering: { reference: 'bullets', level }, children: runs(t), spacing: { after: 40 } });
const check = t => new Paragraph({ numbering: { reference: 'checks', level: 0 }, children: runs(t), spacing: { after: 40 } });
const h1 = t => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(t)],
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ACCENT, space: 4 } } });
const h2 = t => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(t)] });
const h3 = t => new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun(t)] });
const para = t => new Paragraph({ spacing: { after: 120 }, children: runs(t) });

function table(widths, rows) {
  const total = widths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: total, type: WidthType.DXA }, columnWidths: widths,
    rows: rows.map((r, ri) => new TableRow({ tableHeader: ri === 0, children: r.map((t, i) => new TableCell({
      width: { size: widths[i], type: WidthType.DXA },
      shading: ri === 0 ? { type: ShadingType.CLEAR, fill: ACCENT, color: 'auto' }
        : ri % 2 === 0 ? { type: ShadingType.CLEAR, fill: 'EEF3F8', color: 'auto' } : undefined,
      margins: { top: 60, bottom: 60, left: 100, right: 100 },
      children: [new Paragraph({ children: ri === 0 ? [new TextRun({ text: t, bold: true, color: 'FFFFFF' })] : runs(t) })],
    })) })),
  });
}
const gap = () => new Paragraph({ spacing: { after: 80 }, children: [] });

// One topic = what / how / materials
function topic(title, what, how, materials) {
  return [
    h2(title),
    h3('What to prepare'), ...what.map(x => bullet(x)),
    h3('How to prepare'), ...how.map(x => bullet(x)),
    h3('Materials'), ...materials.map(x => bullet(x)),
  ];
}

const children = [
  new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun('Preparation Plan – Senior Backend Data Engineer')] }),
  new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'Sandline Global · eDiscovery · C#/.NET + MS SQL', color: '595959' })] }),
  para('**Goal:** be ready for the technical screen, live coding, SQL tuning questions and an eDiscovery discussion.'),

  h1('1. Priority Map'),
  table([2600, 1500, 4926], [
    ['Area', 'Priority', 'Why'],
    ['C# / .NET', '**Critical**', 'Strictly required; main coding language'],
    ['MS SQL Server', '**Critical**', 'Querying, DBA, performance tuning required'],
    ['ETL & data processing', '**Critical**', 'Core daily work'],
    ['Debugging & log analysis', '**High**', 'Role is "investigator", not checklist worker'],
    ['PowerShell', '**High**', 'Automation scripts'],
    ['Text, encoding & file formats', '**High**', 'Corruptions, encoding errors, parsing'],
    ['eDiscovery domain', '**High**', 'Relativity / Nuix = big plus'],
    ['Python', 'Medium', 'Secondary, nice-to-have'],
    ['CI/CD & system design', 'Medium', 'Listed in job skills'],
    ['Mandarin', '**Blocker**', 'Fluency required – see Section 6'],
  ]),

  h1('2. Six-Week Study Plan'),
  table([1300, 3900, 3826], [
    ['Week', 'Focus', 'Output'],
    ['1', 'C# refresh: LINQ, async, collections, file I/O', 'Small console tools on GitHub'],
    ['2', 'T-SQL deep dive: joins, window functions, CTEs', '50+ practice queries'],
    ['3', 'SQL tuning: indexes, execution plans, statistics', 'Tuning notes + before/after examples'],
    ['4', 'ETL in C#: bulk load, parsing, encoding', 'Mini ETL project (Section 4)'],
    ['5', 'PowerShell + eDiscovery domain', 'Automation script + EDRM notes'],
    ['6', 'Mock interviews, resume, stories', 'STAR stories + polished resume'],
  ]),
  gap(),
  para('**Daily routine (2–3 hrs):** 1 hr theory · 1 hr hands-on code · 30 min interview questions.'),

  h1('3. Topic-by-Topic Preparation'),

  ...topic('3.1 C# / .NET (Critical)',
    [
      'OOP: classes, interfaces, inheritance, SOLID',
      'Generics & collections (List, Dictionary, HashSet)',
      'LINQ: Where, Select, GroupBy, Join',
      'async / await, Task, parallel processing',
      'Streams: FileStream, StreamReader, large files',
      'Exceptions: try/catch/finally, custom exceptions',
      'Memory: GC, IDisposable, using',
      'ADO.NET: SqlConnection, SqlCommand, SqlBulkCopy',
      'Dapper / Entity Framework basics',
      'Console apps & Windows services',
      'REST API calls: HttpClient, JSON (System.Text.Json)',
      'ASP.NET Core Web API basics',
      'Unit testing: xUnit / NUnit',
    ],
    [
      'Rebuild small tools daily in Visual Studio',
      'Read 1 file of 10GB+ line by line – measure memory',
      'Write a CSV → SQL loader with SqlBulkCopy',
      'Call a public REST API, save JSON to SQL',
      'Solve 2 coding problems/day in C#',
      'Explain each concept aloud (interview practice)',
    ],
    [
      'Book: **C# 12 in a Nutshell** – Joseph Albahari',
      'Book: **C# in Depth** – Jon Skeet',
      'Book: **CLR via C#** – Jeffrey Richter (internals)',
      'Microsoft Learn: C# & .NET learning paths',
      'Tool: **LINQPad** (fast C# + SQL testing)',
      'Practice: LeetCode / Exercism C# track',
    ]),

  ...topic('3.2 MS SQL Server – Querying (Critical)',
    [
      'JOIN types, subqueries, CTEs',
      'Window functions: ROW_NUMBER, RANK, LAG, LEAD',
      'GROUP BY, HAVING, PIVOT / UNPIVOT',
      'MERGE, UPSERT patterns',
      'Stored procedures, functions, views',
      'Transactions, isolation levels, locking',
      'Temp tables vs table variables',
      'String functions: STRING_SPLIT, PATINDEX, COLLATE',
      'Duplicate detection queries',
      'ANSI SQL vs T-SQL differences',
    ],
    [
      'Install sample DBs: AdventureWorks, WideWorldImporters',
      'Write 50+ queries, from simple to complex',
      'Practice "find duplicates / gaps / top N per group"',
      'Use SSMS daily',
    ],
    [
      'Book: **T-SQL Fundamentals** – Itzik Ben-Gan',
      'Book: **T-SQL Window Functions** – Itzik Ben-Gan',
      'Practice: LeetCode SQL 50, HackerRank SQL',
      'Docs: Microsoft Learn T-SQL reference',
    ]),

  ...topic('3.3 MS SQL Server – Performance & DBA (Critical)',
    [
      'Clustered vs non-clustered indexes',
      'Covering indexes, INCLUDE columns, filtered indexes',
      'Reading execution plans (scan vs seek, key lookup)',
      'Statistics & cardinality estimation',
      'Parameter sniffing',
      'Index fragmentation & maintenance',
      'Partitioning large tables (TB-scale)',
      'Blocking, deadlocks, wait stats',
      'DMVs: sys.dm_exec_query_stats, sys.dm_db_index_usage_stats',
      'Query Store',
      'Backup / restore, recovery models',
      'TempDB & log file management',
      'Bulk load tuning: minimal logging, batch size',
    ],
    [
      'Load a big dataset (Stack Overflow DB) and tune slow queries',
      'Record before/after timings – use in interview',
      'Run sp_Blitz / sp_BlitzIndex and read results',
      'Create a deadlock on purpose, then fix it',
      'Practice explaining a plan in 2 minutes',
    ],
    [
      'Free: **Brent Ozar** – First Responder Kit, blog, "How to Think Like the SQL Server Engine"',
      'Free ebook: **SQL Server Execution Plans** – Grant Fritchey (Redgate)',
      'Book: **SQL Server Query Performance Tuning** – Grant Fritchey',
      'Site: **Use The Index, Luke** – Markus Winand',
      'Dataset: Stack Overflow database (Brent Ozar download)',
      'Cert path (optional): Microsoft DP-300',
    ]),

  ...topic('3.4 ETL & Data Pipelines (Critical)',
    [
      'Extract → Transform → Load design',
      'Staging tables, incremental loads',
      'Bulk ingestion (SqlBulkCopy, BULK INSERT, bcp)',
      'Error handling: bad rows, retry, quarantine table',
      'Logging every step to a DB log table',
      'Metadata extraction (file name, dates, hashes, author)',
      'Idempotent, restartable jobs',
      'SSIS basics',
      'Parallel processing & batching',
    ],
    [
      'Build the mini ETL project (Section 4)',
      'Draw your pipeline design on paper – practice explaining',
      'Break your own pipeline (bad data) and fix it',
    ],
    [
      'Book: **Fundamentals of Data Engineering** – Reis & Housley',
      'Book: **Designing Data-Intensive Applications** – Martin Kleppmann',
      'Docs: Microsoft Learn – SSIS, SqlBulkCopy, bcp',
    ]),

  ...topic('3.5 Text, Encoding & File Formats (High)',
    [
      'ASCII, UTF-8, UTF-16, BOM, code pages (Big5 for Taiwan)',
      'Mojibake – how garbled text happens and how to fix',
      'Regex for parsing & cleaning text',
      'Email formats: PST, MSG, EML, MIME',
      'Office / PDF text extraction',
      'Hashing: MD5, SHA-1, SHA-256 (dedup)',
      'Delimited files: CSV quirks, embedded newlines',
    ],
    [
      'Convert files between encodings in C# & PowerShell',
      'Create broken-encoding files, write a detector/fixer',
      'Parse EML files with MimeKit',
      'Hash a folder of files and find duplicates',
    ],
    [
      'Article: **The Absolute Minimum Every Software Developer Must Know About Unicode** – Joel Spolsky',
      'Docs: .NET System.Text.Encoding',
      'Library: **MimeKit** (C# email parsing)',
      'Tool: **regex101.com**',
      'Tool: Notepad++ (view encodings / hidden chars)',
    ]),

  ...topic('3.6 PowerShell (High)',
    [
      'Cmdlets, pipeline, objects',
      'Variables, loops, functions, modules',
      'File ops: Get-ChildItem, Import-Csv, Export-Csv',
      'Error handling: try/catch, -ErrorAction',
      'Invoke-Sqlcmd / SqlServer module',
      'Invoke-RestMethod for APIs',
      'Scheduled tasks & remoting',
    ],
    [
      'Automate a daily task on your own PC',
      'Script: scan folder → hash files → write to SQL',
      'Script: call a REST API → save to CSV',
    ],
    [
      'Book: **Learn PowerShell in a Month of Lunches**',
      'Docs: Microsoft Learn – PowerShell',
      'Module: SqlServer (PowerShell Gallery)',
    ]),

  ...topic('3.7 eDiscovery Domain (High – big plus)',
    [
      'EDRM model: Identify → Preserve → Collect → Process → Review → Produce',
      'Processing: de-NIST, dedup, email threading, OCR',
      'Load files: DAT, OPT, LFP',
      'Bates numbering, native vs image production',
      'Custodians, chain of custody, metadata',
      'Relativity: workspaces, fields, RDO, Processing, Integration Points',
      'Relativity APIs: REST / Kepler services, Object Manager',
      'Nuix Workstation basics & scripting',
      'Basic legal terms: litigation hold, privilege, production',
    ],
    [
      'Read EDRM diagrams; write a 1-page summary',
      'Watch Relativity & Nuix demo videos',
      'Create a sample DAT load file from your ETL project',
      'Prepare: "how would you fix a failed processing job?"',
    ],
    [
      'Site: **edrm.net** (EDRM model & glossary)',
      'Docs: **help.relativity.com** (user & admin docs)',
      'Docs: **platform.relativity.com** (developer / API)',
      'Relativity Training – RCA certification path',
      'Nuix – Nuix Workstation training & docs',
      'YouTube: Relativity & Nuix official channels',
    ]),

  ...topic('3.8 Debugging & Log Analysis (High)',
    [
      'Reading stack traces',
      'Visual Studio debugger: breakpoints, watch, attach to process',
      'Structured logging (Serilog / NLog)',
      'Windows Event Viewer',
      'SQL Server error log & Extended Events',
      'Root-cause analysis (5 Whys)',
      'Writing clear incident reports',
    ],
    [
      'Inject bugs into your project, then find them',
      'Add structured logging to your ETL tool',
      'Write 2 short RCA reports for practice',
    ],
    [
      'Book: **Debugging** – David Agans (9 rules)',
      'Docs: Visual Studio debugger, Extended Events',
      'Tools: dotnet-dump, dotnet-trace, Seq (log viewer)',
    ]),

  ...topic('3.9 Python, CI/CD & Design (Medium)',
    [
      'Python: pandas, file parsing, pyodbc',
      'Git: branching, pull requests',
      'CI/CD: build & test pipeline',
      'Modular design, clean architecture',
      'API integration patterns: retry, paging, rate limits',
    ],
    [
      'Add a GitHub Actions build to your C# project',
      'Rewrite one ETL step in Python',
      'Draw the architecture of your project',
    ],
    [
      'Docs: GitHub Actions for .NET',
      'Book: **Automate the Boring Stuff with Python** (free online)',
      'Book: **Clean Code** – Robert C. Martin',
    ]),

  h1('4. Portfolio Project (Must Build)'),
  para('**"Mini eDiscovery Processor"** – C# + SQL Server + PowerShell. Shows every skill in the job.'),
  ...[
    'Input: folder of mixed files (EML, PDF, TXT, CSV)',
    'Extract metadata: name, size, dates, author, hash',
    'Extract text; detect & fix encoding',
    'Dedup by SHA-256 hash',
    'Bulk load into SQL Server (SqlBulkCopy)',
    'Log every step + exceptions to a log table',
    'Tune queries with proper indexes',
    'Export a DAT load file + QC validation report',
    'PowerShell script to run the whole job',
    'README with architecture diagram & results',
  ].map(x => bullet(x)),
  gap(),
  para('**Tip:** push to GitHub; put the link on your resume and 104 profile.'),

  h1('5. Interview Preparation'),
  h2('Likely Technical Questions'),
  ...[
    'Clustered vs non-clustered index?',
    'How do you find a slow query?',
    'What is parameter sniffing? How to fix?',
    'How do you load 100M rows fast?',
    'How do you handle bad rows in ETL?',
    'How do you detect file encoding?',
    'async vs multithreading in C#?',
    'IDisposable & using – why?',
    'How to dedup millions of documents?',
    'Walk through debugging an unknown exception',
    'What is a load file / Bates number?',
  ].map(x => bullet(x)),
  h2('Live Coding / Tasks to Practice'),
  ...[
    'Parse a messy CSV in C#',
    'Write top-N-per-group SQL',
    'Find duplicates with window functions',
    'Optimize a given slow query',
    'Write a PowerShell file-rename script',
  ].map(x => bullet(x)),
  h2('Behavioral (STAR Stories)'),
  ...[
    'Hardest data problem you solved',
    'Fixing a production issue under pressure',
    'Working alone with no clear instructions',
    'Improving performance with numbers (e.g. 2 hrs → 5 min)',
    'Explaining technical issue to non-technical person',
    'Why individual contributor, not manager',
  ].map(x => bullet(x)),
  h2('Questions to Ask Them'),
  ...[
    'Main tools: Relativity, Nuix, or in-house?',
    'Typical data volume per matter?',
    'How often are evening/weekend shifts?',
    'How much travel per year?',
    'Is Mandarin needed daily or for some clients?',
  ].map(x => bullet(x)),

  h1('6. Mandarin Requirement – Strategy'),
  ...[
    'Job says **fluent Mandarin** – the biggest gap',
    'Fluency is not possible in 6 weeks – be honest',
    'Apply anyway; ask recruiter if English-only is possible',
    'Highlight: global clients, English docs, strong tech skills',
    'Start basic Mandarin now – shows commitment',
    'Learn tech & work phrases first',
  ].map(x => bullet(x)),
  h3('Materials'),
  ...[
    'NTNU **Mandarin Training Center** (Taipei)',
    'NTU **ICLP** (intensive program)',
    'TOCFL exam – official proficiency proof',
    'Apps: HelloChinese, Duolingo, Pleco (dictionary)',
    'italki – 1-on-1 tutors',
  ].map(x => bullet(x)),

  h1('7. Application Checklist'),
  ...[
    'Resume: C#, MS SQL, ETL, PowerShell at the top',
    'Add numbers: data size, speed gains, rows processed',
    'GitHub portfolio project link',
    '104 profile updated (English + keywords)',
    'Valid Taiwan work permit / ARC ready',
    'Can attend monthly Taipei events',
    'OK with evening/weekend & travel',
    '5–6 STAR stories written',
    'Salary target set (TWD 140K–180K+)',
    '2 mock interviews done',
  ].map(check),
];

const doc = new Document({
  creator: 'Divakar Upadhyay',
  title: 'Preparation Plan – Senior Backend Data Engineer',
  styles: {
    default: { document: { run: { font: 'Calibri', size: 21 } } },
    paragraphStyles: [
      { id: 'Title', name: 'Title', basedOn: 'Normal', run: { size: 34, bold: true, color: ACCENT }, paragraph: { spacing: { after: 60 } } },
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 28, bold: true, color: ACCENT }, paragraph: { spacing: { before: 320, after: 120 }, outlineLevel: 0, keepNext: true } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 24, bold: true, color: '2E75B6' }, paragraph: { spacing: { before: 220, after: 60 }, outlineLevel: 1, keepNext: true } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 21, bold: true, color: '404040' }, paragraph: { spacing: { before: 100, after: 40 }, outlineLevel: 2, keepNext: true } },
    ],
  },
  numbering: { config: [
    { reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 540, hanging: 270 } } } }] },
    { reference: 'checks', levels: [{ level: 0, format: LevelFormat.BULLET, text: '☐', alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 540, hanging: 300 } }, run: { font: 'Segoe UI Symbol' } } }] },
  ] },
  sections: [{ properties: { page: { margin: { top: 1200, bottom: 1200, left: 1440, right: 1440 } } }, children }],
});

Packer.toBuffer(doc).then(b => { fs.writeFileSync(out, b); console.log('written', out); });
