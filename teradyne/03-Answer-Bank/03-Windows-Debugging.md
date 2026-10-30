# Answer Bank 3 – Windows Debugging (WinDbg, DebugDiag, Sysinternals)

This is the most important technical topic for this JD. Practise for real with the demo in `04-Coding-Practice/csharp` (`crash`, `hang`, `leak`, `handles` modes).

## The universal method (say this structure every time)

1. **Classify:** crash, hang (low CPU), spin (high CPU), leak (memory/handles), or wrong result.
2. **Gather:** version, environment, Event Viewer, app logs, reproduction steps.
3. **Capture** evidence at the moment of failure (dump, trace).
4. **Analyse** with symbols.
5. **Root cause → fix → verify on the customer setup → prevent** (test, monitoring, docs).

## Exception codes to recognise

| Code | Meaning |
|---|---|
| `0xC0000005` | Access violation (null/dangling pointer, bad write) |
| `0xC00000FD` | Stack overflow (deep/infinite recursion) |
| `0xC0000374` | Heap corruption |
| `0xC0000409` | Stack buffer overrun / fail-fast |
| `0xE0434352` | .NET (CLR) exception ("CCR" in ASCII) |
| `0xE06D7363` | C++ exception ("msc") |
| `0x80000003` | Breakpoint (often a `DebugBreak` or assert) |

## Capturing dumps

| Tool | Command / way | When |
|---|---|---|
| ProcDump | `procdump -e -ma -w app.exe C:\dumps` | Crash on unhandled exception (`-e`), full dump (`-ma`), wait for process to start (`-w`) |
| ProcDump | `procdump -ma -n 3 -s 5 <pid>` | Hang: 3 dumps, 5 s apart |
| ProcDump | `procdump -ma -c 80 -s 10 <pid>` | High CPU: dump when CPU > 80% for 10 s |
| ProcDump | `procdump -ma -m 2000 <pid>` | Memory: dump when commit > 2000 MB |
| Task Manager | right-click → Create dump file | Quick hang dump, no tools needed |
| WER LocalDumps | `HKLM\SOFTWARE\Microsoft\Windows\Windows Error Reporting\LocalDumps\app.exe` → `DumpType=2`, `DumpFolder` | Customer machine, always-on crash dumps without installing tools |
| DebugDiag | Add Rule → Crash / Hang (IIS) / Performance / Native Memory leak | Customers who prefer a GUI; also its **Analysis** tab auto-reports on dumps |

**32-bit process on 64-bit Windows:** dump it with a 32-bit tool (ProcDump does this automatically; Task Manager needs `C:\Windows\SysWOW64\taskmgr.exe`), otherwise the dump is hard to analyse.

## WinDbg essentials

```
.symfix                       ; Microsoft symbol server
.sympath+ C:\ourbuild\pdbs    ; add our PDBs
.reload
!analyze -v                   ; automatic analysis: exception, faulting module, stack
lm                            ; loaded modules; lmvm modname  → version/timestamp
k / kb / kn                   ; stack of current thread
~                             ; list threads;   ~3s  switch to thread 3
~*k                           ; all thread stacks (hangs!)
!runaway                      ; CPU time per thread (spins)
!locks                        ; native critical sections held/waited
!handle 0 0                   ; handle summary;  !htrace  handle traces
!heap -s                      ; native heap summary
dv / dt                       ; locals / display type
.ecxr                         ; switch to exception context record
.dump /ma C:\x.dmp            ; save a dump from a live session
```

**.NET (SOS):**
```
.loadby sos clr        ; .NET Framework   (.NET Core/5+: .loadby sos coreclr, or SOS loads automatically in new WinDbg)
!pe                    ; print current managed exception
!clrstack              ; managed stack of current thread
~*e !clrstack          ; managed stacks of all threads
!threads               ; managed threads + last exception
!syncblk               ; managed locks held (deadlocks)
!dumpheap -stat        ; objects by type, count and size (leaks)
!dumpheap -type Foo    ; instances of a type
!gcroot <addr>         ; why is this object alive?
!do <addr>             ; dump object
!eeheap -gc            ; GC heap sizes
```

## Scenario answers

**Q: Access violation in our DLL, only on one customer's tester.**
`!analyze -v` → faulting instruction and stack in our module. `lmvm ourdll` to confirm the version matches what we think they have (often they run a different patch!). Check whether the pointer is null (`0x0`) or a freed-memory pattern. If heap corruption is suspected, ask for a repro with PageHeap (`gflags /p /enable app.exe /full`), so it breaks at the bad write. Compare their environment, such as a third-party DLL or driver version, and look for `lm` modules that are not on our machine.

**Q: Excel (hosting the test program) crashes on close.**
Classic causes: COM objects not released by an add-in or .NET code, events still connected, a background thread touching Excel objects. Dump on crash → stack usually shows the add-in DLL. Process Explorer → DLL view to list add-ins. Try with add-ins disabled (`excel /safe`).

**Q: "Access denied" / "file not found" errors with no detail.**
**Process Monitor**: filter `Process Name is app.exe` and `Result is not SUCCESS`, look for `ACCESS DENIED`, `NAME NOT FOUND`, `PATH NOT FOUND` on files or registry keys near the time of the error. This also finds missing DLL dependencies (a long list of `NAME NOT FOUND` while probing for a DLL).

**Q: Which DLL version is actually loaded?**
Process Explorer → lower pane DLL view (View → Lower Pane View → DLLs), or `lm` in WinDbg, or `listdlls.exe app.exe`.

**Q: Handle leak?**
Process Explorer "Handles" column growing, or `handle -s -p app.exe` for counts by type. In WinDbg: `!htrace -enable`, run for a while, then `!htrace -diff` gives the stacks that opened handles never closed.

**Q: GDI/User objects leak (UI eventually stops drawing)?**
Task Manager → Details → add "GDI objects" / "USER objects" columns. The default limit is 10,000 per process. Look for fonts, brushes and bitmaps not disposed.

**Q: Application is slow, not hung.**
Measure first: Performance Monitor counters (CPU, disk, .NET GC % time, exceptions/sec), then a profiler (Visual Studio Profiler, PerfView, dotnet-trace). High "% time in GC" points to too many allocations. Many first-chance exceptions/sec means exceptions used for flow control.

**Q: Event Viewer, what do you look at?**
Windows Logs → Application: "Application Error" (Event ID 1000, faulting module + offset + exception code), ".NET Runtime" (Event ID 1026, managed stack trace!), "Windows Error Reporting" (1001). System log for driver, disk and service failures.

**Q: DebugDiag vs WinDbg?**
DebugDiag automates capture (rules) and gives readable HTML analysis reports, which is good for customers and first triage, especially leaks and IIS hangs. WinDbg is for deep manual analysis. I usually start with a DebugDiag/ProcDump capture and go to WinDbg when I need detail.

**Q: Remote / live debugging?**
Attach WinDbg to the live process (`F6`), or run it remotely with `.server` / `-remote`. In production, prefer dumps: attaching freezes the process and stops the tester.
