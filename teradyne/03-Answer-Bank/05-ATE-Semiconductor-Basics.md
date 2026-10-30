# Answer Bank 5 – ATE and Semiconductor Test Basics

You are not expected to be an ATE expert, since the JD lists it as "a plus". You are expected to sound curious and to have done your homework.

**Q: What is ATE?**
Automated Test Equipment: a system that applies signals (voltages, currents, digital patterns, RF, analog waveforms) to a chip, the **DUT (device under test)**, measures the responses, and decides pass/fail and which **bin** the part goes into. It runs thousands of tests per device in milliseconds to seconds, so **test time = cost**.

**Q: Where does testing happen in the flow?**
1. **Wafer sort / CP (chip probe)**: on the whole wafer, a **probe card** touches each die, and a **prober** moves the wafer. Bad dies are marked (wafer map, ink or electronic map).
2. Dies are cut, packaged (assembly at OSATs like ASE, SPIL, Amkor).
3. **Final test / FT**: packaged parts are tested, a **handler** picks and places them into sockets on a **load board** (DIB, device interface board).
4. Sometimes **SLT (system-level test)**, where the chip is tested in a real system. Teradyne also does SLT.

**Q: What kinds of tests?**
- **Continuity / opens-shorts**: are all pins connected? (Usually first, cheap, protects the tester.)
- **Leakage (IIL/IIH)**: tiny currents on input pins.
- **Power / IDD / IDDQ**: supply current in various modes.
- **DC parametric**: VOL/VOH, output voltages and currents with **PPMU** (per-pin parametric measurement unit).
- **Functional / digital**: run **patterns** (vectors) through the digital pins at speed and compare outputs with expected values.
- **Scan / ATPG**: structural tests of internal logic via scan chains.
- **Analog / mixed-signal / RF**: ADC/DAC linearity, PLL, SerDes, RF power.
- **Memory BIST / repair**.
- **Trim / fuse**: adjust analog values and burn fuses per chip.

**Q: What is binning?**
Each part ends in a **hard bin** (handler bin, physical) and a **soft bin** (detailed reason). Bin 1 is usually good. Speed binning puts faster parts in more expensive bins.

**Q: What is yield?**
Good parts / tested parts. Small yield changes are worth millions, so engineers watch yield per lot, wafer and **site**. A site that yields worse than the others usually means a hardware/contact problem, not the chip.

**Q: Multi-site?**
Testing 2, 4, 8 … up to hundreds of devices in parallel to cut cost. **Multi-site efficiency** measures how close it is to perfect parallelism. Software and VBT code must be site-aware.

**Q: Teradyne products to know**
| Product | Area |
|---|---|
| **UltraFLEX / UltraFLEXplus** | High-end SoC test (processors, mobile/AP, networking, AI chips), runs **IG-XL** |
| **J750 / J750Ex-HD** | High-volume, low-cost digital/microcontroller test, runs IG-XL |
| **IntegraFLEX** | IG-XL based mixed-signal/analog platform |
| **Magnum** | Memory test (DRAM, flash) |
| **ETS** (Eagle Test Systems) | Analog/power devices |
| **Titan / SLT** | System-level test |
| Universal Robots, MiR | Cobots and mobile robots (Teradyne Robotics) |

Teradyne's main competitor is **Advantest** (V93000 platform, SmarTest software). It is fine to mention you know the market has two big players.

**Q: Why does software matter so much in ATE?**
The tester is only as good as its test program. Software controls test time (cost), correlation between testers, datalogs for yield, and how fast customers can bring up new chips (**time to market**). A crash in IG-XL on a production floor stops a whole test cell, which is very expensive, so debugging skills are critical.

**Q: Common terms**
DUT, DIB/load board, probe card, prober, handler, test cell, pattern/vector, time set, levels (VIL, VIH, VOL, VOH), PPMU, DCVI/DCVS (DC source instruments), shmoo plot (pass/fail across voltage × frequency), guardband, correlation (golden units), STDF datalog, OSAT, CP/FT, test time, multi-site efficiency, yield, bin.

**Q: How does your FactoryOS experience relate?**
Same ideas at a different scale: collecting data from equipment (OPC UA, Modbus, MQTT, S7), real-time dashboards, SPC (control charts and Cp/Cpk, which are also used on parametric test data), OEE (availability × performance × quality; for a tester, downtime and test time are the cost), alarms and maintenance. You understand why uptime and throughput on a production floor matter.
