// Teradyne interview coding drills, with solutions.
// Try each one yourself first (problem text is in ../PROBLEMS.md), then compare.

using System.Text;

namespace TeradyneDrills;

// ---------------------------------------------------------------
// Drill 1: Reverse the words in a sentence without using Split/Reverse helpers.
// "test the chip" -> "chip the test"
// ---------------------------------------------------------------
public static class Strings
{
    public static string ReverseWords(string s)
    {
        if (string.IsNullOrWhiteSpace(s)) return string.Empty;
        var sb = new StringBuilder();
        int end = s.Length - 1;
        while (end >= 0)
        {
            while (end >= 0 && s[end] == ' ') end--;          // skip spaces
            if (end < 0) break;
            int start = end;
            while (start >= 0 && s[start] != ' ') start--;    // find word start
            if (sb.Length > 0) sb.Append(' ');
            sb.Append(s, start + 1, end - start);
            end = start;
        }
        return sb.ToString();
    }

    // Drill 2: is a string a palindrome, ignoring case and non-alphanumerics?
    public static bool IsPalindrome(string s)
    {
        int i = 0, j = s.Length - 1;
        while (i < j)
        {
            if (!char.IsLetterOrDigit(s[i])) { i++; continue; }
            if (!char.IsLetterOrDigit(s[j])) { j--; continue; }
            if (char.ToLowerInvariant(s[i]) != char.ToLowerInvariant(s[j])) return false;
            i++; j--;
        }
        return true;
    }
}

// ---------------------------------------------------------------
// Drill 3: Parse a datalog CSV ("site,test,value,low,high") and return,
// per site, the number of failures, plus the overall yield.
// ---------------------------------------------------------------
public record Measurement(int Site, string Test, double Value, double Low, double High)
{
    public bool Pass => Value >= Low && Value <= High;
}

public static class Datalog
{
    public static List<Measurement> Parse(IEnumerable<string> lines)
    {
        var result = new List<Measurement>();
        foreach (var raw in lines)
        {
            var line = raw.Trim();
            if (line.Length == 0 || line.StartsWith('#') || line.StartsWith("site", StringComparison.OrdinalIgnoreCase))
                continue;                                             // blank, comment, header
            var p = line.Split(',');
            if (p.Length != 5) throw new FormatException($"Bad line: '{line}'");
            result.Add(new Measurement(
                int.Parse(p[0]), p[1].Trim(),
                double.Parse(p[2], System.Globalization.CultureInfo.InvariantCulture),
                double.Parse(p[3], System.Globalization.CultureInfo.InvariantCulture),
                double.Parse(p[4], System.Globalization.CultureInfo.InvariantCulture)));
        }
        return result;
    }

    public static Dictionary<int, int> FailuresPerSite(IEnumerable<Measurement> data) =>
        data.GroupBy(m => m.Site)
            .ToDictionary(g => g.Key, g => g.Count(m => !m.Pass));

    // A site (device) passes only if all its tests pass.
    public static double Yield(IEnumerable<Measurement> data)
    {
        var sites = data.GroupBy(m => m.Site).ToList();
        if (sites.Count == 0) return 0;
        return (double)sites.Count(g => g.All(m => m.Pass)) / sites.Count;
    }
}

// ---------------------------------------------------------------
// Drill 4: OOP – model instruments and a multi-site test flow with binning.
// ---------------------------------------------------------------
public interface IInstrument
{
    string Name { get; }
    void Setup(double setting);
    double Measure(int site);
}

public abstract class InstrumentBase : IInstrument
{
    protected double Setting;
    public string Name { get; }
    protected InstrumentBase(string name) => Name = name;
    public virtual void Setup(double setting) => Setting = setting;
    public abstract double Measure(int site);
}

// Simulated instruments: return deterministic values per site so tests are repeatable.
public sealed class DcSource(string name, Func<int, double, double> response) : InstrumentBase(name)
{
    public override double Measure(int site) => response(site, Setting);
}

