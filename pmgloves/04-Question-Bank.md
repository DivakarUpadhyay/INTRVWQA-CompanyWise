# PM Gloves — Interview Question Bank (with how to answer)

Rules for every answer: **short definition → how I used it → result.** Keep answers to about 60–90 seconds. For project questions use **STAR** (Situation, Task, Action, Result) with numbers.

Priority: ★★★ almost certain · ★★ likely · ★ possible

---

## A. HR / Personal (Round 1, HR + supervisor)

**A1 ★★★ Introduce yourself.**
Use the 30-second pitch in 02-JD-Analysis.md. End with: "...and I hold a Gold Card, so I can start immediately."

**A2 ★★★ Why did you leave your last company?**
"The company ceased operations, so the decision wasn't mine. I used the time to strengthen my skills: I built a .NET 10 + Dapper + MSSQL manufacturing system and worked with automation and AI tools." Never criticise the old company.

**A3 ★★★ Why PM Gloves? Why this role?**
- A global manufacturer: 6 plants in 3 countries, 100+ markets, 3,000+ staff. Internal systems have real impact.
- The stack matches me exactly: C#, MVC, MSSQL, stored procedures, Dapper.
- I'm excited by the digital-transformation side (BPM, RPA, Power BI, n8n, Dify). I want to grow from developer into an automation and AI integrator.
- Stable industry: medical gloves are an essential product.

**A4 ★★★ What do you know about our company?**
"Founded in 1978 by eight chemical and machinery experts. Six factories in Taiwan, China and Vietnam, including Vietnam's largest glove plant. About 17 billion gloves a year in nitrile, PVC and TPE, PACER cleanroom gloves, and the Evolguard brand. You won Taipei's 新貿獎 for moving from OEM to your own brand and cross-border e-commerce."

**A5 ★★★ Expected salary?**
"As I shared with Martin, NT$85–95k a month, but I'm flexible depending on the whole package: bonus, profit sharing, and the growth path." (Full strategy in 03.)

**A6 ★★★ When can you start?** "Immediately."

**A7 ★★★ Do you need visa sponsorship?** "No. I hold a Taiwan Employment Gold Card: open work permit, no sponsorship, no paperwork for you."

**A8 ★★★ Will you stay long-term? Do you plan to live in Taiwan?**
"Yes. I chose Taiwan and got the Gold Card to build my career here, and I'm learning Mandarin. I want a company where I can grow for many years." (Turnover is a known concern there, so answer this strongly.)

**A9 ★★★ How is your Chinese? Can you read Chinese specs?**
Be honest: "My Mandarin is basic and I'm studying. Code, SQL and most technical terms are in English. For Chinese specs and forms I use translation tools and ask colleagues to confirm, and my Chinese improves every month. My English also helps with overseas plants and foreign vendors."

**A10 ★★ Strengths?** Fast learner on new tools, full-stack .NET + SQL, automation mindset, documentation.
**A11 ★★ Weakness?** "My Mandarin. I'm improving it daily." Or: "I used to over-polish code. Now I timebox and ship iteratively."
**A12 ★★ Where do you see yourself in 3–5 years?** "A senior or lead engineer owning internal platforms and automation (BPM, RPA, AI) for the group's plants."
**A13 ★★ How do you handle pressure or many urgent requests from different departments?** List them all, check impact and urgency with your supervisor, give each requester realistic dates, then deliver small pieces early.
**A14 ★★ Conflict with a colleague or manager?** STAR. Disagree with data, privately and politely; once the decision is made, commit to it. (They value aligning with management.)
**A15 ★★ A user keeps changing requirements?** Write the requirement down and confirm it, show a prototype or screenshot early, use change requests, deliver in iterations.
**A16 ★★ How do you learn a new tool quickly?** Official docs, a small proof of concept, then a real task. Example: learned Playwright or n8n in X days.
**A17 ★ Overtime OK?** "Yes when there's a go-live or an urgent issue. I also plan to avoid routine overtime."
**A18 ★ Teamwork or alone?** Both. Give an example of each.
**A19 ★ What did you do during your job gap?** Projects (FactoryOS, automation bots, AI tools), learning, job search.
**A20 ★ Hobbies?** Keep it short and positive.
**A21 ★ Why should we hire you over other candidates?** "8+ years on your exact stack, built manufacturing and automation systems, AI/LLM experience, English, and an immediate start with no visa cost."

