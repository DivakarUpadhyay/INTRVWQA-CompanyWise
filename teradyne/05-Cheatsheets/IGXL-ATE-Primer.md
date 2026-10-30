# Primer – ATE and IG-XL in 10 minutes

> Built from public information. Confirm details in IG-XL help once you have access, and in the interview phrase specifics as "my understanding is…".

## The picture

```
 Test program (Excel workbook + VBT/.NET code)
              │  loaded by
              ▼
 IG-XL (Windows software on the tester PC) ──► Datalog (STDF) ──► yield analysis
              │  controls
              ▼
 Tester mainframe: instruments (digital pins, PPMU, DC sources, analog, RF)
              │  through
              ▼
 Load board / probe card ─► DUT(s): many sites in parallel
              ▲
 Handler (packaged parts, final test) or Prober (wafer, sort)
```

## Your 60-second explanation (practise aloud)
"A semiconductor tester applies voltages, currents and digital patterns to each chip and measures the responses to decide if it's good and which bin it goes into. On Teradyne's UltraFLEX and J750, the software is IG-XL. The test program is an Excel workbook: the pin map and channel map connect device pins to tester channels; specs, levels and time sets define voltages and timing; test instances choose a template and its parameters; and the flow table orders the tests and assigns bins. Custom test logic is written in VBT, which is VBA, or in .NET in newer versions, using objects like TheExec and TheHdw. Programs test many devices in parallel (multi-site) and write datalogs, usually STDF, for yield analysis. Test time is cost, and tester downtime stops production, so software quality and fast debugging really matter."

## Workbook sheets
Pin Map · Channel Map · DC Specs · AC Specs · Global Specs · Pin Levels · Time Sets · Test Instances · Flow Table · Bin Table · Job List · (Characterization, Patterns list, etc.)

## VBT keywords
`TheExec` (execution, flow, sites, datalog, limits) · `TheHdw` (instruments) · site-aware types (e.g. `SiteDouble`) · `PinList` / `PinListData` · `TestLimit` (judge + datalog) · active sites · templates · patterns

## Test types
Continuity (opens/shorts) → Leakage → IDD/IDDQ → DC parametric (PPMU) → Functional/patterns (scan, at-speed) → Analog/RF → Memory BIST → Trim/fuse

## Words to use naturally
DUT · load board/DIB · probe card · prober · handler · test cell · site · multi-site efficiency · bin (hard/soft) · yield · test time · pattern/vector · time set · levels (VIL/VIH/VOL/VOH) · shmoo · guardband · correlation · STDF · CP/wafer sort · FT/final test · OSAT · SLT

## Teradyne facts
- HQ North Reading, Massachusetts. Founded 1960.
- Semiconductor Test is the biggest segment: **UltraFLEX/UltraFLEXplus** (SoC, high-end), **J750** (high-volume low-cost), **IntegraFLEX**, **Magnum** (memory), **ETS** (analog/power, Eagle Test).
- Also: System Test, Wireless Test (LitePoint), Robotics (**Universal Robots** cobots, **MiR** mobile robots).
- Main competitor: **Advantest** (V93000 / SmarTest).
- Taiwan: big customer base (foundries, OSATs, fabless design houses); offices in Hsinchu.

## Your bridges
| Their world | Your experience |
|---|---|
| VBT (VBA) | VB.NET production code (Acer, IGI/Tecogis), Excel automation |
| IG-XL on Windows + .NET | 11 yrs Windows/.NET, COM interop, services |
| Customer line-down issues | Acer on-site production support, carrier EDI outages |
| Datalogs / yield | SSRS/SSIS pipelines; FactoryOS SPC (Cp/Cpk), OEE |
| Instruments / equipment | FactoryOS drivers: OPC UA, Modbus, MQTT, S7; IGI lab camera library |