public sealed class DigitalPins(string name, Func<int, bool> patternPasses) : InstrumentBase(name)
{
    public override double Measure(int site) => patternPasses(site) ? 1 : 0;
}

public sealed record TestStep(string Name, IInstrument Instrument, double Setting, double Low, double High, int FailBin);

public sealed class TestFlow(IReadOnlyList<TestStep> steps)
{
    public const int PassBin = 1;

    // Runs all steps on all sites. A site that fails is removed from later steps
    // (like a tester disabling a failed site) and gets the fail bin of the first failing test.
    public Dictionary<int, int> Run(IEnumerable<int> sites)
    {
        var bins = new Dictionary<int, int>();
        var active = new List<int>(sites);
        foreach (var step in steps)
        {
            step.Instrument.Setup(step.Setting);           // set up once for all sites
            foreach (var site in active.ToList())
            {
                var v = step.Instrument.Measure(site);
                if (v < step.Low || v > step.High)
                {
                    bins[site] = step.FailBin;
                    active.Remove(site);
                }
            }
        }
        foreach (var site in active) bins[site] = PassBin;
        return bins;
    }
}

// ---------------------------------------------------------------
// Drill 5: Thread-safe counter of results per bin from many threads.
// ---------------------------------------------------------------
public sealed class BinCounter
{
    private readonly System.Collections.Concurrent.ConcurrentDictionary<int, int> _counts = new();
    public void Add(int bin) => _counts.AddOrUpdate(bin, 1, (_, c) => c + 1);
    public int this[int bin] => _counts.TryGetValue(bin, out var c) ? c : 0;
}

// ---------------------------------------------------------------
// Drill 6: Classic algorithms they may ask.
// ---------------------------------------------------------------
public static class Algorithms
{
    // Two-sum: indices of two numbers adding up to target, O(n).
    public static (int, int)? TwoSum(int[] nums, int target)
    {
        var seen = new Dictionary<int, int>();
        for (int i = 0; i < nums.Length; i++)
        {
            if (seen.TryGetValue(target - nums[i], out var j)) return (j, i);
            seen[nums[i]] = i;
        }
        return null;
    }

    // Binary search on a sorted array, returns index or -1.
    public static int BinarySearch(int[] a, int x)
    {
        int lo = 0, hi = a.Length - 1;
        while (lo <= hi)
        {
            int mid = lo + (hi - lo) / 2;                  // avoids overflow
            if (a[mid] == x) return mid;
            if (a[mid] < x) lo = mid + 1; else hi = mid - 1;
        }
        return -1;
    }

    // Count set bits (common in pin-mask / register questions).
    public static int PopCount(uint v)
    {
        int c = 0;
        while (v != 0) { v &= v - 1; c++; }                // clear lowest set bit
        return c;
    }

    // Is bit n set in a mask? Set/clear it.
    public static bool IsSet(uint mask, int n) => (mask & (1u << n)) != 0;
    public static uint Set(uint mask, int n) => mask | (1u << n);
    public static uint Clear(uint mask, int n) => mask & ~(1u << n);

    // Reverse a singly linked list.
    public sealed class Node(int value) { public int Value = value; public Node? Next; }

    public static Node? Reverse(Node? head)
    {
        Node? prev = null;
        while (head != null)
        {
            var next = head.Next;
            head.Next = prev;
            prev = head;
            head = next;
        }
        return prev;
    }

    // Moving average of the last k values (e.g. smoothing a measurement).
    public static double[] MovingAverage(double[] values, int k)
    {
        if (k <= 0 || k > values.Length) return [];
        var result = new double[values.Length - k + 1];
        double sum = 0;
        for (int i = 0; i < values.Length; i++)
        {
            sum += values[i];
            if (i >= k) sum -= values[i - k];
            if (i >= k - 1) result[i - k + 1] = sum / k;
        }
        return result;
    }
}
