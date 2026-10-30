# Cheatsheet – Windows Debugging (1 page)

## Method
**Classify → Gather → Capture → Analyse (with symbols) → Root cause → Fix → Verify → Prevent**

| Symptom | Capture | Look at |
|---|---|---|
| Crash | `procdump -e -ma -w app.exe C:\dumps` · WER LocalDumps · DebugDiag crash rule | `!analyze -v`, `k`, `.ecxr`; .NET: `!pe`, `!clrstack` |
| Hang (low CPU) | `procdump -ma -n 3 -s 5 <pid>` · Task Manager "Create dump" | `~*k`, `!locks`; .NET: `!syncblk`, `~*e !clrstack` |
| High CPU | `procdump -ma -c 80 -s 10 <pid>` · Process Explorer → Threads | `!runaway`, then `~Ns k` on the top thread |
| Memory leak | 2 dumps minutes apart · DebugDiag leak rule · `procdump -m` | .NET: `!dumpheap -stat` diff → `!gcroot`; native: `!heap -s`, UMDH |
| Handle leak | Process Explorer Handles column · `handle -s -p app.exe` | `!htrace -enable` … `!htrace -diff` |
| File/registry/DLL errors | Process Monitor (filter Process Name + Result ≠ SUCCESS) | ACCESS DENIED, NAME NOT FOUND, PATH NOT FOUND |
| Which DLL / version loaded | Process Explorer DLL view · `listdlls` · WinDbg `lmvm` | Version, path, 32/64-bit |

## Exception codes
`C0000005` access violation · `C00000FD` stack overflow · `C0000374` heap corruption · `C0000409` buffer overrun/fail-fast · `E0434352` .NET · `E06D7363` C++ · `80000003` breakpoint

## WinDbg starter
```
.symfix ; .sympath+ C:\pdbs ; .reload
!analyze -v        lm / lmvm mod        k / kb        ~ / ~3s / ~*k
!runaway           !locks               !handle       !heap -s      .ecxr
.loadby sos clr  (or coreclr)
!pe  !clrstack  !threads  !syncblk  !dumpheap -stat  !dumpheap -type X  !gcroot ADDR  !do ADDR
```

## Practice lab (with `04-Coding-Practice/csharp`)
1. **Crash:** terminal A `dotnet run -- crash` (prints PID). Terminal B within 10 s: `procdump -e -ma <PID> C:\dumps`. Open the dump in WinDbg → `!analyze -v` → you should see `NullReferenceException` in `DebugDemos.Crash`.
2. **Hang:** `dotnet run -- hang` → `procdump -ma <PID> C:\dumps` → WinDbg → `!syncblk` shows two locks owned, `~*e !clrstack` shows `SiteWorker-1` and `SiteWorker-2` each waiting in `Monitor.Enter`. That is a lock-order deadlock.
3. **Leak:** `dotnet run -- leak` → dump at 30 s and 60 s → `!dumpheap -stat` → `System.Byte[]` grows → `!dumpheap -type System.Byte[] -min 1000000` → `!gcroot <addr>` → held by `DebugDemos.Cache` (static List).
4. **Handles:** `dotnet run -- handles` → Process Explorer Handles column climbs → `handle -s -p <PID>` shows Event handles growing.
5. **Spin:** `dotnet run -- spin` → Process Explorer → Properties → Threads → `BusyPoller` at the top → in WinDbg `!runaway`.
6. **File error:** `dotnet run -- fileerror` → Process Monitor filter `Process Name contains TeradyneDrills` + `Path contains Missing.cfg` → `PATH NOT FOUND`.

## Sysinternals in one line each
**Process Explorer** handles/DLLs/threads/versions · **Process Monitor** file+registry+process activity · **ProcDump** dumps on triggers · **Autoruns** startup items · **TCPView** sockets · **Handle** handle counts · **ListDLLs** loaded DLLs · **VMMap** memory breakdown · **RAMMap** system memory · **PsExec** run remotely · **Sigcheck** file version/signature

## Symbols
PDBs must match the exact build. Archive them per release on a symbol server. Public symbols: `srv*C:\symbols*https://msdl.microsoft.com/download/symbols`.

## 32 vs 64-bit
A 64-bit process can't load a 32-bit DLL (`BadImageFormatException`). COM registration lives in two registry views (`WOW6432Node`). Office bitness matters for VBA `Declare` (`PtrSafe`, `LongPtr`). Dump a 32-bit process with a 32-bit tool.
