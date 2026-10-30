# JD Analysis – Teradyne Software Engineer (IG-XL / ATE software)

## The requirements (as given)

- Programming experience in object-oriented software (C# and C++ is a plus)
- Strong Excel and VB scripting skills (exposure to IG-XL VBT is a plus)
- Experience with version control software (GitHub, ClearCase)
- Experience in Microsoft Windows and Microsoft applications (.NET infrastructure)
- General debugging of applications in Windows (WinDbg, DebugDiag, Sysinternals tools)
- BS or MS in CS, CE, EE or related fields
- 5 years in automated test equipment (ATE) in semiconductor is a plus

## What the role most likely is

Teradyne's semiconductor test systems (UltraFLEX, UltraFLEXplus, J750, IntegraFLEX) are programmed with **IG-XL**. IG-XL is a Windows application built around **Excel workbooks** (the test program) and **VBT, Visual Basic for Test** (VBA test code inside the workbook), with growing .NET/C# support.

This JD reads like a **software / application-support engineer** for that stack: writing and debugging test-program code, supporting customers (OSATs and fabs such as TSMC, ASE, KYEC, MediaTek in Taiwan), finding why IG-XL or a customer's VBT program crashes, hangs or leaks, and building internal tools in C#/C++.

Keywords to say in the interview: **customer issue, root cause, crash dump, reproducible, test program, production line, throughput, multi-site, datalog.**

## Requirement → your evidence → gap

| Requirement | Your evidence (from resume) | Strength | How to bridge the gap |
|---|---|---|---|
| OOP, C# | 11 yrs C#/.NET (Framework → .NET 8/10), Clean Architecture, repository/service layers, FactoryOS (.NET 10) | ★★★★★ | None. Lead with this. |
| C++ | Academic only (M.Sc. CS) | ★★ | Revise pointers, RAII, virtual destructors, smart pointers, STL. Drills in `04-Coding-Practice/cpp`. Say: "I read and debug C++ comfortably and I'm rebuilding hands-on depth." |
| Excel + VB scripting | VB.NET in production (Acer, Tecogis/IGI), Crystal/SSRS reports, data pipelines | ★★★★ | VB.NET → VBA is a small step. Practise VBA ranges, arrays, `Dictionary`, error handling. Drills in `04-Coding-Practice/vba`. |
| IG-XL VBT | None | ★ | Read `05-Cheatsheets/IGXL-ATE-Primer.md`. Explain that you understand the model (Excel sheets + VBA templates + .NET), and that VB.NET makes the learning curve short. |
| GitHub / ClearCase | Git, GitHub Actions, Azure DevOps daily | ★★★★ | Learn ClearCase vocabulary: VOB, view (snapshot/dynamic), config spec, checkout/checkin, UCM stream. |
| Windows / .NET infrastructure | All Windows/IIS/.NET career; Windows services in FactoryOS deploy | ★★★★ | Revise CLR, GAC, COM interop, 32/64-bit, registry, Event Viewer. |
| WinDbg / DebugDiag / Sysinternals | Production debugging of .NET apps, IIS hangs | ★★★ | Practise one real dump analysis (`04-Coding-Practice/csharp` has a crash/hang demo to dump). Learn the command list in `05-Cheatsheets`. |
| Degree | M.Sc. Computer Science, University of Mumbai | ★★★★★ | – |
| 5 yrs ATE (plus) | None directly. Manufacturing/hardware-adjacent: Acer repair-centre system on-site, FactoryOS smart-manufacturing platform (OPC UA, Modbus, SPC, OEE) | ★★ | Use FactoryOS + Acer to show you understand factories, yield, downtime and SPC. Learn ATE vocabulary (primer). |

## Your three strongest stories (map every question to one of these)

1. **Acer on-site (2022–2025)**: supporting a production system used by repair centres across Taiwan. Covers customer handling, EDI integration debugging (FedEx/TNT), working with Taiwanese PMs, UAT/release ownership, i18n.
2. **Production debugging** (pick a real one): e.g. a .NET service that hung or leaked memory, or an EDI integration failing on certain document formats. Describe dump/log → root cause → fix → prevention.
3. **FactoryOS (2026, own project)**: .NET 10 + MSSQL smart-manufacturing platform with industrial protocols (OPC UA, Modbus, MQTT, S7), SPC/quality, OEE, alarms. This shows you think about factories and equipment, the domain closest to ATE.

Backup stories: IGI diamond-grading portal (lab instrument data, camera library, VB.NET), Health Assure (led 5 developers), AMG (company closed its operations in Sep 2026; say it neutrally).

## Risks and how to handle them

| Risk | Handling |
|---|---|
| "You have no ATE / IG-XL experience." | "Correct, I haven't used IG-XL yet. What I bring is the platform underneath it: Windows, .NET, VB and Excel automation, and deep debugging. I've already studied how a test program is structured (pin map, levels, timing, instances, flow, VBT templates), and coming from VB.NET, VBT is a short step. I expect to be productive on support tickets within the first month." |
| C++ depth | Be honest. Show you can reason about memory, ownership and crashes, which is what WinDbg work needs. |
| Mandarin | Teradyne is a US company and its engineering works in English. Ask early whether daily work with customers needs Mandarin. Offer: English with customers' engineering teams, documentation and logs, and you are learning basic Mandarin. |
| Why leave web/fintech? | "I want to work closer to hardware and manufacturing. I built FactoryOS on my own time because I enjoy that domain, and Taiwan's semiconductor industry is the best place to do it." |
