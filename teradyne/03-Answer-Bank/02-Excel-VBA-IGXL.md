# Answer Bank 2 – Excel, VBA and IG-XL VBT

> IG-XL specifics here come from public material and general knowledge of the platform. Object and sheet names can differ between IG-XL versions, so present them as "my understanding" in the interview.

## Excel / VBA fundamentals

**Q: Module vs class module vs sheet module?**
Standard module: public procedures and functions. Class module: defines an object (properties, methods, `Implements` for interfaces). Sheet/ThisWorkbook module: event handlers (`Worksheet_Change`, `Workbook_Open`).

**Q: `Sub` vs `Function`?**
A `Function` returns a value and can be used as a worksheet formula (UDF). A `Sub` doesn't return a value. Both can take `ByRef` (default in VBA!) or `ByVal` parameters. Default `ByRef` surprises VB.NET developers, where the default is `ByVal`.

**Q: `Option Explicit` – why?**
It forces variable declaration, so a typo (`resutl`) becomes a compile error instead of a new empty Variant. Always on.

**Q: Data types to remember**
`Integer` is 16-bit (max 32,767), so use `Long`. `LongLong`/`LongPtr` are for 64-bit. `Double` for measurements. `Variant` can hold anything, including arrays and `Empty`/`Null`/`Error`. Use `Currency` for fixed-point.

**Q: Dynamic arrays**
```vba
Dim v() As Double
ReDim v(1 To n)
ReDim Preserve v(1 To n + 10)   ' only the LAST dimension can be resized with Preserve
```

**Q: Dictionary / Collection?**
`Scripting.Dictionary` (late bound: `CreateObject("Scripting.Dictionary")`) has `.Exists`, `.Keys` and `.Items`, and gives O(1) lookups. Use it for counting bins or grouping. `Collection` is built in but has no `Exists` and is slower to search.

**Q: Early vs late binding?**
Early: reference added (Tools → References), typed objects, IntelliSense, faster. Late: `As Object` + `CreateObject`, no reference needed, avoids version conflicts between machines. Use late binding for distribution, early binding while developing.

**Q: How to find the last used row?**
`lastRow = ws.Cells(ws.Rows.Count, "A").End(xlUp).Row`. More reliable than `UsedRange`, which can include formatted empty cells.

**Q: How to read a CSV / text file fast?**
`Open path For Input As #f` + `Line Input`, or `FileSystemObject.OpenTextFile`, or read the whole file with `Input$(LOF(f), f)` then `Split(text, vbCrLf)`. For big data, `Workbooks.OpenText` or Power Query.

**Q: Calling Windows API from VBA (64-bit Office)?**
```vba
#If VBA7 Then
    Private Declare PtrSafe Function GetTickCount64 Lib "kernel32" () As LongLong
#Else
    Private Declare Function GetTickCount Lib "kernel32" () As Long
#End If
```
Pointers and handles must be `LongPtr` in 64-bit.

**Q: How do you debug VBA?**
Breakpoints (F9), step (F8), Immediate window (`?var`, `Debug.Print`), Watch and Locals windows, `Stop` statement, and `Debug.Assert condition`. For timing, `Timer` or `GetTickCount64`.

**Q: Excel automation from C#?**
Use `Microsoft.Office.Interop.Excel` (or late-bound `dynamic`), always release COM objects, avoid two dots (`xl.Workbooks.Open` creates a hidden RCW), and call `Quit`. For server-side work use OpenXML/ClosedXML instead, since Office automation is not supported unattended.

## IG-XL concepts (be able to explain simply)

**Q: What is a test program in IG-XL?**
An Excel workbook (`.igxl` / `.xlsm` style) loaded by IG-XL. Typical sheets:
| Sheet | Purpose |
|---|---|
| Pin Map | Device pin names and pin groups |
| Channel Map | Which tester channel/instrument each pin connects to, per site (multi-site) |
| DC Specs / AC Specs / Global Specs | Named values (e.g. VDD = 1.2 V, period = 10 ns), with selectors (min/typ/max) |
| Pin Levels | VIL/VIH/VOL/VOH, power supply levels per pin |
| Time Sets | Waveform timing per pin for digital patterns |
| Test Instances | Each test: which template (VBT or built-in), with which arguments, patterns, levels and timing |
| Flow Table | Order of execution, pass/fail branching, binning |
| Bin Table | Maps pass/fail results to hardware/software bins |
| Job List | Which flow/sheets make up a job (e.g. wafer sort vs final test) |

**Q: What is VBT?**
Visual Basic for Test: VBA code inside the test program. You write **test templates/functions** that use the IG-XL object model, roughly:
- `TheExec` – execution context: flow, sites, datalog, limits (`TheExec.Flow.TestLimit` to judge a value against limits and datalog it), error handling.
- `TheHdw` – hardware: instruments (DC power supplies, PPMU, digital pins, patterns).
- Site-aware data types such as `SiteDouble` and `PinListData`, so one call returns values for all active sites. Multi-site code should loop over **active** sites only, because failed sites get disabled.

**Q: What is multi-site testing and why does it matter for software?**
Testing several devices (sites) in parallel to increase throughput. Software must handle per-site data, sites that fail early and are removed, and keep site results separated in the datalog. Bugs often show up as "site 3 always fails", which can be the hardware (channel/contact) or code that indexes sites wrongly.

**Q: Typical VBT test function shape (pseudocode)**
```vba
Public Function Leakage_Test(pins As PinList, vForce As Double) As Long
    On Error GoTo errHandler
    ' 1. connect / set up instrument (PPMU) on the pins
    ' 2. force voltage vForce, wait settling time
    ' 3. measure current on all active sites -> site-aware result
    ' 4. TheExec.Flow.TestLimit result, lowLimit, highLimit   ' judge + datalog
    ' 5. disconnect / restore
    Exit Function
errHandler:
    ' report through TheExec error mechanism, never leave instruments connected
    If AbortTest Then Exit Function Else Resume Next
End Function
```
(The exact API is in the IG-XL help. In the interview, explain the steps, not exact signatures.)

**Q: What can go wrong in VBT programs (support-type issues)?**
- Instruments left in a bad state after an error (no cleanup), so the next test fails.
- Wrong settling time, which makes measurements flaky only on some testers.
- Hard-coded site numbers, which break when the site count changes.
- Debug prints/datalog left on, causing slow test time.
- Version differences after an IG-XL upgrade (deprecated APIs).
- 32/64-bit `Declare` issues in VBA.
- Excel itself: add-ins, macro security, corrupt workbook, references missing on another PC.

**Q: What is STDF?**
Standard Test Data Format, the binary datalog standard in semiconductor test. Records include MIR (lot info), PIR/PRR (part start/result with bin), PTR (parametric result), FTR (functional), and WIR/WRR (wafer). Used for yield analysis.