---

## B. Project deep-dive (most important: reviews say round 1 is mostly about past work)

Prepare **3 stories** in this structure: business problem → architecture → your role → hardest problem → result in numbers.
1. A web MVC + MSSQL business system (forms, approvals, reports).
2. A data or automation project (ETL, bot, scheduled job, integration).
3. FactoryOS: a manufacturing system (production orders, quality, plants, row-level security), which maps directly to a glove maker.

**B1 ★★★ Describe your most recent / most complex project.**
**B2 ★★★ What was your role? Team size? Which parts did you build?**
**B3 ★★★ Draw the architecture.** Browser (Razor + jQuery) → Controller → Service → Repository (Dapper) → stored procedures / SQL Server. Plus logging, auth, background jobs.
**B4 ★★★ Hardest bug you solved?** E.g. a deadlock, slow query, memory leak or concurrency issue. Cover how you found it (logs, SQL Profiler, execution plan) and how you fixed it.
**B5 ★★ How did you improve performance?** Indexes, avoiding N+1, paging in SQL, caching, async.
**B6 ★★ How did you deploy?** IIS, publish profile, appsettings per environment, CI/CD, rollback.
**B7 ★★ How did you ensure quality?** Code review, unit tests (xUnit), testing in a test environment first, Git PRs.
**B8 ★★ Have you worked on manufacturing / ERP / internal systems?** Yes. Use FactoryOS: work orders, BOM, QC, multiple plants, dashboards.
**B9 ★ What would you do differently?**

---

## C. C# & OOP (JD: generics, inheritance, OOP)

**C1 ★★★ Four pillars of OOP?** Encapsulation (hide state behind members), Inheritance (reuse an is-a relationship), Polymorphism (virtual/override, interfaces), Abstraction (abstract classes and interfaces expose what, not how).
**C2 ★★★ Abstract class vs interface?** An abstract class can hold state, constructors and partial implementation, and a class can inherit only one. Interfaces define a contract; a class can implement many; C# 8+ allows default methods. Use an abstract class for a shared base (e.g. `BaseRepository`), interfaces for DI (`IOrderService`).
**C3 ★★★ What are generics? Why use them?** Type-safe reusable code with no boxing. `List<T>`, `Repository<T>`, `Result<T>`.
**C4 ★★★ Generic constraints?** `where T : class`, `struct`, `new()`, `BaseEntity`, `IComparable<T>`, `notnull`, `unmanaged`. Example: `class Repo<T> where T : BaseEntity, new()`.
**C5 ★★ Covariance / contravariance?** `out T` (an `IEnumerable<Derived>` can be used as an `IEnumerable<Base>`), `in T` (an `Action<Base>` can be used as an `Action<Derived>`).
**C6 ★★★ virtual / override / new / sealed?** `override` gives runtime polymorphism; `new` hides the base member (it's chosen by the variable's declared type); `sealed` stops further overriding.
**C7 ★★★ Method overloading vs overriding?** Compile time (different signatures) vs runtime (virtual).
**C8 ★★★ Value type vs reference type; stack vs heap; boxing?** struct/int vs class/string; boxing wraps a value type in an object (costly).
**C9 ★★ string vs StringBuilder?** Strings are immutable; use StringBuilder in loops.
**C10 ★★★ ref / out / in?** ref: must be initialised before the call, can be modified. out: must be assigned inside the method. in: read-only reference.
**C11 ★★ const vs readonly vs static readonly?** const is compile-time; readonly is set in the constructor; static readonly is one value per type, set at runtime.
**C12 ★★ Access modifiers?** public, private, protected, internal, protected internal, private protected.
**C13 ★★★ Delegates, Func/Action/Predicate, events?** Delegate = type-safe function pointer. Events = publisher/subscriber with restricted invoke.
**C14 ★★★ LINQ: deferred execution; IEnumerable vs IQueryable?** IQueryable translates to SQL on the server; IEnumerable runs in memory. Call `ToList()` to execute.
**C15 ★★ First vs FirstOrDefault vs Single?** First throws if empty; FirstOrDefault returns default; Single throws if more than one.
**C16 ★★★ async/await? Task vs Thread? Why not `.Result`?** Frees the thread while waiting on I/O. `.Result` and `.Wait()` can deadlock and block thread-pool threads. Use `ConfigureAwait(false)` in libraries.
**C17 ★★ Exception handling best practice?** Catch specific exceptions; use `throw;` not `throw ex;` (keeps the stack trace); global handler middleware; log with context.
**C18 ★★ IDisposable / using / GC?** Release unmanaged resources (DB connections, files). The GC has generations 0/1/2; a finalizer is a last resort.
**C19 ★★ Extension methods?** Static method in a static class with `this T`.
**C20 ★★ Nullable reference types, `?.`, `??`, `??=`.**
**C21 ★★ record vs class vs struct?** record = value equality, immutable by default, good for DTOs.
**C22 ★ Pattern matching, switch expressions, tuples.**
**C23 ★★ SOLID? Give an example of each.** S: OrderService doesn't send email. O: add a new payment type via an interface. L: a subtype can replace its base. I: small interfaces. D: depend on IRepository.
**C24 ★★ Design patterns you used?** Repository, Unit of Work, Factory, Strategy (e.g. different approval rules), Singleton (via DI), Observer, Decorator (caching repository).
**C25 ★★ Thread safety?** `lock`, `ConcurrentDictionary`, `Interlocked`, `SemaphoreSlim` for async code.
**C26 ★ .NET Framework vs .NET Core/.NET 8+?** Cross-platform, faster, built-in DI, Kestrel, side-by-side versions. Web Forms exists only on .NET Framework.

