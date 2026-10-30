# Coding Practice – Problems

Solve each one **on paper or in Notepad first** (no IntelliSense, like a live interview), talking aloud. Then compare with the solution files.

| # | Problem | Lang | Solution |
|---|---|---|---|
| C1 | Reverse the words in a sentence without `Split`/`Reverse`. Handle extra spaces. | C# | `csharp/Drills.cs` → `Strings.ReverseWords` |
| C2 | Palindrome check ignoring case and punctuation. | C# | `Strings.IsPalindrome` |
| C3 | Parse a datalog CSV `site,test,value,low,high`; return failures per site and yield (a site passes only if all its tests pass). Skip header, blank and `#` lines. | C# | `Datalog` |
| C4 | **OOP:** model instruments (`DcSource`, `DigitalPins`) behind an interface; a `TestFlow` runs steps on all sites, removes a site at its first failure and assigns its fail bin, and good sites get bin 1. | C# | `IInstrument`, `TestFlow` |
| C5 | Thread-safe bin counter used from `Parallel.For`. | C# | `BinCounter` |
| C6 | Two-sum, binary search, count set bits, set/clear a bit, reverse a linked list, moving average. | C# | `Algorithms` |
| V1 | VBA UDF `CountFailures(range, low, high)` that works on any range, fast. | VBA | `vba/Drills.bas` |
| V2 | Per-site PASS/FAIL summary and yield into a new sheet with a `Dictionary`. | VBA | `Drill2_SiteSummary` |
| V3 | Highlight failing rows fast, restoring Excel state even on error. | VBA | `Drill3_HighlightFailures` |
| V4 | Import a CSV into a sheet using file I/O and one array write. | VBA | `Drill4_ImportCsv` |
| V5 | VBA class module for a measurement with a `Passed` property. | VBA | `vba/Measurement.cls` |
| P1 | C++ abstract `Instrument` with a virtual destructor, `unique_ptr` ownership, run a flow with erase-remove. | C++ | `cpp/drills.cpp` |
| P2 | RAII move-only resource wrapper (Rule of 5). | C++ | `ScopedResource` |
| P3 | Find the bugs: dangling pointer, `delete` vs `delete[]`, iterator invalidation, missing virtual dtor, `strcpy` overrun. | C++ | comments in `drills.cpp` |
| P4 | Reverse a linked list with `unique_ptr`. | C++ | `reverse` |

## How to run

```powershell
# C# drills (self-tests)
cd csharp
dotnet run

# C# debugging demos (for WinDbg / ProcDump / Process Explorer / Process Monitor practice)
dotnet run -- crash      # NullReferenceException after 10 s
dotnet run -- hang       # lock-order deadlock between two threads
dotnet run -- leak       # managed memory leak (~10 MB/s)
dotnet run -- handles    # handle leak
dotnet run -- spin       # 100% CPU thread
dotnet run -- fileerror  # repeated missing-file access

# C++ drills
cpp\build.cmd

# VBA: open Excel → Alt+F11 → File → Import File → vba\Drills.bas and vba\Measurement.cls
#      Alt+F8 → SetupSampleData, then Drill2_SiteSummary, Drill3_HighlightFailures …
#      In a cell: =CountFailures(C2:C9,1,1.5)   → 2
```

Tested 2026-10-22: C# 15/15 checks pass (.NET 10), C++ all asserts pass (MSVC, C++17). The VBA was written for Excel 2016+/365 but not run automatically; it needs the VBA editor.

## Live-coding tips

- Say your plan before typing: inputs, outputs, edge cases (empty, null, one element, huge input).
- Write the simple correct version first, then improve.
- Test with a small example by hand at the end.
- Mention complexity: "This is O(n) time, O(n) extra space for the dictionary."
- If stuck, say what you're thinking. They grade reasoning, not only the result.
