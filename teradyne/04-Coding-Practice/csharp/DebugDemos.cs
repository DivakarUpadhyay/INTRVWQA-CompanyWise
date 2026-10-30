// Small faulty programs to practise WinDbg / ProcDump / DebugDiag / Sysinternals.
// See ../../05-Cheatsheets/WinDbg-Sysinternals.md for the exact steps.

using Microsoft.Win32.SafeHandles;

namespace TeradyneDrills;

public static class DebugDemos
{
    private static readonly object LockA = new();
    private static readonly object LockB = new();
    private static readonly List<byte[]> Cache = new();          // leak: grows forever

    // Unhandled exception after a few calls -> crash dump with procdump -e
    public static void Crash()
    {
        Console.WriteLine($"PID {Environment.ProcessId}. Crashing in 10 seconds (attach procdump -e -ma now)...");
        Thread.Sleep(10_000);
        var instrument = FindInstrument("PPMU_7");
        Console.WriteLine(instrument!.Length);                    // NullReferenceException
    }

    private static string? FindInstrument(string name) => name == "PPMU_1" ? "found" : null;

    // Classic lock-order deadlock -> hang dump, then !syncblk / ~*e !clrstack
    public static void Hang()
    {
        Console.WriteLine($"PID {Environment.ProcessId}. Two threads will deadlock now. Take a dump (procdump -ma {Environment.ProcessId}).");
        var t1 = new Thread(() => { lock (LockA) { Thread.Sleep(500); lock (LockB) { } } }) { Name = "SiteWorker-1" };
        var t2 = new Thread(() => { lock (LockB) { Thread.Sleep(500); lock (LockA) { } } }) { Name = "SiteWorker-2" };
        t1.Start(); t2.Start();
        t1.Join(); t2.Join();                                     // never returns
    }

    // Managed memory leak -> two dumps, compare !dumpheap -stat, then !gcroot
    public static void Leak()
    {
        Console.WriteLine($"PID {Environment.ProcessId}. Leaking ~10 MB/s. Watch Private Bytes in Process Explorer. Ctrl+C to stop.");
        while (true)
        {
            Cache.Add(new byte[1_000_000]);
            Thread.Sleep(100);
            if (Cache.Count % 50 == 0) Console.WriteLine($"{Cache.Count} MB held");
        }
    }

    // Handle leak -> Process Explorer "Handles" column, handle.exe -s -p <pid>
    public static void Handles()
    {
        Console.WriteLine($"PID {Environment.ProcessId}. Leaking event handles. Ctrl+C to stop.");
        var leaked = new List<SafeWaitHandle>();
        while (true)
        {
            leaked.Add(new EventWaitHandle(false, EventResetMode.ManualReset).SafeWaitHandle);   // never disposed
            Thread.Sleep(10);
            if (leaked.Count % 500 == 0) Console.WriteLine($"{leaked.Count} handles");
        }
    }

    // High CPU spin -> Process Explorer threads tab, !runaway
    public static void Spin()
    {
        Console.WriteLine($"PID {Environment.ProcessId}. One thread spinning at 100% of a core. Ctrl+C to stop.");
        var t = new Thread(() => { long x = 0; while (true) x++; }) { Name = "BusyPoller", IsBackground = true };
        t.Start();
        t.Join();
    }

    // File access failure -> Process Monitor, filter Result is not SUCCESS
    public static void FileError()
    {
        var path = @"C:\Teradyne\Programs\Missing.cfg";
        Console.WriteLine($"PID {Environment.ProcessId}. Trying to read {path} every 2 s. Find it in Process Monitor.");
        while (true)
        {
            try { File.ReadAllText(path); }
            catch (Exception ex) { Console.WriteLine(ex.GetType().Name + ": " + ex.Message); }
            Thread.Sleep(2000);
        }
    }
}