**Coding (on paper) ★★**
- Reverse a string; check palindrome; count duplicate characters with a Dictionary.
- FizzBuzz; find the second-largest number; remove duplicates from a list (LINQ `Distinct`, `GroupBy`).
- Write a generic `Repository<T>` interface.
- Write a class hierarchy: `Glove` → `NitrileGlove`, `VinylGlove` with an overridden `GetMaterialInfo()`.

---

## D. ASP.NET Core MVC

**D1 ★★★ Explain the MVC flow.** Request → middleware → routing → controller action (model binding, validation) → returns ViewResult or JSON → Razor view renders.
**D2 ★★★ Middleware? Order?** Exception handler → HSTS/HTTPS → static files → routing → CORS → authentication → authorization → endpoints. Custom middleware: `app.Use(async (ctx, next) => …)`.
**D3 ★★★ Dependency injection lifetimes?** Transient (new every time), Scoped (one per request; use for DbConnection/services), Singleton (one for the app). Don't inject Scoped into a Singleton.
**D4 ★★★ Filters?** Authorization, Resource, Action, Exception, Result. Use for logging, auditing, validation, global exception handling.
**D5 ★★★ Model binding and validation?** `[FromBody]`, `[FromQuery]`, `[FromForm]`. DataAnnotations (`[Required]`, `[StringLength]`), `ModelState.IsValid`, client-side jQuery unobtrusive validation.
**D6 ★★ ViewData vs ViewBag vs TempData vs strongly typed model?** TempData survives one redirect (PRG pattern).
**D7 ★★ Partial view vs View Component vs Layout vs Tag Helper.**
**D8 ★★★ Authentication vs authorization?** Cookie authentication for an internal site; maybe Windows/AD auth for internal systems. `[Authorize(Roles="QA")]`, policies.
**D9 ★★★ CSRF? XSS? SQL injection?** `[ValidateAntiForgeryToken]` (send the token in jQuery AJAX headers); Razor encodes output by default; always parameterise queries (Dapper parameters).
**D10 ★★ Routing: conventional vs attribute.**
**D11 ★★ appsettings.json, environments, Options pattern (`IOptions<T>`), secrets.**
**D12 ★★ Logging?** ILogger, Serilog/NLog to file or DB, correlation ID.
**D13 ★★ File upload/download, export to Excel (EPPlus/ClosedXML/NPOI).** Very common in internal systems.
**D14 ★★ Return JSON for AJAX: `return Json(data)` / `Ok()`; Web API controller vs MVC controller.**
**D15 ★★ Session/Cache?** IMemoryCache, distributed cache; session for small data only.
**D16 ★ Hosting on IIS (ASP.NET Core Module), app pool, publish.**
**D17 ★ Background jobs?** Hangfire, `IHostedService`, Windows Task Scheduler.

## E. Web Forms (legacy: "some experience")

