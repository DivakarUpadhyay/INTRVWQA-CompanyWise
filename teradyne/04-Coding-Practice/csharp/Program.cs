// Usage:
//   dotnet run                -> run self-tests for all drills
//   dotnet run -- crash|hang|leak|handles|spin|fileerror   -> debugging practice demos

using TeradyneDrills;

switch (args.FirstOrDefault()?.ToLowerInvariant())
{
    case "crash": DebugDemos.Crash(); return 0;
    case "hang": DebugDemos.Hang(); return 0;
    case "leak": DebugDemos.Leak(); return 0;
    case "handles": DebugDemos.Handles(); return 0;
    case "spin": DebugDemos.Spin(); return 0;
    case "fileerror": DebugDemos.FileError(); return 0;
}

int failed = 0;
void Check(string name, bool ok)
{
    Console.WriteLine($"{(ok ? "PASS" : "FAIL")}  {name}");
    if (!ok) failed++;
}

// Drill 1-2
Check("ReverseWords", Strings.ReverseWords("  test the   chip ") == "chip the test");
Check("ReverseWords empty", Strings.ReverseWords("   ") == "");
Check("Palindrome yes", Strings.IsPalindrome("A man, a plan, a canal: Panama"));
Check("Palindrome no", !Strings.IsPalindrome("UltraFLEX"));

// Drill 3
string[] log =
[
    "site,test,value,low,high",
    "0,IDD,1.20,1.0,1.5",
    "0,LEAK,0.5,0,1",
    "1,IDD,1.70,1.0,1.5",
    "1,LEAK,2.0,0,1",
    "2,IDD,1.10,1.0,1.5",
    "# comment",
    "2,LEAK,0.9,0,1",
    "3,IDD,1.30,1.0,1.5",
    "3,LEAK,1.1,0,1",
];
var data = Datalog.Parse(log);
var fails = Datalog.FailuresPerSite(data);
Check("Parse count", data.Count == 8);
Check("Failures per site", fails[0] == 0 && fails[1] == 2 && fails[2] == 0 && fails[3] == 1);
Check("Yield 50%", Math.Abs(Datalog.Yield(data) - 0.5) < 1e-9);

// Drill 4
var vdd = new DcSource("VDD", (site, v) => site == 2 ? v * 2 : v * 1.0);  // site 2 draws too much
var dig = new DigitalPins("DIG", site => site != 3);                     // site 3 fails pattern
var flow = new TestFlow(
[
    new TestStep("IDD", vdd, 1.2, 1.0, 1.5, FailBin: 5),
    new TestStep("Functional", dig, 0, 1, 1, FailBin: 7),
]);
var bins = flow.Run([0, 1, 2, 3]);
Check("Flow bins", bins[0] == 1 && bins[1] == 1 && bins[2] == 5 && bins[3] == 7);

// Drill 5
var counter = new BinCounter();
Parallel.For(0, 10_000, i => counter.Add(i % 3 == 0 ? 5 : 1));
Check("BinCounter thread-safe", counter[1] + counter[5] == 10_000 && counter[5] == 3334);

// Drill 6
Check("TwoSum", Algorithms.TwoSum([2, 7, 11, 15], 9) == (0, 1));
Check("BinarySearch", Algorithms.BinarySearch([1, 3, 5, 7, 9], 7) == 3 && Algorithms.BinarySearch([1, 3], 2) == -1);
Check("PopCount", Algorithms.PopCount(0b1011_0001) == 4);
Check("Bit ops", Algorithms.IsSet(Algorithms.Set(0, 5), 5) && Algorithms.Clear(0xFF, 0) == 0xFE);
var list = new Algorithms.Node(1) { Next = new Algorithms.Node(2) { Next = new Algorithms.Node(3) } };
var rev = Algorithms.Reverse(list);
Check("Reverse list", rev!.Value == 3 && rev.Next!.Value == 2 && rev.Next.Next!.Value == 1 && rev.Next.Next.Next == null);
Check("MovingAverage", Algorithms.MovingAverage([1, 2, 3, 4], 2).SequenceEqual([1.5, 2.5, 3.5]));

Console.WriteLine(failed == 0 ? "\nAll drills pass." : $"\n{failed} check(s) failed.");
return failed == 0 ? 0 : 1;
