const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, LevelFormat,
  Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle, PageBreak,
  Footer, PageNumber, TableOfContents,
} = require('docx');

const ACCENT = '1F4E79', SUB = '2E75B6', LIGHT = 'EEF3F8';
const out = process.argv[2];

// Inline markup: **bold**, [red placeholder to fill]
function runs(text, base = {}) {
  return text.split(/(\*\*[^*]+\*\*|\[[^\]]+\])/).filter(Boolean).map(p =>
    p.startsWith('**') ? new TextRun({ ...base, text: p.slice(2, -2), bold: true })
      : p.startsWith('[') ? new TextRun({ ...base, text: p, color: 'C00000', italics: true })
      : new TextRun({ ...base, text: p }));
}
const bullet = (t, level = 0) => new Paragraph({ numbering: { reference: 'bullets', level }, children: runs(t), spacing: { after: 40 } });
const bl = arr => arr.map(x => bullet(x));
const check = t => new Paragraph({ numbering: { reference: 'checks', level: 0 }, children: runs(t), spacing: { after: 40 } });
const h1 = t => new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true, children: [new TextRun(t)],
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ACCENT, space: 4 } } });
const h2 = t => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(t)] });
const h3 = t => new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun(t)] });
const para = t => new Paragraph({ spacing: { after: 120 }, children: runs(t) });
const gap = () => new Paragraph({ spacing: { after: 60 }, children: [] });
const box = (t, fill = LIGHT, edge = ACCENT) => new Paragraph({
  spacing: { before: 60, after: 100 }, indent: { left: 240, right: 240 },
  shading: { type: ShadingType.CLEAR, fill, color: 'auto' },
  border: { left: { style: BorderStyle.SINGLE, size: 18, color: edge, space: 8 } },
  children: runs(t),
});
const say = t => box(t);                                  // speak-aloud script
const tip = t => box('TIP: ' + t, 'FFF4E5', 'ED7D31');     // advice callout

const MATCH = { Strong: '2E7D32', Good: '2E7D32', Partial: 'B26A00', Gap: 'C00000', Blocker: 'C00000' };
function table(widths, rows) {
  const total = widths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: total, type: WidthType.DXA }, columnWidths: widths,
    rows: rows.map((r, ri) => new TableRow({ tableHeader: ri === 0, cantSplit: true, children: r.map((t, i) => new TableCell({
      width: { size: widths[i], type: WidthType.DXA },
      shading: ri === 0 ? { type: ShadingType.CLEAR, fill: ACCENT, color: 'auto' }
        : ri % 2 === 0 ? { type: ShadingType.CLEAR, fill: LIGHT, color: 'auto' } : undefined,
      margins: { top: 60, bottom: 60, left: 100, right: 100 },
      children: [new Paragraph({ children: ri === 0 ? [new TextRun({ text: t, bold: true, color: 'FFFFFF' })]
        : MATCH[t] ? [new TextRun({ text: t, bold: true, color: MATCH[t] })] : runs(t) })],
    })) })),
  });
}

// Q + model answer (spoken) + optional notes
const qa = (q, answer, notes = []) => [
  new Paragraph({ spacing: { before: 160, after: 40 }, keepNext: true, children: [new TextRun({ text: 'Q: ' + q, bold: true, color: SUB })] }),
  say(answer),
  ...bl(notes),
];

const star = (title, rel, s, t, a, r) => [
  new Paragraph({ spacing: { before: 200, after: 40 }, keepNext: true, children: [new TextRun({ text: title, bold: true, color: SUB, size: 23 })] }),
  new Paragraph({ spacing: { after: 60 }, keepNext: true, children: runs('**Use for:** ' + rel) }),
  table([1400, 7626], [['Step', 'What to say'], ['Situation', s], ['Task', t], ['Action', a], ['Result', r]]),
];