**E1 ★★ Page life cycle?** PreInit → Init → Load (ViewState loaded) → Control events (postback) → PreRender → SaveViewState → Render → Unload.
**E2 ★★ ViewState? Its downside?** Hidden field that stores control state; makes pages heavy. Disable it where you don't need it.
**E3 ★★ PostBack and `IsPostBack`.**
**E4 ★ GridView paging/editing, UpdatePanel, user controls (.ascx), master pages.**
**E5 ★★ How would you migrate Web Forms to .NET Core MVC?** Move logic into service/class libraries first; rebuild page by page (strangler pattern); share the DB and SPs; keep the same login via cookies or SSO.
**E6 ★ Web Forms vs MVC?** Event-driven with ViewState vs separation of concerns, testable, full control of HTML.

## F. MS SQL Server & Stored Procedures (★★★ area)

**F1 ★★★ Write an SP with parameters, TRY/CATCH and a transaction.**
```sql
CREATE PROCEDURE dbo.usp_CreateOrder @CustomerId INT, @Qty INT, @OrderId INT OUTPUT
AS
BEGIN
  SET NOCOUNT ON;
  BEGIN TRY
    BEGIN TRAN;
      INSERT INTO dbo.Orders(CustomerId, Qty, CreatedAt) VALUES(@CustomerId, @Qty, SYSDATETIME());
      SET @OrderId = SCOPE_IDENTITY();
      UPDATE dbo.Stock SET Qty = Qty - @Qty WHERE ProductId = 1;
    COMMIT;
  END TRY
  BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK;
    THROW;
  END CATCH
END
```
**F2 ★★★ SP vs function vs view?** An SP can change data and return several result sets, but can't be used inside a SELECT. A scalar or table-valued function can be used in queries but has no side effects. A view is a saved SELECT.
**F3 ★★★ Clustered vs non-clustered index? Covering index (INCLUDE)? When do indexes hurt?** They slow writes and take storage.
**F4 ★★★ JOIN types; find records with no match (LEFT JOIN … IS NULL / NOT EXISTS).**
**F5 ★★★ Second-highest salary; top N per group (ROW_NUMBER() OVER (PARTITION BY …)).**
**F6 ★★ Find and delete duplicates (CTE + ROW_NUMBER).**
**F7 ★★ WHERE vs HAVING; GROUP BY; aggregates.**
**F8 ★★ Temp table vs table variable vs CTE.**
**F9 ★★★ How do you tune a slow query?** Execution plan (scans, key lookups), missing indexes, SARGable predicates (no functions on columns), statistics, parameter sniffing (`OPTION(RECOMPILE)`, OPTIMIZE FOR), avoid SELECT *, paginate with `OFFSET/FETCH`.
**F10 ★★ Transactions, ACID, isolation levels; NOLOCK risks (dirty reads); deadlock handling.**
**F11 ★★ DELETE vs TRUNCATE vs DROP.**
**F12 ★★ Triggers: pros and cons; audit trail alternatives (temporal tables, audit columns).**
**F13 ★★ Table-valued parameters (bulk insert from C#), SqlBulkCopy, MERGE.**
**F14 ★ SQL Agent jobs; SSIS for SAP → SQL data import** (you know DTExec).
**F15 ★★ Design tables for "glove production orders" or "e-form approval".** Orders(Id, PlantId, ProductId, Qty, Status, DueDate), ApprovalFlow(FormId, Step, ApproverId, Action, ActionAt). Normalise to 3NF, add indexes on FK and status columns.
**F16 ★ Normalisation 1NF/2NF/3NF; when to denormalise (reporting).**

## G. Dapper & ORM (★★★: your strong point, so say so)

**G1 ★★★ What is Dapper? Dapper vs Entity Framework?** A micro-ORM: extension methods on IDbConnection that map SQL results to objects. Fast, full SQL control, works well with SPs. EF is a full ORM with change tracking, LINQ, migrations; more productive for CRUD but less control. "I use Dapper for SP-heavy, performance-critical and reporting work, and EF Core for simple CRUD, admin pages and migrations. I built FactoryOS fully on Dapper + MSSQL."
**G2 ★★★ Call an SP with Dapper, with input/output parameters.**
```csharp
var p = new DynamicParameters();
p.Add("@CustomerId", customerId);
p.Add("@Qty", qty);
p.Add("@OrderId", dbType: DbType.Int32, direction: ParameterDirection.Output);
await conn.ExecuteAsync("dbo.usp_CreateOrder", p, commandType: CommandType.StoredProcedure);
int id = p.Get<int>("@OrderId");
```
**G3 ★★★ Query vs QueryFirstOrDefault vs Execute vs ExecuteScalar vs QueryMultiple.**
**G4 ★★ Multi-mapping (one-to-many) with `splitOn`.**
**G5 ★★★ Transactions in Dapper:** `using var tx = conn.BeginTransaction(); conn.Execute(sql, param, tx); tx.Commit();`
**G6 ★★★ How does Dapper prevent SQL injection?** Parameterised queries (`@param`); never concatenate strings.
**G7 ★★ Connection management?** `using var conn = new SqlConnection(cs)`. Connection pooling is automatic. Register a factory in DI.
**G8 ★★ Repository pattern with Dapper + generic base repository.**
**G9 ★★ EF Core: tracking vs AsNoTracking, migrations, lazy vs eager loading (Include), N+1 problem.**
**G10 ★ Bulk operations with Dapper (TVP, SqlBulkCopy, Dapper.Contrib/Plus).**

## H. jQuery / JavaScript / front end

**H1 ★★★ `$(document).ready`; selectors; event delegation `$(document).on('click', '.btn', fn)` (why? it works for elements added dynamically).**
**H2 ★★★ AJAX call to an MVC action with the anti-forgery token.**
```js
$.ajax({ url: '/Order/Save', type: 'POST', data: $('#form').serialize(),
  headers: { 'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val() } })
 .done(r => alert('Saved')).fail(x => console.error(x.responseText));
```
**H3 ★★ `.val()`, `.text()`, `.html()`, `.attr()` vs `.prop()`, show/hide, `each`.**
**H4 ★★ DataTables / Select2 / jQuery Validation (unobtrusive).**
**H5 ★★ JavaScript: `var`/`let`/`const`, `==` vs `===`, closures, promises, async/await, JSON.**
**H6 ★ Bootstrap grid and responsive layout; minimal CSS.**
**H7 ★ Why do companies still use jQuery? Would you use Vue/React?** Legacy and simple pages; for complex SPAs, propose Vue or React gradually.

## I. Git

**I1 ★★★ Your daily Git workflow?** Pull → feature branch → commit small → push → PR/review → merge.
**I2 ★★★ merge vs rebase?**
**I3 ★★★ Resolve a merge conflict.**
**I4 ★★ reset vs revert (never reset a shared branch); stash; cherry-pick; tag a release.**
**I5 ★★ Branching strategy (Git Flow / trunk-based); .gitignore (bin/obj, appsettings secrets).**
**I6 ★ GitLab/GitHub/Azure DevOps; CI pipelines.**

## J. BPM / e-forms (BorG BPM, "Brog" in the JD)

**J1 ★★ What is BPM? E-form approval flow?** Digitising paper forms with routing rules: applicant → manager → department head → finance, with conditions (amount > X goes to the GM).
**J2 ★★ Approval concepts:** 會簽 (parallel countersign), 加簽 (add an approver), 退回 (send back), 代理人 (delegate when on leave), 撤回 (withdraw), 知會 (notify only), timeouts and reminders.
**J3 ★★ How would you design an approval engine in .NET + SQL?** Tables: FormDefinition, FlowDefinition(steps, conditions), FormInstance, ApprovalTask, ApprovalHistory. A state machine for status. Email/Teams notifications. An audit trail (needed for ISO 13485).
**J4 ★★ Integrate the BPM with SAP or another system?** When the form is approved: call an API, write to a staging table, or trigger RPA/n8n to post into SAP.
**J5 ★ Have you used a BPM product?** If not: "Not BorG specifically, but I've built approval workflows in C#/SQL. These products are usually configured with forms + JavaScript/C# script + SQL, so I can pick it up quickly."

## K. RPA — Automation 360 (Automation Anywhere)

**K1 ★★ What is RPA? When to use it vs an API?** Software bots mimic UI actions on systems with no API (SAP GUI, legacy apps, websites). Prefer an API or DB integration when one exists; RPA is fragile when the UI changes.
**K2 ★★ A360 components:** Control Room (web, cloud), Bot Agent on the machine, Bot Creator, Task Bot, attended vs unattended bots, Credential Vault, scheduling, packages (Excel, Email, Browser, SAP), variables, loops, error handling (Try/Catch), IQ Bot / Document Automation for invoices.
**K3 ★★ What would you automate at a glove manufacturer?** Downloading bank or customs files, entering sales orders or POs into SAP, daily report emails, checking shipment tracking, Excel consolidation from 6 plants.
**K4 ★ How do you make bots reliable?** Robust selectors, waits, retries, logging, alerting on failure, a separate service account, keeping credentials in the vault.
**K5 ★ Have you built automation?** Yes: Playwright/Selenium browser automation (e.g. job-application bots, scrapers), scheduled jobs, and .NET console automation.

## L. Power BI

**L1 ★★ Import vs DirectQuery vs Live connection.**
**L2 ★★ Data model: star schema (fact Sales/Production, dimension Date/Product/Plant/Customer).**
**L3 ★★ DAX basics:** measures vs calculated columns, `CALCULATE`, `SUM`, `DIVIDE`, `FILTER`, time intelligence (`TOTALYTD`, `SAMEPERIODLASTYEAR`).
**L4 ★★ Power Query (M) for cleaning; scheduled refresh; on-premises data gateway for SQL Server.**
**L5 ★★ Row-level security (each plant manager sees only their plant).**
**L6 ★ Embedding Power BI in an MVC web app (Power BI Embedded, an embed token through the REST API).**
**L7 ★★ KPIs for a glove plant:** output per line, yield / defect rate (pinholes, AQL failure), OEE, on-time delivery, inventory days, sales by region and customer, raw material cost (NBR latex, PVC).
**L8 ★ Optimise slow reports:** fewer visuals, aggregate in SQL views, avoid bidirectional relationships.

## M. n8n

**M1 ★★ What is n8n?** Open-source, self-hostable (Docker) workflow automation. Triggers (webhook, cron, email), nodes (HTTP Request, SQL Server, Code/JS, IF, Merge), credentials, error workflows.
**M2 ★★ n8n vs RPA vs custom C#?** n8n for API-to-API glue and quick integrations; RPA for UI-only systems; C# for core business logic and anything complex or high-volume.
**M3 ★★ Example flow:** BPM form approved → webhook → n8n → insert into SQL / call SAP API → send a Teams/email notice → log the result.
**M4 ★ Security:** self-hosted inside the company network, credential encryption, webhook auth, version control (export the JSON to Git).
**M5 ★ n8n + AI:** an n8n AI Agent node calling an LLM or Dify.

## N. Dify / AI / LLM

**N1 ★★ What is Dify?** Open-source LLM app platform: chatbots, agents, workflows, knowledge bases (RAG), prompt management. Self-host on Docker, connect to OpenAI/Claude/Azure/local models, expose apps via API.
**N2 ★★★ What is RAG?** Split documents into chunks → create embeddings → store in a vector DB → find the top chunks for a question → put them in the prompt → the LLM answers with sources. Reduces hallucination and works on private documents.
**N3 ★★ Use cases at PM Gloves:** a chatbot over SOPs, ISO 13485 and FDA documents and product spec sheets; an HR/IT helpdesk bot; drafting customer replies or quotations; summarising QC reports; text-to-SQL on the sales DB (read-only).
**N4 ★★ Call a Dify app from C#:** `HttpClient` POST `/v1/chat-messages` with Bearer API key, `inputs`, `query`, `user`, and streaming or blocking response mode.
**N5 ★★ Risks:** data leaks (self-host, choose the model carefully), hallucination (RAG + citations), prompt injection, cost, access control.
**N6 ★ Prompt engineering basics; tokens; temperature; embeddings; fine-tuning vs RAG.**
**N7 ★ Your AI experience:** mention the AI/LLM features you've built (e.g. bots and tools using LLM APIs).

## O. System design / scenarios (Senior level)

**O1 ★★★ Design an internal system for <sample requests / complaints / quality deviations>.** Requirements → roles → DB tables → screens (list, form, detail, approval) → SPs → reports → notifications → audit log.
**O2 ★★ Users in Vietnam say the system is slow, but Taipei is fine. Why?** Network latency/WAN, large page payloads (ViewState!), no CDN or compression, chatty AJAX, DB in Taipei. Fix: compress, bundle, paginate, cache, reduce round trips, maybe a regional deployment.
**O3 ★★ The production DB has a slow page at 9 am every day.** Check SQL Agent jobs, blocking (`sp_who2`, `sys.dm_exec_requests`), parameter sniffing, missing index, report queries running against OLTP. Move reports to a replica or Power BI.
**O4 ★★ How do you integrate with SAP?** Options: SAP RFC/BAPI (SAP .NET Connector NCo), OData/REST from SAP Gateway, IDoc, flat-file export, SQL staging plus a scheduled job, RPA as a last resort.
**O5 ★★ Multilingual internal system (中文/English/Tiếng Việt).** Resource files (.resx), `IStringLocalizer`, culture from user settings, Unicode `NVARCHAR`.
**O6 ★★ Multiple plants: one DB or many?** A PlantId column with row-level filtering (you did RLS in FactoryOS) vs a DB per plant. Discuss trade-offs.
**O7 ★★ The system crashed in production. What do you do?** Communicate → check logs → roll back if needed → root cause → fix → post-mortem → prevent it happening again.
**O8 ★ How do you write documentation the team can edit?** README in Git, wiki/Confluence/Notion, architecture diagram, API list, SP list, deployment steps, FAQ.
**O9 ★ Code review checklist?** Correctness, security (SQL injection, auth), naming, error handling, performance, tests.
**O10 ★ Logging & monitoring for internal apps; health checks.**

## P. Industry & business (shows interest)

**P1 ★★ What do you know about the disposable glove market?** Boomed in COVID, then oversupply and a price war (Malaysian makers such as Top Glove and Hartalega, and Chinese makers). Now the competition is on cost, quality and certification, and on moving to own brands, e-commerce and specialties (cleanroom, chemo-rated, bio-based). PM Gloves fits this with PACER, Evolguard and Bio-Mass.
**P2 ★ Nitrile vs vinyl vs latex?** Nitrile (NBR): strong, chemical-resistant, no latex allergy. Vinyl (PVC): cheap, loose fit, food and light tasks. Latex: elastic, allergy risk. TPE: low-cost food service.
**P3 ★ Quality standards:** AQL (pinhole test), ASTM D6319 / D5250, EN 455 / EN 374, FDA 510(k), ISO 13485. IT systems need **traceability** (lot numbers) and **audit trails**.
**P4 ★ How can IT help a glove manufacturer?** Automate order-to-cash and approvals, real-time production and quality dashboards, lot traceability, AI document search, less manual Excel work across plants.

---

## Q. Questions YOU ask at the end (always ask 3–4)
1. What does the IT team look like (size, roles), and who would I report to?
2. What are the first projects I'd work on in the first 3 months?
3. What's the ratio of new MVC development to maintaining existing Web Forms systems?
4. How are BPM, RPA and Dify used today? Is AI a company priority?
5. How do you integrate with SAP today?
6. Is documentation and team communication in Chinese or English? (Shows awareness.)
7. What does success look like at the end of probation?
8. What are the next steps in the process?
(Ask about bonus or profit sharing only when they raise salary, or in the final round.)

## R. Useful Mandarin phrases
- 大家好，我叫 Divakar，我有八年以上的 C# .NET 開發經驗。 (Hello, I'm Divakar, with 8+ years of C# .NET development experience.)
- 我的中文還在學習中，可以用英文面試嗎？ (I'm still learning Chinese. Could we do the interview in English?)
- 我有就業金卡，不需要公司申請工作簽證，可以馬上上班。 (I have a Gold Card, so you don't need to apply for a work visa, and I can start right away.)
- 謝謝您的時間，期待與您共事。 (Thank you for your time. I look forward to working with you.)

## Final checklist (day before)
- [ ] Re-read 01 (company facts) and 02 (pitch)
- [ ] Rehearse A1–A9 and 3 project stories aloud
- [ ] Hand-write one SP (F1), one Dapper SP call (G2), one jQuery AJAX (H2), one ROW_NUMBER query (F5)
- [ ] Watch a 10-min intro to each of Automation 360, n8n and Dify
- [ ] Have FactoryOS / GitHub ready to show on screen (if online)
- [ ] Bring a printed resume, your Gold Card and an ID. Arrive 10 min early (西湖 station, 內湖路一段68號2樓)
