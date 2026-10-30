# Full Mock Interview – with Model Answers

**How to use:** cover the answer, say yours aloud (time it), then compare. Don't memorise the model answers word for word. Keep the structure and the key facts. `[ ]` marks a detail you should replace with your real one.

Answer length: 1–2 minutes for stories, 30–60 seconds for facts.

---

## ROUND 1 – HR / Recruiter screen (≈30 min)

### Q1. Tell me about yourself.
**Model answer (≈90 s):**
"I'm Divakar, a senior software engineer with about 11 years on the Microsoft stack: C#, VB.NET, .NET Framework through .NET 8 and 10, and SQL Server.

For the last few years I've been in Taiwan. From 2022 to early 2025 I was on-site at Acer through Skywind, maintaining Acer's Contact Service System, which the repair centres and partners use all over Taiwan. A big part of that job was production support: finding why an EDI integration with FedEx or TNT failed on certain documents, fixing it, and owning the UAT and release cycle with Acer's PMs.

Most recently I was a senior engineer at AMG, building a .NET 8 platform until the company closed its operations in September. On my own time I built a smart-manufacturing platform in .NET 10 that talks to equipment over OPC UA, Modbus and MQTT and does SPC and OEE, because I like working close to hardware and factories.

This role combines what I'm strongest at, Windows, .NET and VB, and debugging production software, with the semiconductor industry I want to move into. That's why I applied."

### Q2. Why Teradyne?
"Three reasons. First, Teradyne is the market leader in semiconductor test, and nearly every chip from Taiwan's fabs and OSATs goes through a tester like UltraFLEX, so the work matters. Second, the stack matches me: IG-XL runs on Windows, Excel, VB and .NET, which is where I've spent my career. Third, I want to work closer to hardware. I built a manufacturing platform on my own to learn that domain, and Teradyne would let me do it professionally, including the robotics side with Universal Robots, which I find exciting."