// ---------------------------------------------------------------------------
const children = [
  // ---------- COVER ----------
  new Paragraph({ spacing: { before: 200 }, children: [] }),
  new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun('Round 1 Interview – Complete Prep Guide')] }),
  new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: 'Sandline Global · Senior Backend Data Engineer', size: 28, color: SUB })] }),
  new Paragraph({ spacing: { after: 400 }, children: [new TextRun({ text: 'Divakar R. Upadhyay · Monday 12 October 2026 · 2:00 PM Taipei', color: '595959' })] }),
  table([2400, 6626], [
    ['Item', 'Detail'],
    ['Date & time', '**Mon 12 Oct 2026, 2:00 – 2:45 PM** (Taipei time)'],
    ['Format', 'Microsoft Teams · **audio only** (no camera)'],
    ['Language', '**English only**'],
    ['Interviewer', 'Gloria Liu – **Operations Manager**'],
    ['Stage', 'First stage – experience, fit & logistics'],
    ['Invite', 'Sent to divakarup1991@gmail.com – accepted'],
    ['Contact', 'gliu@sandlineglobal.com'],
  ]),
  gap(),
  para('**How to use this guide:** this is the only document you need. Read Parts 1–4 first, practise Parts 5–7 aloud, use Parts 8–10 as reference, and keep Part 14 open during the call.'),
  para('**Red text in [brackets]** = something only you know. Fill it in before Sunday.'),
  gap(),
  new TableOfContents('Contents', { hyperlink: true, headingStyleRange: '1-1' }),

  // ---------- PART 1 ----------
  h1('Part 1 – One-Page Cheat Sheet'),
  h2('Your Pitch in One Line'),
  say('"I\'m a senior C#/.NET and SQL Server engineer with 11 years of experience moving messy data between systems – EDI, SSIS pipelines, 13+ API integrations and audit trails – and turning it into reliable, validated results."'),
  h2('Your 6 Selling Points'),
  ...bl([
    '**C#/.NET for 11 years** – their #1 strict requirement',
    '**MS SQL Server + stored procedures + SSIS** – daily tools at Acer & AMG',
    '**FedEx/TNT EDI, multiple formats** – parsing messy data = their daily work',
    '**Append-only audit triggers (AMG)** – like eDiscovery chain of custody',
    '**13+ external integrations** – APIs, gateways, carriers – ready for Relativity APIs',
    '**Taiwan Gold Card** – no sponsorship; lives in New Taipei, easy reach to Taipei',
  ]),
  h2('Your 4 Gaps – Answer Ready'),
  table([2200, 6826], [
    ['Gap', 'Short answer'],
    ['Mandarin', 'Honest: English, Hindi, Marathi. 4+ yrs working in Taiwan in English, incl. Acer PMs daily'],
    ['Relativity / Nuix', 'Not hands-on yet; know EDRM; processing = ETL I already do; their APIs are REST'],
    ['PowerShell', '.NET-based – same objects as C#; [your real usage]; quick to ramp'],
    ['SQL tuning at TB scale', 'Tuned procs & reports [example]; same principles: indexes, batching, partitioning'],
  ]),
  h2('Your Situation & Salary – Two Lines to Remember'),
  say('"AMG closed its operations in [month] 2026, so my role ended. I am available to start immediately."'),
  say('"My expectation is around TWD 150,000 a month, within your published range, and I am flexible."'),
  ...bl(['Last salary if asked: **70,000** (honest; the pension is not salary)', 'Why it closed – only if asked: "regulatory and banking compliance issues; I was not involved in business decisions"', 'Full answers: Part 6']),
  h2('3 Company Facts to Drop'),
  ...bl([
    'Mission: **"We obsess over quality, so you don\'t have to."**',
    'Own ETL tech: **ModernETL** (2.0 solves "universal threading")',
    '5,000+ engagements · 7 countries · Taipei is one of 5 offices',
  ]),
  h2('Must Say Before the Call Ends'),
  ...bl(['Gold Card – no sponsorship', '**Available to start immediately**', 'Can attend monthly Taipei events', 'OK with urgent evening/weekend work & travel', 'Why I want this role (data + C# + quality)', 'Ask: next steps & timeline']),

  // ---------- PART 2 ----------
  h1('Part 2 – Resume vs Job: Fit Analysis'),
  para('Every job requirement compared with your resume. Use the right column as your evidence.'),
  table([2600, 1000, 5426], [
    ['Job requirement', 'Match', 'Evidence from your resume'],
    ['C#/.NET (strictly required)', 'Strong', 'C# since 2015; .NET 8 Clean Architecture at AMG; ASP.NET MVC, .NET Core, VB.NET'],
    ['MS SQL Server querying', 'Strong', 'MSSQL in every job; T-SQL, stored procedures, ADO.NET, Dapper, EF'],
    ['SQL DBA & performance tuning', 'Partial', 'Not explicit on resume – prepare 1–2 tuning examples [Acer SSRS / AMG]'],
    ['ETL pipelines, high-volume ingestion', 'Good', 'Automated SSIS pipelines at Acer; IGI global data sync'],
    ['Text parsing, unsupported structures', 'Strong', 'FedEx/TNT EDI in multiple document formats; SOAP/XML & REST/JSON'],
    ['Encoding errors', 'Partial', 'Full i18n localisation rollout at Acer (Unicode, Chinese text)'],
    ['Database logging, exception resolution', 'Good', 'Append-only audit triggers in MSSQL; compliance gates'],
    ['Custom tools & automation', 'Good', 'Generic Crystal Report loader; gift-card code generator; admin tooling'],
    ['API integrations', 'Strong', 'FedEx/TNT, DHL, Salesforce, Stripe, PayU, HDFC, Atom, Rapaport, Apollo, Doc24x7, DefExpo, Privy, Sumsub'],
    ['PowerShell', 'Gap', 'Not on resume – see Part 6'],
    ['Relativity / Nuix', 'Gap', 'Not on resume – see Part 6 & Part 9'],
    ['Python (plus)', 'Gap', 'Not on resume – only "plus"; C# prioritised'],
    ['Work with PMs & global teams', 'Strong', 'Daily scrums with Acer PMs; led team of 5 at Health Assure'],
    ['QC / 100% precision', 'Good', 'Owned IT/UAT release cycle at Acer; compliance flows at AMG'],
    ['Independent investigator', 'Good', 'Owned features end-to-end across 6 companies'],
    ['CI/CD, modular design', 'Strong', 'Azure DevOps, GitHub Actions, Docker; Clean Architecture, repository pattern'],
    ['5+ years experience', 'Strong', '11 years (2015–2026); 8 years at senior level'],
    ['Degree (CS / IM / Math)', 'Strong', 'M.Sc. Computer Science, University of Mumbai (2014)'],
    ['Taiwan work permit', 'Strong', 'Taiwan Employment Gold Card (Tech)'],
    ['Commute to Taipei', 'Strong', 'Lives in New Taipei City'],
    ['English fluent', 'Strong', 'Professional working proficiency'],
    ['Mandarin fluent', 'Blocker', 'Not listed – see Part 6'],
  ]),
  gap(),
  h2('Overall Verdict'),
  ...bl([
    '**Core fit is strong:** C#, MS SQL, SSIS, data integration – exactly what Gloria highlighted',
    '**Biggest risk:** Mandarin – but they chose an English interview anyway',
    '**Image risk:** resume reads "full-stack + Web3" – reposition as **backend/data engineer**',
    '**Domain gap:** eDiscovery – close it with Part 9 vocabulary',
  ]),

  h2('Experience Count – Say It Consistently'),
  ...bl([
    'Resume summary says **8+ years** – that is your senior-level time (Sep 2018 → now)',
    'Total career: **11 years** (Feb 2015 → now)',
    'Say: **"11 years in total, 8 of them as a senior engineer"**',
  ]),

  // ---------- PART 3 ----------
  h1('Part 3 – Your Positioning Story'),
  para('Your resume shows many domains (FinTech, HealthTech, Logistics, Diamonds, Web3). Do not present yourself as a full-stack generalist. Present **one connected story**:'),
  say('"In every company, I was the person who owned the **data layer and the integrations** – getting data from outside systems, cleaning it, storing it reliably in SQL Server, and proving it was correct."'),
  h2('Domain → What It Taught You → Why It Matters to Sandline'),
  table([2200, 3300, 3526], [
    ['Domain / company', 'Data lesson', 'Sandline link'],
    ['Logistics – Acer', 'Multi-format EDI, SSIS pipelines, reporting', 'Ingest many formats; ETL; QC reports'],
    ['FinTech/Web3 – AMG', 'Audit trails, compliance, KYC', 'Defensible data; chain of custody'],
    ['HealthTech – Health Assure', 'Sensitive data, external APIs, team lead', 'Confidential legal data; partner APIs'],
    ['Diamond labs – IGI/GIA', 'Global data sync, precise grading records', 'Multi-country data; precision'],
    ['FinTech – Bajaj', 'Salesforce, payments, AWS S3 files', 'Integrations; file storage'],
    ['Multi-domain – Dotcom', 'Layered architecture from scratch', 'Build standalone tools'],
  ]),
  h2('Words to Use Often'),
  ...bl(['data pipeline', 'ingestion', 'validation', 'exception handling', 'root cause', 'audit trail', 'precision', 'automation', 'integrity']),
  h2('Words to Use Less'),
  ...bl(['frontend, React, Angular, Next.js (only if asked)', 'Web3, crypto, NFT (say "compliance-heavy investment platform")', 'manager / lead (role is 100% individual contributor)']),

  // ---------- PART 4 ----------
  h1('Part 4 – Self-Introduction Scripts'),
  h2('Full Version (≈ 90 seconds)'),
  say('"Thank you for having me, Gloria. I\'m Divakar Upadhyay, a senior software engineer based in New Taipei City. I have about **11 years of experience, 8 at senior level**, building production systems on **C#, .NET and Microsoft SQL Server**."'),
  say('"Most of my work has been about **moving data reliably between systems**. For three years I worked on-site at **Acer Taiwan**, where I integrated **FedEx and TNT EDI in multiple document formats**, built **automated SSIS data pipelines** and a full **SSRS reporting suite**, and owned the test and release cycle with Acer\'s project managers."'),
  say('"Most recently, until [month] 2026, I was a senior engineer at **AMG**, where I designed a **.NET 8 backend with Dapper and SQL Server** for a compliance-heavy investment platform, including **append-only audit triggers** – so I know how important it is that data can never be changed silently. The company has since **closed its operations**, so I am now focused on finding the right long-term role."'),
  say('"Across my career I\'ve integrated **more than 13 external systems** – carriers, payment gateways, Salesforce, healthcare APIs – and every one came with messy formats and edge cases I had to investigate and fix."'),
  say('"That\'s why this role excites me: it is hands-on, built on C# and SQL Server, and all about turning complex data into precise, validated results. I also hold a **Taiwan Gold Card**, so I need no sponsorship and **can start immediately**."'),
  h2('Short Version (≈ 30 seconds)'),
  say('"I\'m a senior C#/.NET and SQL Server engineer with 11 years of experience. At Acer Taiwan I built SSIS pipelines and integrated FedEx and TNT EDI in multiple formats, and most recently I built a .NET 8 and SQL Server backend with full audit trails, until that company closed its operations. I enjoy investigating messy data and automating it into reliable results – which is exactly what this role is about."'),
  h2('Delivery Tips (Audio Only)'),
  ...bl(['Speak 10% slower than normal', 'Pause after each paragraph', 'Smile – it changes your voice', 'Stress the **bold** words', 'Stop after the last line – let Gloria lead', 'Practise 5 times aloud; record once and listen']),

  // ---------- PART 5 ----------
  h1('Part 5 – Resume Walkthrough (Job by Job)'),
  para('If Gloria says "walk me through your resume", spend most time on Acer and AMG. Older jobs: one line each.'),

  h2('1. Ample Group Global (AMG) – Mar 2025 to [month] 2026 (company closed)'),
  h3('Say'),
  ...bl([
    'Designed .NET 8 backend: Clean Architecture, Dapper, MSSQL, repository + service layer',
    'Compliance flows: KYC (Sumsub), 48-hour withdrawal queue, compliance gates',
    '**Append-only audit triggers in MSSQL** – every change recorded, nothing deleted',
  ]),
  h3('Link to Sandline'),
  ...bl(['Audit trail = **defensibility / chain of custody** in legal data', 'Clean, modular backend = maintainable custom tools']),
  h3('Expect Follow-Up'),
  ...bl(['"How did the audit triggers work?" → AFTER INSERT/UPDATE/DELETE triggers write old & new values, user, time to audit table; audit table blocks UPDATE/DELETE', '"Why did you leave?" / "Why did it close?" → see Part 6 – Your Current Situation']),

  h2('2. Skywind @ Acer Taiwan – Mar 2022 to Feb 2025  ★ MOST IMPORTANT'),
  h3('Say'),
  ...bl([
    'Acer\'s in-house **Contact Service System** – repair centres & partners across Taiwan',
    '**TNT & FedEx EDI** – multiple document formats',
    'DHL payment gateway',
    '**Automated SSIS data pipelines** + end-to-end **SSRS reporting suite**',
    'Full **i18n localisation** rollout (multi-language text)',
    'Daily scrums with Acer PMs; requirement analysis; IT/UAT release owner',
  ]),
  h3('Link to Sandline'),
  ...bl(['Multi-format parsing = eDiscovery **processing**', 'SSIS = their **ETL workflows**', 'i18n = **encoding / Unicode** experience', 'UAT ownership = **QC before promotion**', 'Working with Taiwanese PMs = **cross-functional** + works in Taiwan']),
  h3('Prepare Numbers'),
  ...bl(['[How many EDI formats / message types?]', '[Shipments or records per day?]', '[How many SSIS packages / reports?]', '[How many languages in i18n?]', '[Any time saved or errors reduced?]']),

  h2('3. Health Assure – Apr 2021 to Nov 2021'),
  ...bl(['Led team of 5; full-cycle delivery', 'Apollo Pharmacy & Doc24x7 API integrations', 'REST APIs for iOS & Android; releases', '**Link:** sensitive data + partner APIs', 'If asked about leading: "I led, but I enjoy hands-on work most – this IC role suits me"']),

  h2('4. Tecogis – Sep 2018 to Mar 2021'),
  ...bl(['Diamond inventory & grading for retailers and labs (IGI, GIA)', 'IGI portal: e-signature, Rapaport API pricing, **global data sync**', '**Generic Crystal Reports loader** – a reusable custom tool', 'DefExpo 2020 event system via official API', '**Link:** multi-country data sync; precise records; reusable tooling']),

  h2('5. Fulcro World – Sep 2017 to Sep 2018'),
  ...bl(['Bajaj FinServ platform + **Salesforce API** (lead tracking)', 'Gift-card service: code generation, delivery, redemption', 'AWS S3 file storage']),

  h2('6. Dotcom Service India – Feb 2015 to May 2017'),
  ...bl(['Built apps from scratch: data, business, presentation layers', 'Payment gateways: PayU, Stripe, HDFC, Atom']),

  h2('Education'),
  ...bl(['M.Sc. Computer Science, University of Mumbai, 2014 – matches "CS / Information Engineering"']),

  // ---------- PART 6 ----------
  h1('Part 6 – Gaps & Tough Questions (Model Answers)'),
  tip('Be honest, short, then turn to a strength. Never argue with the job description.'),

  h2('Your Current Situation – How to Handle It'),
  para('**Facts:** AMG closed its operations after regulatory and banking compliance problems. Your role ended because the company closed, not because of your performance. You are available to start immediately.'),
  table([4513, 4513], [
    ['Do', 'Don\'t'],
    ['Say it early, once, calmly: "the company closed its operations"', 'Don\'t hide it – your CV says "Present" and they may check'],
    ['Use neutral words: "regulatory and compliance issues"', 'Don\'t say "violations", "illegal", "fraud" or "scam"'],
    ['Make clear you were an engineer, not part of business decisions', 'Don\'t give details – you may be under NDA, and details invite more questions'],
    ['Turn to the future: why Sandline, why now', 'Don\'t blame the founders or sound bitter'],
    ['Present "available immediately" as a benefit', 'Don\'t sound desperate ("I really need any job")'],
    ['Keep salary answers honest and consistent', 'Don\'t inflate your last salary – employers in Taiwan can ask for a withholding statement or payslips'],
  ]),
  gap(),
  h3('Before Monday'),
  ...bl([
    'Confirm your exact last working day: [month / year]',
    'Request a **service certificate** (服務證明書) from AMG – an employer must issue one on request (Labor Standards Act, Article 19)',
    'Ask a former manager or senior colleague to be a **reference**',
    'Your **Gold Card is not tied to an employer** – your right to work is unaffected',
    'For future applications, update your resume: AMG "Mar 2025 – [month] 2026"',
  ]),


  ...qa('The role asks for fluent Mandarin. What is your level?',
    '"To be transparent, I am not fluent in Mandarin – my languages are English, Hindi and Marathi. But I have worked in Taiwan in English for over four years, including three years on-site at Acer, where I ran daily scrums with Taiwanese project managers and owned requirement analysis. Since your clients are global legal teams, I\'m confident my English technical writing and root-cause reports will add value from day one, and I\'m [learning Mandarin / happy to learn Mandarin] to work better with the local team."',
    ['Only say "learning" if true', 'Don\'t over-apologise – one answer, then move on', 'Good sign: they chose an English-only interview']),

  ...qa('You haven\'t used Relativity or Nuix. How will you manage?',
    '"That\'s right, I haven\'t used them hands-on yet. But I\'ve studied how eDiscovery processing works – ingesting containers like PST and ZIP, extracting text and metadata, de-duplicating by hash, handling exceptions and producing load files. That is ETL, which is what I\'ve done for years with SSIS and C#. Relativity exposes REST APIs, and I\'ve integrated more than 13 external APIs, so I expect to ramp up quickly."'),

  ...qa('How much PowerShell have you used?',
    '"[Choose one: I have used PowerShell for deployment and automation scripts, for example ... / My automation so far has mainly been in C# and SSIS.] PowerShell runs on .NET, so it uses the same objects and libraries I use every day in C#. I\'m comfortable scripting file operations, hashing, SQL calls and REST calls with it."',
    ['Know the basics in Part 8.5 before the call']),

  ...qa('Your resume looks full-stack and Web3. Why a backend data role?',
    '"My resume shows full-stack because I owned features end to end, but in every job my core has been the backend and the database – SQL Server, stored procedures, SSIS and integrations. That\'s what I\'m strongest at and enjoy most, and this role lets me focus fully on it."'),

  ...qa('Your resume says you are at AMG now. Are you still working there?',
    '"Thank you for asking – I should update you. AMG closed its operations in [month] 2026, so my role ended then. I am available to start immediately."',
    ['Say it calmly; a company closing is a normal business event', 'If you sent your CV before the closure, add: "It closed after I sent my CV."']),

  ...qa('Why did you leave AMG?',
    '"The company closed its operations, so all roles ended, including mine. While I was there, I designed the .NET 8 and SQL Server backend and built the compliance and audit features. It was valuable experience, and it showed me that I want my next role in a stable, quality-focused company where I can focus on backend data engineering – which is exactly this role."',
    ['The reason is the company closure, not your performance', 'Then move straight to the future']),

  ...qa('Why did the company close?',
    '"The company ran into regulatory and banking compliance issues, and management decided to close the business. As an engineer I was not involved in those business decisions, and I prefer not to go into details that are not mine to share. My work was on the technical side – the backend, the compliance checks and the audit trail."',
    ['Answer only if asked directly – never volunteer it', 'One or two sentences, then stop', 'Stay neutral; do not judge the company', 'If pushed: "That is really all I know as an engineer."']),

  ...qa('So you are currently not working?',
    '"That\'s right, since [month]. I have used this time to [study eDiscovery processing and sharpen my SQL tuning and PowerShell skills], and I am ready to start immediately."',
    ['Fill in what you are really doing: learning, projects, interviews', 'Being available now is a plus – they want someone within a month']),

  ...qa('There\'s a gap between Nov 2021 and Mar 2022. What happened?',
    '"[e.g., I relocated from Mumbai to Taiwan during that time and joined Skywind at Acer in March 2022.]"',
    ['Fill in the real reason; one sentence is enough']),

  ...qa('Health Assure was only 8 months. Why?',
    '"[Your real reason – e.g., I received the opportunity to move to Taiwan.]"'),

  ...qa('Have you handled terabyte-scale data?',
    '"My largest datasets were around [size / row count]. The principles are the same at larger scale – bulk loading in batches, staging tables, proper indexing, partitioning large tables, and avoiding row-by-row processing. I\'m excited to work at that scale."'),

  ...qa('This is a 100% individual-contributor role. You led a team before. Is that OK?',
    '"Yes, absolutely. I led a team of five once and learned a lot, but I enjoy hands-on technical work most – writing code, solving data problems. That\'s why this role appeals to me."'),

  ...qa('What is your salary expectation?',
    '"Based on my 11 years of experience and the scope of this role, I am looking for around **TWD 150,000 per month**, which is within the range you published. I am flexible on the exact number – the right role and a long-term fit matter most to me."',
    ['Target **150,000**; happy to accept **140,000** (their published minimum) – see the salary strategy below', 'One clear number ("around 150,000") sounds confident and reasonable', 'Don\'t ask for 180,000 – too risky with the Mandarin and eDiscovery gaps']),

  ...qa('What was your last salary?',
    '"My last monthly salary at AMG was TWD 70,000. That was a start-up package and below the market rate for my experience. For this role, my expectation is based on its scope and on the range Sandline published, so around 150,000."',
    ['Tell the truth – they may ask for proof', 'Don\'t add the 4,500 pension to it: that is the legal 6% employer pension contribution every company in Taiwan pays, not salary', 'If asked about the total package: "70,000 a month, plus statutory labour insurance and pension"']),

  ...qa('That is a big jump from 70,000. Why should we pay that much?',
    '"I understand. My last salary reflected a small start-up\'s budget, not the market value of the work. This role needs a senior C# and SQL Server engineer who can own complex data problems independently, which is what I have done for 11 years. I am flexible, and I am confident I will show my value quickly."',
    ['Stay calm; don\'t apologise', 'Then stop talking and let Gloria respond']),

  ...qa('When can you start?',
    '"I can start immediately – I am available now."',
    ['A strong advantage: they want someone within a month']),

  ...qa('Do you have a Taiwan work permit?',
    '"Yes – I hold a **Taiwan Employment Gold Card**, so no sponsorship is needed."'),

  ...qa('Can you attend monthly in-person events in Taipei?',
    '"Yes. I live in New Taipei City, so Taipei is very easy for me."'),

  ...qa('Are you OK with evening/weekend work and travel?',
    '"Yes. I understand legal matters have urgent deadlines. I\'m happy to support when needed, and I\'m open to travel."'),

  h2('Salary Strategy for Your Situation'),
  table([3400, 5626], [
    ['Item', 'Amount (TWD)'],
    ['Last salary (AMG)', '70,000 / month (the 4,500 pension is the statutory 6% contribution, not salary)'],
    ['Sandline published range', '140,000 – 180,000+ / month + bonus (historically 2 months)'],
    ['**Your ask**', '**Around 150,000 / month**'],
    ['Happy to accept', '140,000 – 150,000 / month'],
    ['Per year at 150,000 (12 months + 2-month bonus)', 'About 2,100,000 (AMG: about 840,000)'],
    ['Per year at 140,000 (12 months + 2-month bonus)', 'About 1,960,000'],
  ]),
  gap(),
  h3('Why 150,000 and Not More'),
  ...bl([
    'You need a stable job now – **getting the offer comes first**',
    'Your gaps (Mandarin, eDiscovery tools) make the top of the range risky',
    '150,000 sits inside their range, just above the minimum – an easy yes for them',
    'Even 140,000 is double your last salary',
    'The bonus is discretionary – "historically 2 months" is not guaranteed',
  ]),
  h3('If They Offer Below 140,000'),
  ...bl([
    'Don\'t reject it on the call: "Thank you. May I take a day to consider it?"',
    'Ask about the bonus and a salary review after probation',
    'Given your situation, an offer of 120,000 or more is still a big step up – decide calmly, not under pressure',
  ]),
  h3('Timing'),
  ...bl([
    'Round 1 usually only checks your expectation – give the number and move on',
    'Real negotiation happens at the offer stage',
  ]),

  // ---------- PART 7 ----------
  h1('Part 7 – STAR Stories (Pre-Filled)'),
  para('STAR = **S**ituation · **T**ask · **A**ction · **R**esult. Each story ≈ 1.5–2 minutes. Fill red numbers.'),

  ...star('Story 1 – FedEx & TNT EDI, multiple formats (Acer)',
    'Hardest data problem · parsing · messy data · integrations',
    'Acer\'s Contact Service System needed shipment data from TNT and FedEx. Each carrier sent EDI in different document formats.',
    'Integrate both carriers so shipment data arrived correctly and automatically.',
    'Studied each carrier\'s spec; mapped each format to one common data model; added validation for required fields, dates and codes; logged rejected records instead of dropping them; tested every format in IT/UAT with Acer PMs. [Add any tricky edge case you hit]',
    '[Number] formats live; [records/day] processed; [manual work reduced / errors reduced]; stable in production.'),

  ...star('Story 2 – SSIS pipelines + SSRS reporting suite (Acer)',
    'ETL design · automation · data quality',
    'Acer teams needed regular reports from service-centre data. [Data was manual / scattered across sources]',
    'Automate data movement and build an end-to-end reporting suite.',
    'Built SSIS packages: extract → staging tables → transform → load; error outputs to redirect bad rows; scheduled with SQL Agent; built SSRS reports on top. [Add logging / row-count checks if used]',
    '[Number] reports automated; [hours saved per week]; users got data [daily / on time].'),

  ...star('Story 3 – Append-only audit trail (AMG)',
    'Data integrity · compliance · accountability',
    'A tokenised investment platform needed a tamper-proof record of every sensitive change for compliance.',
    'Design an audit trail that cannot be edited or deleted.',
    'Built MSSQL triggers to capture old value, new value, user and timestamp into audit tables; made audit tables append-only (UPDATE/DELETE blocked); combined with KYC checks and a 48-hour withdrawal queue.',
    'Complete, provable history of every change – [passed review / supported compliance]. Same idea as chain of custody in eDiscovery.'),

  ...star('Story 4 – i18n localisation rollout (Acer)',
    'Text, encoding, Unicode · large change across the system',
    'The Contact Service System was used by repair centres and partners and needed multiple languages.',
    'Lead a full internationalisation rollout across the application.',
    '[Resource files for UI text; Unicode-safe storage (NVARCHAR); date/number/culture formats; testing with Chinese text]. Fill with what you really did.',
    '[Number] languages live; [no text corruption issues / smooth rollout].'),

  ...star('Story 5 – A production bug you solved alone',
    'Independent investigation · log analysis · pressure',
    '[A production issue: e.g., EDI files failing / report showing wrong numbers / payment callback failing]',
    'Find the root cause quickly with no clear error.',
    'Reproduced the issue; checked application logs and SQL data; isolated the bad input or code path; fixed it; added a validation/check so it can\'t happen again; documented the root cause.',
    '[Fixed within X hours]; [issue never returned]; [prevented future failures].'),

  ...star('Story 6 – Working with PMs / cross-functional',
    'Cross-functional deep dives · communication',
    'At Acer, I ran daily scrums with Acer project managers.',
    'Turn business needs into technical work and deliver through IT/UAT.',
    'Clarified requirements; explained technical risks in simple words; owned the IT/UAT release cycle.',
    '[Releases delivered on time]; [smooth UAT sign-off].'),

  ...star('Story 7 – Global data sync (IGI)',
    'Multi-location data · precision',
    'IGI grading data needed to be consistent across international locations.',
    'Build reliable global data synchronisation.',
    '[How sync worked – scheduled jobs / APIs / conflict handling]',
    '[Labs connected]; [accurate records everywhere].'),

  // ---------- PART 8 ----------
  h1('Part 8 – Technical Refresher'),
  para('Gloria is an Operations Manager, so expect **concept-level** questions, not live coding. Know these clearly in simple words.'),

  h2('8.1 SQL Server Performance'),
  table([2600, 6426], [
    ['Topic', 'Simple explanation'],
    ['Clustered index', 'Table data is stored sorted by this key. One per table.'],
    ['Non-clustered index', 'Separate sorted list pointing to rows. Many per table.'],
    ['Covering index', 'Index has all needed columns (INCLUDE) – no extra lookup.'],
    ['Seek vs Scan', 'Seek = jump to rows (fast). Scan = read everything (slow on big tables).'],
    ['Key lookup', 'Index found row but must fetch more columns – fix with INCLUDE.'],
    ['Execution plan', 'Shows how SQL runs a query. Check costly operators, scans, estimated vs actual rows.'],
    ['Statistics', 'Data distribution info used to pick plans. Outdated stats = bad plans.'],
    ['Parameter sniffing', 'Plan built for first parameter value, bad for others. Fix: OPTION(RECOMPILE), OPTIMIZE FOR, Query Store.'],
    ['SARGable', 'Avoid functions on columns, leading % wildcards, implicit conversions (VARCHAR vs NVARCHAR).'],
    ['Deadlock', 'Two sessions block each other. Fix: same access order, short transactions, good indexes.'],
    ['NOLOCK', 'Dirty reads – **never** for legal data needing 100% accuracy.'],
    ['Partitioning', 'Split huge tables by range (e.g., date/case) for easier loads and maintenance.'],
    ['DMVs / Query Store', 'Built-in views to find slowest and most frequent queries.'],
  ]),
  h3('Your 5-Step Tuning Answer'),
  ...bl(['1. Find slow query (Query Store / DMVs)', '2. Read the actual execution plan', '3. Fix indexes or rewrite (SARGable, no cursors)', '4. Update statistics; check parameter sniffing', '5. Measure before/after; monitor']),

  h2('8.2 Loading Large Data'),
  ...bl([
    '**SqlBulkCopy** in C# / BULK INSERT / bcp – not row-by-row inserts',
    'Load in **batches** (e.g. 10k–100k rows)',
    'Load to **staging table** first → validate → move to final',
    'Disable non-clustered indexes during huge loads, rebuild after',
    'Large UPDATE/DELETE in small batches to avoid lock & log growth',
    'TABLOCK + simple/bulk-logged recovery = minimal logging',
  ]),

  h2('8.3 ETL & SSIS'),
  ...bl([
    '**Control flow** = order of tasks; **Data flow** = moving & transforming rows',
    'Lookups, derived columns, conditional split',
    '**Error output** → redirect bad rows to error table',
    'Logging & event handlers; SSISDB catalog; SQL Agent schedules',
    'Good ETL: **idempotent** (safe to re-run), restartable, logged',
    'Always **reconcile**: source count = loaded + rejected',
  ]),
  h3('Your ETL Design Answer'),
  say('"Extract to a staging area, validate and log every bad row with a reason, transform, then load in batches. Every step writes to a log table, the job is safe to re-run, and I finish with reconciliation – row counts and hashes – before anything is released."'),

  h2('8.4 Text & Encoding'),
  ...bl([
    '**UTF-8**: 1–4 bytes per character; web/file default',
    '**UTF-16**: what SQL Server NVARCHAR uses',
    '**Big5**: old Traditional Chinese encoding – common in Taiwan data',
    '**BOM**: bytes at file start marking encoding (UTF-8 = EF BB BF)',
    '**Mojibake**: garbled text (e.g. "Ã©") – file read with wrong encoding',
    'Fix: detect source encoding → read with correct Encoding → store as NVARCHAR',
    '.NET Core: call Encoding.RegisterProvider(CodePagesEncodingProvider.Instance) to use Big5',
    'Use VARCHAR for Chinese = data loss ("???")',
  ]),

  h2('8.5 PowerShell Basics'),
  table([3800, 5226], [
    ['Command', 'Use'],
    ['Get-ChildItem -Recurse -File', 'List all files in folders'],
    ['Get-FileHash -Algorithm SHA256', 'Hash a file (dedup, integrity)'],
    ['Import-Csv / Export-Csv', 'Read / write CSV as objects'],
    ['Select-String -Pattern "ERROR"', 'Search logs (like grep)'],
    ['Invoke-Sqlcmd', 'Run SQL (SqlServer module)'],
    ['Invoke-RestMethod', 'Call REST APIs'],
    ['try { } catch { } + -ErrorAction Stop', 'Error handling'],
  ]),
  h3('Example: Find Duplicate Files'),
  box('Get-ChildItem -Recurse -File | Get-FileHash -Algorithm SHA256 | Group-Object Hash | Where-Object Count -gt 1'),

  h2('8.6 C# for Data Processing'),
  ...bl([
    'Stream big files: StreamReader.ReadLine / File.ReadLines – not ReadAllText',
    'Parallel work: Parallel.ForEachAsync, Channels, SemaphoreSlim to limit',
    'async/await for I/O (files, DB, API)',
    'using / IDisposable to release files & connections',
    'Hashing: SHA256 over a stream for large files',
    'Dapper for fast queries; SqlBulkCopy for big inserts',
    'Structured logging (Serilog) with case/batch IDs',
  ]),

  h2('8.7 Debugging Approach'),
  say('"First I reproduce the problem. Then I read the logs and stack trace, check the input data, and narrow it down to the exact record or code path. I fix the root cause, not just the symptom, add a check or test so it can\'t happen again, and write a short root-cause note for the team."'),

  // ---------- PART 9 ----------
  h1('Part 9 – eDiscovery Crash Course'),
  h2('What eDiscovery Is'),
  para('In lawsuits and investigations, each side must find and hand over relevant **electronic** evidence – emails, documents, chats, phone data. eDiscovery companies like Sandline collect that data, **process** it, help lawyers **review** it, and **produce** it – with full proof it was not altered.'),
  h2('EDRM – The Standard Model'),
  table([2200, 6826], [
    ['Stage', 'Meaning'],
    ['Information Governance', 'Managing data before any case'],
    ['Identification', 'Find who/where relevant data is (custodians)'],
    ['Preservation', 'Stop deletion – legal hold'],
    ['Collection', 'Copy data forensically (laptops, mail, phones)'],
    ['**Processing**', '**Your job:** extract text & metadata, dedup, filter, handle exceptions'],
    ['Review', 'Lawyers read & tag documents (Relativity, Everlaw)'],
    ['Analysis', 'Find patterns, people, timelines; AI / analytics'],
    ['Production', 'Deliver documents to other side (load files, Bates)'],
    ['Presentation', 'Use evidence in court'],
  ]),
  h2('Processing in Detail (= Your Daily Work)'),
  ...bl([
    '**Ingest** containers: PST, ZIP, forensic images',
    '**Expand** – pull emails & attachments out (parent–child families)',
    '**Extract** text + metadata (from, to, dates, author)',
    '**Hash** each file (MD5/SHA-1) → **de-duplicate**',
    '**De-NIST** – remove known system files (NIST list)',
    '**Email threading** – group a conversation (ModernETL focus)',
    '**OCR** – scanned images to text',
    '**Exceptions** – encrypted, corrupt, unsupported files → investigate & fix',
    '**QC** – counts & validation before pushing to review platform',
  ]),
  h2('Key Terms'),
  table([2400, 6626], [
    ['Term', 'Meaning'],
    ['Custodian', 'Person whose data is collected'],
    ['Chain of custody', 'Record proving data was never changed'],
    ['Metadata', 'Data about a file: author, dates, sender'],
    ['Family', 'Email + its attachments'],
    ['Load file (DAT)', 'Delimited file of metadata for import; uses special characters ¶ (020) and þ (254) – encoding matters!'],
    ['OPT', 'Image load file (page images)'],
    ['Bates number', 'Unique ID stamped on each produced page'],
    ['Privilege', 'Lawyer–client documents not to be produced'],
    ['TAR / AI review', 'Machine learning to rank relevant documents'],
    ['RelativityOne', 'Cloud review platform – Sandline uses it'],
    ['Nuix', 'High-volume processing engine'],
    ['Everlaw / NexLP / Cellebrite', 'Review / AI analytics / mobile forensics – Sandline uses them'],
  ]),
  h2('Your Bridge Sentences'),
  say('"eDiscovery processing looks like the EDI work I did at Acer – many formats come in, and clean, validated, traceable data goes out."'),
  say('"The append-only audit trail I built at AMG is the same idea as chain of custody – you must always prove the data was not changed."'),
  say('"In legal data, a dropped row is not a small bug – it could be missing evidence. That\'s why I always reconcile counts and never drop records silently."'),

  // ---------- PART 10 ----------
  h1('Part 10 – Know Sandline Global'),
  para('Source: sandlineglobal.com (home & About Us pages).'),
  h2('Key Facts'),
  ...bl([
    'Legal data, eDiscovery & forensics provider',
    'Independent, **founder-led** company',
    'Tagline: **"Find Your Flow"** – "escape the ups and downs of the quality rollercoaster"',
    'Mission: **"We obsess over quality, so you don\'t have to."**',
    'Motto: **"At Sandline, we own the outcome."**',
    'Covers the **entire EDRM**',
    '**5,000+** engagements · **12+ yrs** avg experience · **7 countries** · **30 min** avg response',
  ]),
  h2('Offices'),
  ...bl(['Washington D.C. (Falls Church, VA)', 'New York City', 'Frankfurt, Germany', 'Dubai, UAE', '**Taipei** – Xinyi District, near Taipei 101']),
  h2('Services'),
  ...bl(['Forensics & forensic investigations', 'eDiscovery & litigation support', 'Disputes, antitrust & investigations', 'Analytics & AI', 'Data privacy & information governance', 'Managed document review · Cyber breach review', 'Managed services · Document management']),
  h2('Technology'),
  ...bl(['**ModernETL 2.0 / 3.0** – their own ETL technology', 'ModernETL 2.0 "solves universal threading for all platforms and all users"', 'Tools: **RelativityOne**, Relativity on-premise, Everlaw, NexLP, Cellebrite', 'Job ad: Nuix, C#/.NET, MS SQL, PowerShell']),
  h2('Their Values → Your Proof'),
  table([3000, 6026], [
    ['Value', 'Your proof'],
    ['Culture of Accountability – own it, flag issues early', 'Owned IT/UAT release at Acer; Story 5'],
    ['Tenacious Problem Solvers – custom solutions', 'Story 1 – multi-format EDI; generic report loader'],
    ['Industry-Respected Experts – senior talent', '11 years, 8 senior; 13+ integrations'],
  ]),
  h2('Why Sandline? (Model Answer)'),
  say('"Three reasons. First, the work – complex, real data problems where precision matters, which is what I enjoy most. Second, the stack – C#, SQL Server and ETL are my strongest skills. Third, the culture – \'We obsess over quality\' and \'We own the outcome\' match how I work. I also noticed ModernETL on your website – building and improving ETL like that is exactly where I want to contribute."'),
  h2('Quick Research Still Worth Doing'),
  ...bl(['Our Team page: sandlineglobal.com/our-team/', 'Recent articles: AI classification in eDiscovery; encrypted MacBook case study', 'Gloria Liu & Sandline on LinkedIn']),

  // ---------- PART 11 ----------
  h1('Part 11 – Common Questions (Model Answers)'),
  h2('About You'),
  ...qa('Tell me about yourself.', 'Use the full self-introduction in Part 4.'),
  ...qa('What are your strengths?',
    '"Three: strong C# and SQL Server skills; patience and depth in investigating messy data problems; and ownership – I take features from requirements to release and make sure the data is correct."'),
  ...qa('What is your weakness?',
    '"I sometimes spend too long making a solution perfect. I now set a clear \'good enough\' standard with the team first, then improve later if needed." [Or your own honest example]'),
  ...qa('Where do you see yourself in 3–5 years?',
    '"As a senior technical expert in legal data processing – the person the team trusts with the hardest data problems, and maybe a Relativity-certified developer."'),

  h2('Technical (Concept Level)'),
  ...qa('How do you design an ETL pipeline?', 'Use the ETL design answer in Part 8.3.'),
  ...qa('How do you handle bad or corrupted data?',
    '"Never drop it silently. I quarantine bad records in an error table with the reason, investigate the root cause – format, encoding or source issue – fix the rule, and reprocess. Then counts must reconcile: input = loaded + rejected."'),
  ...qa('How do you make a slow query faster?', 'Use the 5-step tuning answer in Part 8.1.'),
  ...qa('How do you ensure 100% accuracy before delivery?',
    '"Automated validation scripts: row counts source vs target, hash comparisons, required-field checks, and spot checks on samples. Nothing moves to the next stage until the numbers match – like the UAT gate I owned at Acer."'),
  ...qa('When do you use SSIS and when do you write C#?',
    '"SSIS is great for standard, repeatable data flows and is quick to build. I use C# when parsing is complex, the format is unusual, or I need APIs or custom logic – like the multi-format EDI work."'),
  ...qa('How would you fix an encoding problem?', '"Find the source encoding – UTF-8, UTF-16 or Big5 – read it with the correct encoding in C#, store it in NVARCHAR, and add a check that flags replacement characters so it never passes silently."'),
  ...qa('How do you debug an unknown exception?', 'Use the debugging answer in Part 8.7.'),

  h2('Working Style'),
  ...qa('How do you work without supervision?',
    '"I clarify the goal and deadline, break the work into steps, check my own output, and update stakeholders before they need to ask. At Acer and AMG I owned features end to end."'),
  ...qa('Tell me about working under pressure.', 'Use Story 5.'),
  ...qa('How do you explain a technical issue to a non-technical person?',
    '"Impact first, then cause in simple words, then the fix and the timeline. For example: \'200 documents were not loaded because of a file format problem; I\'ve fixed the rule and they\'ll be ready by 5 PM.\'"'),
  ...qa('How do you work in a remote team?',
    '"Clear written updates, Teams for quick questions, documenting decisions, and being reachable. I\'ve worked with distributed teams over Teams, Slack and Azure Boards."'),

  // ---------- PART 12 ----------
  h1('Part 12 – Questions to Ask Gloria'),
  para('Ask **3–4** at the end. Best first:'),
  ...bl([
    'What does a typical week look like for this role?',
    'What are the most common data problems the team faces?',
    'How does this role work with ModernETL?',
    'Which tools are used most – RelativityOne, Nuix, or in-house?',
    'What is a typical data volume per matter?',
    'Who would I work with most – the Taipei team or global squads?',
    'What would success look like in the first 3 months?',
    'What are the next interview stages and timeline?',
  ]),
  h2('Avoid in Round 1'),
  ...bl(['Leave days, bonus details, raises', 'Working hours (unless they raise it)', 'Anything already on the website']),

  // ---------- PART 13 ----------
  h1('Part 13 – Countdown Plan & Interview-Day Checklist'),
  table([1700, 7326], [
    ['Day', 'Do this'],
    ['**Thu 8 Oct**', 'Read Parts 1–3 · Fill all red placeholders (Appendix A)'],
    ['**Fri 9 Oct**', 'Practise self-intro (Part 4) ×5 · Prepare Stories 1, 2, 3'],
    ['**Sat 10 Oct**', 'Stories 4–7 · Part 6 answers aloud · Learn Part 9'],
    ['**Sun 11 Oct**', 'Mock interview (friend / AI, audio only) · Revise Part 8 · Test Teams'],
    ['**Mon 12 Oct**', 'Read Part 1 only · Setup by 1:30 · Join at 1:55'],
  ]),
  h2('Tech Setup (by 1:30 PM)'),
  ...[
    'Teams updated & signed in; invite link opened once',
    'Headset/mic tested via Teams test call',
    'Laptop charged + plugged in',
    'Internet stable; phone hotspot ready as backup',
    'Notifications off; other apps closed',
    'Quiet room; others informed',
  ].map(check),
  h2('On Your Screen / Desk'),
  ...['This guide – Part 1 open', 'Your resume PDF', 'Appendix A numbers', 'Part 12 questions', 'Pen, paper, water', 'Gloria\'s email in case of tech issues'].map(check),
  h2('During the Call'),
  ...[
    'Join at **1:55 PM**',
    'Open: "Hi Gloria, thank you for making time today."',
    'Answers 1–2 minutes, then stop',
    'Ask to repeat if audio unclear – that\'s fine',
    'Use numbers & examples',
    'Mute when not talking if there is noise',
    'Don\'t type loudly while Gloria speaks',
    'Take notes of names & points mentioned',
  ].map(check),

  // ---------- PART 14 ----------
  h1('Part 14 – Closing & Follow-Up'),
  h2('Your Closing Statement'),
  say('"Thank you, Gloria. From our conversation I\'m even more interested. This role combines what I do best – C#, SQL Server and solving complex data problems – with a company that truly cares about quality. I\'d be glad to move to the next step. Could you share what the next stages look like?"'),
  h2('Thank-You Message (Same Day, 104 or Email)'),
  box('Subject: Thank you – Senior Backend Data Engineer interview'),
  ...['Hi Gloria,', 'Thank you for your time today. I enjoyed learning about [a topic discussed] and the data challenges your team solves.', 'The role is a strong match for my experience with SSIS pipelines, SQL Server and multi-format data integration at Acer, and I am excited about the opportunity to contribute to Sandline.', 'I look forward to hearing about the next steps.', 'Best regards,', 'Divakar Upadhyay'].map(t => box(t)),
  h2('After the Call'),
  ...bl(['Write down every question asked', 'Note answers to improve', 'Round 2 is likely deeper technical – continue the 6-week preparation plan doc', 'If no reply in 5 working days, send a polite follow-up']),

  // ---------- APPENDIX ----------
  h1('Appendix A – Fill-In Numbers Worksheet'),
  para('Fill this table before Sunday. Numbers make your answers believable.'),
  table([5000, 4026], [
    ['Question', 'Your answer'],
    ['Number of EDI formats / message types at Acer', '[ ]'],
    ['EDI records or shipments per day', '[ ]'],
    ['Number of SSIS packages built', '[ ]'],
    ['Number of SSRS reports built', '[ ]'],
    ['Time saved by automation (hrs/week)', '[ ]'],
    ['Languages in i18n rollout', '[ ]'],
    ['Largest table / dataset size you handled', '[ ]'],
    ['Best query speed-up (before → after)', '[ ]'],
    ['Number of audit tables / triggers at AMG', '[ ]'],
    ['A production bug you fixed + time to fix', '[ ]'],
    ['PowerShell usage (any)', '[ ]'],
    ['Mandarin level / learning plan', '[ ]'],
    ['Reason for Nov 2021 – Mar 2022 gap', '[ ]'],
    ['AMG last working day (month / year)', '[ ]'],
    ['What you have done since then (study, projects)', '[ ]'],
    ['Reference person (former manager / colleague)', '[ ]'],
    ['Salary ask / minimum (TWD per month)', '150,000 ask · 140,000 minimum'],
  ]),

  h1('Appendix B – Suggested Resume Tweaks (for Next Applications)'),
  para('Not needed for Monday – Gloria already has your CV. Use for Round 2 or similar data roles:'),
  ...bl([
    'Title: "Senior Backend & Data Engineer (.NET / SQL Server)"',
    'Summary: say 11 years total, 8 senior',
    'Add numbers to Acer EDI & SSIS bullets',
    'Add a SQL tuning bullet (indexes, execution plans)',
    'Add PowerShell once you have used it',
    'Move Web3 / frontend details lower; data work higher',
    'Add "eDiscovery-ready: EDRM, load files, processing" after you study it',
  ]),
];

const doc = new Document({
  creator: 'Divakar Upadhyay',
  title: 'Round 1 Interview – Complete Prep Guide',
  styles: {
    default: { document: { run: { font: 'Calibri', size: 21 } } },
    paragraphStyles: [
      { id: 'Title', name: 'Title', basedOn: 'Normal', run: { size: 44, bold: true, color: ACCENT }, paragraph: { spacing: { after: 120 } } },
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 30, bold: true, color: ACCENT }, paragraph: { spacing: { before: 0, after: 160 }, outlineLevel: 0, keepNext: true } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 24, bold: true, color: SUB }, paragraph: { spacing: { before: 240, after: 80 }, outlineLevel: 1, keepNext: true } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 21, bold: true, color: '404040' }, paragraph: { spacing: { before: 120, after: 40 }, outlineLevel: 2, keepNext: true } },
    ],
  },
  numbering: { config: [
    { reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 540, hanging: 270 } } } }] },
    { reference: 'checks', levels: [{ level: 0, format: LevelFormat.BULLET, text: '☐', alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 540, hanging: 300 } }, run: { font: 'Segoe UI Symbol' } } }] },
  ] },
  sections: [{
    properties: { page: { margin: { top: 1200, bottom: 1200, left: 1440, right: 1440 } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
      new TextRun({ text: 'Round 1 Prep · Sandline Global · Page ', color: '808080', size: 18 }),
      new TextRun({ children: [PageNumber.CURRENT], color: '808080', size: 18 }),
    ] })] }) },
    children,
  }],
});

Packer.toBuffer(doc).then(b => { fs.writeFileSync(out, b); console.log('written', out); });