### Q3. Why are you leaving / why are you available now?
"My last company, AMG, was a Web3 company. It closed its operations in September 2026 for regulatory and banking reasons outside the engineering team's control. So I'm available immediately, and I'm looking for a stable, long-term role in a strong engineering company."
*(Keep it short and neutral. Don't criticise the company.)*

### Q4. Do you need a visa or sponsorship?
"No. I hold a Taiwan Employment Gold Card, so I can work for any employer without sponsorship."

### Q5. Do you speak Mandarin?
"My Mandarin is basic. I'm learning, but my working language is English. At Acer I worked daily with Taiwanese PMs and engineers in English and written Chinese with translation tools, and it worked well. Could you tell me how much of the customer communication in this role is in Mandarin?"

### Q6. Are you OK with travel and customer sites?
"Yes. Visiting customer sites is often the fastest way to reproduce an issue, so I'm comfortable with travel in Taiwan, Asia and the US."

### Q7. Expected salary?
"Based on my experience and the market for senior engineers, I'm looking for around TWD 150k per month, depending on the full package: bonus, profit sharing and stock purchase. I'm flexible for the right role."

---

## ROUND 2 – Hiring manager (≈60 min)

### Q8. Walk me through a project that relates to this role.
**Model answer, Acer (STAR):**
- **Situation:** "Acer's Contact Service System is used by repair centres across Taiwan to log, track and ship repairs. I was the on-site senior engineer from 2022 to 2025."
- **Task:** "Keep it running and extend it, including shipping integrations with FedEx and TNT over EDI and a DHL payment gateway, plus a full localisation rollout."
- **Action:** "Most of the hard work was diagnosing failures in production. For example, some EDI shipments were rejected only for [certain partner formats]. I compared the raw EDI messages from logs against the spec, found that [a field / encoding / segment terminator] was produced differently for [those cases], fixed the generator, added validation before sending, and added a regression test with the real failing samples."
- **Result:** "Rejections for that format dropped to [near zero], and the repair centres stopped having to re-key shipments by hand. I also built SSRS reports so the business could see failures themselves instead of asking IT."
- **Link to the role:** "That's very similar to supporting a test-program environment: the customer's line is waiting, you need a reproduction, a root cause, and a fix that doesn't break anything else."

### Q9. Describe the hardest bug you've debugged.
**Model answer (structure: symptom → hypothesis → tools → root cause → fix → prevention):**
"A Windows service in production [at Skywind/Acer or your real case] would stop processing after a few days, but CPU was idle and nothing was in the logs.
- I captured a **hang dump** with ProcDump (`procdump -ma <pid>`) while it was stuck.
- In **WinDbg** I loaded SOS, ran `!threads` and `~*e !clrstack`, and saw that the worker threads were all blocked waiting on the same lock, while one thread was blocked on a synchronous `.Result` call to an async HTTP method.
- Root cause: a **sync-over-async deadlock** plus a lock held across the network call. When the remote API was slow, everything piled up behind it.
- Fix: made the call path async end to end, removed the lock around I/O, and added a timeout and a cancellation token.
- Prevention: added a health-check endpoint and an alert if the queue stopped draining for 5 minutes.
It took [2 days]. The lesson for me: when there are no errors, take a dump. Don't guess."

### Q10. How do you approach a customer issue you can't reproduce?
"1. **Collect everything first**: exact software version, OS, configuration, logs, Event Viewer entries, the input or test program if allowed, and the exact steps and timing.
2. **Ask the customer to capture data at the moment of failure**: a ProcDump with `-e` for crashes, or DebugDiag crash/hang rules, Process Monitor traces for file or registry problems, and a datalog.
3. **Compare environments**: what is different between their setup and mine? Version, 32/64-bit, regional settings, permissions, antivirus, add-ins, data size.
4. **Build a minimal reproduction** by narrowing down: remove half of the inputs until it fails or stops failing.
5. Keep the customer updated on what I know, what I'm trying next and when I'll update them, even if there's no fix yet."

### Q11. How strong is your Excel and VB?
"Strong. I've written VB.NET in production for years, at Tecogis for the IGI diamond-grading lab system and at Acer where part of the code base was VB.NET. In Excel I'm comfortable with VBA macros: working with ranges and arrays, dictionaries, events, and error handling. I've also automated report generation and data cleanup. I haven't written IG-XL VBT yet, but I understand it's VBA inside the test-program workbook, calling the IG-XL object model (`TheExec`, `TheHdw`) to drive instruments and judge limits. Coming from VB.NET, that's a short learning curve."

### Q12. What do you know about IG-XL and our testers?
"IG-XL is the Windows-based software environment for Teradyne's UltraFLEX, UltraFLEXplus, J750 and IntegraFLEX testers. A test program is an Excel workbook with sheets that describe the device and the test: the **pin map** and **channel map** connect device pins to tester channels; **DC/AC specs, pin levels and time sets** define voltages and timing; **test instances** say which template runs with which parameters; and the **flow table** decides the order of tests and the binning. The test logic is written in **VBT**, Visual Basic for Test, and newer versions also support .NET. Programs usually run **multi-site**, testing several devices in parallel, and the results go into datalogs, often STDF, that are used for yield analysis. I'd expect most issues I'd support to be in that layer: a test program behaving differently than expected, a crash or hang of the environment, or performance."

### Q13. Have you used ClearCase?
"Not in production. I use Git every day: GitHub, Azure DevOps, branching, pull requests, rebasing, resolving conflicts, and CI with GitHub Actions. I know ClearCase's model: VOBs as repositories, views (snapshot or dynamic) defined by a config spec, explicit checkout/checkin per file, and in UCM, streams and activities instead of branches. The concepts map onto Git, so I'd be productive quickly."

### Q14. How do you prioritise when several customers have issues at once?
"By impact first: a line-down issue, where production has stopped, beats everything. Then by number of systems affected, then by deadline. I'd make the priority visible to my manager and the customers, so nobody is surprised. While waiting on one customer for data, I work on the next issue."

### Q15. Tell me about a time you disagreed with a colleague or manager.
"At [Acer], a PM wanted to push a release with a known edge-case bug in the EDI generator because the date was fixed. I didn't just say no. I showed the data: how many shipments per week would hit that case, and the manual work for repair centres if they did. We agreed on a compromise: release on time with that one document type temporarily switched to the old path, then a patch a week later. The release went out, and nobody had to re-key shipments."

### Q16. What's your biggest weakness?
"I haven't worked on ATE or semiconductor test yet, so I have domain knowledge to build. I'm handling it actively. I've already studied how IG-XL test programs are structured and how testers work, and I learn domains fast: diamond grading, logistics EDI, healthcare APIs and smart manufacturing all came up in my career, and each time I became the person others asked within a few months."

---

## ROUND 3 – Technical panel (2–2.5 hrs, 2–3 engineers)

### Part A – C# / OOP

#### Q17. Explain the four OOP principles with an example from your work.
"**Encapsulation**: hide state behind methods. In FactoryOS, a `Device` class keeps its connection private and only exposes `ReadTag()`.
**Abstraction**: expose what, not how. An `IProtocolDriver` interface with `Connect`, `Read` and `Write`.
**Inheritance**: share behaviour. A `TcpDriverBase` handles reconnection, and `ModbusDriver` and `S7Driver` inherit from it.
**Polymorphism**: the ingestion engine calls `driver.Read()` without knowing which protocol it is. In a tester, that's like calling `instrument.Measure()` on any instrument type."

#### Q18. Interface vs abstract class?
"An interface is a contract with no state. A class can implement many interfaces. Since C# 8 interfaces can have default methods, but still no instance fields. An abstract class can hold state, constructors and shared implementation, but a class can inherit only one. I use interfaces for capabilities and testability (`IInstrument`), and an abstract base class when several implementations share real code."

#### Q19. Value type vs reference type? Boxing?
"Value types (`struct`, `int`, `double`) hold their data directly and are copied on assignment. They usually live on the stack or inline in an object. Reference types (`class`) live on the heap, and variables hold a reference. Boxing wraps a value type in an object on the heap, for example putting an `int` in an `object` or a non-generic `ArrayList`. That costs an allocation, which matters in tight loops, like processing thousands of measurements per site. Generics avoid it."

#### Q20. How does garbage collection work? What is IDisposable for?
"The .NET GC is generational: gen 0 for new objects, gen 1, gen 2 for long-lived ones, plus the Large Object Heap for objects of 85 KB and larger. It collects managed memory automatically but knows nothing about unmanaged resources such as file handles, sockets, COM objects or instrument sessions. `IDisposable` with `using` releases them deterministically. A finalizer is only a safety net. In a COM-heavy environment like Excel automation, you also have to release COM objects (`Marshal.ReleaseComObject` or let them go out of scope and collect), or Excel processes stay alive."

#### Q21. What causes memory leaks in .NET?
"Mostly references that are kept alive by mistake: event handlers never unsubscribed (the publisher keeps the subscriber alive), static collections or caches that only grow, timers, unmanaged handles never disposed, and COM objects never released. To find one, I take two dumps some time apart, or use dotnet-gcdump, and compare `!dumpheap -stat`. Then `!gcroot` on a growing type shows who holds it."

#### Q22. `async/await`: what happens, and what is a deadlock with `.Result`?
"`await` frees the thread while the I/O runs and resumes the method later. If code blocks with `.Result` or `.Wait()` on a thread that has a synchronization context, such as a UI thread or old ASP.NET, the continuation needs that same thread, which is blocked, so it deadlocks. Fixes: async all the way, or `ConfigureAwait(false)` in library code."

#### Q23. Thread safety: how would you protect a shared counter / collection?
"For a counter, `Interlocked.Increment`. For a collection, `ConcurrentDictionary` or `ConcurrentQueue`, or a `lock` around a short critical section. Never hold a lock during I/O. To avoid deadlocks, always take locks in the same order and keep them short."

### Part B – C++

#### Q24. Pointer vs reference?
"A pointer can be null, can be reseated and needs `*` to dereference. A reference must be bound at initialisation, can't be null in correct code and can't be reseated. I use references for parameters that must exist, and pointers (preferably smart pointers) when ownership or 'no object' matters."

#### Q25. What is RAII? Smart pointers?
"Resource Acquisition Is Initialization: a resource is tied to an object's lifetime. The constructor acquires it and the destructor releases it, so cleanup happens even on exceptions. Smart pointers apply it to memory: `unique_ptr` for single ownership, `shared_ptr` with reference counting for shared ownership, `weak_ptr` to break cycles. It's the C++ equivalent of `using`/`IDisposable`."

#### Q26. Why should a base class have a virtual destructor?
"If you delete a derived object through a base pointer and the destructor isn't virtual, only the base destructor runs. That's undefined behaviour, and in practice the derived part leaks. Any class meant to be used polymorphically needs a virtual destructor."

#### Q27. Common causes of a C++ crash, and how do you find them?
"Null or dangling pointers (use after free), buffer overruns, double delete, stack overflow from deep recursion, and unhandled exceptions. To find them: get a crash dump with ProcDump `-e` or WER LocalDumps, open it in WinDbg with matching **symbols (PDBs)**, run `!analyze -v`, and look at the faulting stack with `k`. For heap corruption, enable **PageHeap** with `gflags /p /enable app.exe /full`, so the crash happens at the bad write instead of later."

### Part C – Excel / VBA / VBT

#### Q28. Write a VBA function that finds all failing values in a column and returns their count. (live)
See `04-Coding-Practice/vba/Drills.bas` (Drill 1). Talking points: read the range into an array (`rng.Value`) instead of cell-by-cell (much faster), `Option Explicit`, typed variables, handle a single-cell range, and `IsNumeric` checks.

#### Q29. How do you make VBA fast?
"Read and write ranges as arrays in one call, don't use `Select` or `Activate`, turn off `Application.ScreenUpdating`, set `Calculation` to manual during bulk work and restore it in an error handler, use `Dictionary` for lookups instead of nested loops, and avoid `Variant` where a typed variable works. In test code, the time-critical part is avoiding unnecessary instrument setup inside loops, and in multi-site work, operating on all sites at once instead of looping per site where the API allows it."

#### Q30. How do you handle errors in VBA?
"`On Error GoTo Handler` with a single exit point that restores state (ScreenUpdating, Calculation, open files), logs `Err.Number`, `Err.Description` and the procedure name, then either re-raises with `Err.Raise` or returns a failure code. `On Error Resume Next` only around one specific line that may fail, immediately followed by checking `Err.Number` and `On Error GoTo 0`."

#### Q31. VBA vs VB.NET differences you watch for?
"VBA arrays can have any lower bound and default to `Option Base 0`, but `Range.Value` returns 1-based 2D arrays. `Set` is required for object assignment. There's no real inheritance in VBA, only interfaces via `Implements`. Integer is 16-bit in VBA, so use `Long`. And error handling is `On Error` instead of `Try/Catch`."

#### Q32. A customer says their VBT test program became slower after an IG-XL upgrade. How do you investigate?
"1. Get both versions' timing data. IG-XL can report test times per instance, and I'd compare instance by instance to find which tests got slower instead of looking at the total.
2. Check whether it's in the customer's VBT code or in the system: run a standard/reference program on both versions.
3. For the slow instances, look for setup that's repeated unnecessarily, such as levels or timing loaded inside loops, or per-site loops where a multi-site call exists, and for datalog or debug settings that were turned on.
4. If it's in our software, reproduce it in-house with a minimal program, profile it, and hand it to the development team with the data.
5. Communicate a workaround to the customer as soon as there is one."

### Part D – Windows debugging

#### Q33. An application crashes randomly on a customer's tester PC. Walk me through it.
"1. **Event Viewer**, Application log: the crash event shows the faulting module and exception code, for example `0xC0000005` access violation or `0xE0434352` .NET exception.
2. **Capture a dump**: `procdump -e -ma -w app.exe C:\dumps`, or set WER LocalDumps in the registry, or a DebugDiag crash rule.
3. **Analyse in WinDbg**: set symbols (`.symfix`, plus our PDB path), `!analyze -v`, `k` for the native stack. For .NET, `.loadby sos clr` (or `coreclr`), then `!pe` for the exception and `!clrstack`.
4. Identify whether the faulting module is ours, the customer's code, or a third-party DLL or driver.
5. Reproduce it with that knowledge, fix it, and confirm on the customer's setup."

#### Q34. The application hangs (not responding, CPU low). What do you do?
"Low CPU usually means waiting, so a deadlock or blocked I/O. I take 2–3 hang dumps a few seconds apart (`procdump -ma <pid>` or DebugDiag hang rule). In WinDbg, `~*k` shows all thread stacks, `!locks` shows critical sections for native code, and `!syncblk` shows held managed locks. If the same threads are waiting in every dump, that's the deadlock. I look for a lock-order problem or a UI thread blocked on a background thread. **High CPU** instead means a busy loop: Process Explorer's thread tab shows which thread, and `!runaway` in WinDbg shows thread CPU times."

#### Q35. Which Sysinternals tools do you use and for what?
"**Process Explorer**: who has a file or DLL open, handles, threads, which DLL versions are loaded. **Process Monitor**: file, registry and process activity, perfect for 'access denied', 'file not found' or a missing config. Filter on the process and on `Result is not SUCCESS`. **ProcDump**: dumps on crash, hang or CPU threshold. **Autoruns**: what starts at boot, for conflicts. **TCPView**: network connections. **Handle**: handle counts from the command line, for handle leaks. **VMMap**: memory breakdown, managed vs native vs images."

#### Q36. Memory keeps growing over a long test run. How do you find the leak?
"First decide which kind: Performance Monitor counters, or Process Explorer columns (Private Bytes vs .NET heap size, handle count, GDI objects). If the managed heap grows, take two dumps and compare `!dumpheap -stat`, then `!gcroot` on the growing type. If native memory grows, use a **DebugDiag leak rule** or `!heap -s`, and UMDH with user stack traces enabled in gflags. If the **handle count** grows, `!htrace` or Handle.exe. Typical culprits in this environment: COM objects not released, event subscriptions, and caches that never shrink."

#### Q37. What are symbols and why do you need them?
"PDB files map addresses to function names, source files and line numbers. Without them a stack is just `module+0x1234`. You need the **exact matching** PDB for the build. That's why build systems should archive PDBs to a symbol server. In WinDbg: `.sympath srv*C:\symbols*https://msdl.microsoft.com/download/symbols;C:\ourbuild\pdbs`, then `.reload`."

#### Q38. 32-bit vs 64-bit issues you've seen?
"A 64-bit process can't load a 32-bit DLL in-process. You see a `BadImageFormatException` in .NET, or a COM class 'not registered' because it is registered only in the other registry view (`WOW6432Node`). There are also two copies of `System32`/`SysWOW64` and of Excel bitness, so VBA `Declare` statements need `PtrSafe` and `LongPtr` in 64-bit Office. I check bitness with Process Explorer or `dumpbin /headers`."

### Part E – Version control

#### Q39. How do you find which commit introduced a bug?
"`git bisect`: mark a good and a bad commit, Git checks out the midpoint, I test, and in a few steps it finds the commit. Also `git log -S "text"` to find when a line appeared, and `git blame` for who changed a line and why."

#### Q40. Merge vs rebase?
"Merge keeps history as it happened, with a merge commit. Rebase replays my commits on top of the target for a linear history. I rebase my private feature branch to stay current, and merge or squash into shared branches. I never rebase a branch others have pulled."

### Part F – Design question (10–15 min)

#### Q41. Design a tool that collects test results from many testers and shows yield per lot. (likely variant of their "design a system" question)
**Model answer, structured:**
1. **Clarify:** how many testers, result format (STDF datalog files), real-time or batch, who uses it (product engineers), retention.
2. **Ingestion:** a small Windows service on each tester or a file share watcher picks up closed STDF files and pushes them to a queue. It must be idempotent: file hash as key, so retries don't duplicate.
3. **Parsing:** a worker parses STDF records (lot, wafer, site, part/bin results, parametric values) and writes them to SQL Server. Bin summary goes to a normal table, parametric data to a columnstore or partitioned table, because it's large.
4. **API + UI:** yield by lot, wafer map, bin Pareto, per-site comparison (a site with lower yield points to a hardware/contact problem).
5. **Non-functional:** testers must never be slowed down, so collection is asynchronous and low priority. Buffer locally if the network is down. Monitor queue length.
6. Tie it to your experience: "I built a similar pipeline in FactoryOS: device ingestion → queue → columnstore telemetry table → live dashboards and SPC."

#### Q42. Design an ATM system (reported Teradyne question). Classes only.
"Classes: `ATM` (has `CardReader`, `CashDispenser`, `Keypad`, `Screen`, `ReceiptPrinter`), `Bank` (via an `IBankService` interface), `Account` (subclasses `CheckingAccount`, `SavingsAccount`), `Card`, `Transaction` (abstract) with subclasses `Withdrawal`, `Deposit`, `BalanceInquiry`, `Transfer`, each overriding `Execute()`. Use the **State pattern** for the ATM (`Idle`, `CardInserted`, `PinVerified`, `Transaction`, `OutOfService`). Key points: PIN verified by the bank, not the ATM; withdrawal is a two-phase operation (authorise, dispense, then confirm, and reverse if the dispense fails); concurrency on the account is handled in the bank with a transaction or row lock; every step is logged for audit."

---

## ROUND 4 – Final / behavioural (≈30 min)

### Q43. Tell me about a time you had to learn something new quickly.
"At Tecogis I joined the IGI diamond-grading project with no gemology knowledge. Within [a month] I learned the grading workflow (the 4Cs, certificates, lab sync) well enough to design the grading portal with e-signature, a camera library for stone images and Rapaport pricing. I learn by reading the domain docs, sitting with the users, and building a small prototype early. I've done the same for ATE before this interview: I studied the test-program structure and the IG-XL concepts."

### Q44. Tell me about a time you handled an unhappy customer.
"At Acer, a repair-centre partner escalated because shipments were stuck for [two days] during a peak. I called them, acknowledged the impact, and agreed to update them every two hours. I found that [a carrier's API change] was causing it, put in a temporary manual path the same day so shipments could move, and shipped the real fix the next day. Afterwards I added monitoring, so we'd see it before they did. They were calmer because they always knew the status, even before we had the fix."

### Q45. Tell me about a mistake you made.
"Early in my career I deployed a database change without testing it on a production-sized copy. A query that ran in milliseconds in test took minutes in production and slowed the site. I rolled back, added the missing index, and since then I always test schema changes against realistic data volume and keep a rollback script ready. That habit has saved me several times since."

### Q46. Where do you see yourself in 5 years?
"As a senior engineer that both customers and the development team trust for this platform, someone who knows IG-XL and the testers deeply, mentors new engineers, and builds tools that make the support work faster."

### Q47. Do you have any questions for us?
Always yes. See `01-Overview/Questions-To-Ask.md`.

---

## Scoring yourself after each practice

| Check | ✓ |
|---|---|
| Answer had a clear structure (STAR or numbered steps) | |
| Mentioned a concrete tool, command or number | |
| Linked back to the role (testers, customers, root cause) | |
| Under 2 minutes | |
| Ended confidently, without trailing off | |
