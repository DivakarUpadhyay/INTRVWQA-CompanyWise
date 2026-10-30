# Answer Bank 1 – C#, .NET, C++ and OOP

These are extra questions beyond the mock interview (Q17–Q27 there).

## C# / .NET

**Q: What is the CLR? JIT?**
The Common Language Runtime runs .NET code. It loads assemblies, verifies IL, JIT-compiles IL to native code method by method on first call, and manages memory (GC), exceptions, threads and security. Crash dumps of .NET apps need SOS because the CLR's data structures sit on top of native memory.

**Q: What is an assembly? The GAC?**
An assembly is a compiled unit (.dll/.exe) with IL + metadata + a manifest (name, version, culture, public key token). The Global Assembly Cache (in .NET Framework) holds strong-named shared assemblies. Version conflicts ("could not load file or assembly … or one of its dependencies") are solved with binding redirects in `app.config` and diagnosed with **Fusion Log Viewer (fuslogvw)**. .NET Core/5+ has no GAC and uses `deps.json`.

**Q: How does .NET talk to COM / Excel / native DLLs?**
- **COM interop**: a Runtime Callable Wrapper (RCW) wraps the COM object, so you release it with `Marshal.ReleaseComObject`/`FinalReleaseComObject`, otherwise Excel stays in Task Manager.
- **P/Invoke**: `[DllImport("x.dll")]` to call native C functions. Watch the calling convention, string marshalling (`CharSet`) and struct layout (`StructLayout`).
- **C++/CLI**: a mixed assembly that wraps native C++ classes for .NET.
IG-XL is a mix of Excel/VBA (COM), native code and .NET, so this matters.

**Q: `string` vs `StringBuilder`?**
Strings are immutable, so concatenating in a loop allocates every time. Use `StringBuilder` for building strings in loops (e.g. building a datalog line per site).

**Q: `const` vs `readonly` vs `static readonly`?**
`const` is compile-time and baked into callers (changing it requires recompiling callers). `readonly` is set in the constructor per instance. `static readonly` is set once per type at runtime.

**Q: What are delegates and events? Lambdas?**
A delegate is a type-safe function pointer (`Func<>`, `Action<>`). An event is a delegate that only the owner can raise, while others subscribe with `+=`. Remember to unsubscribe with `-=` to avoid leaks. Lambdas are inline anonymous functions and can capture variables (closures). Beware capturing loop variables in older C# `for` loops.

**Q: LINQ deferred execution?**
Most LINQ operators run only when enumerated. Enumerating twice runs the query twice (twice the DB calls or file reads). Use `.ToList()` to materialise once.

**Q: Exceptions best practice?**
Catch only what you can handle, keep the stack with `throw;` not `throw ex;`, use specific exception types, don't use exceptions for normal flow (slow), log with context, and add a global handler (`AppDomain.UnhandledException`, `TaskScheduler.UnobservedTaskException`) that writes a log before crash.

**Q: SOLID in one line each**
- **S**ingle responsibility – one reason to change.
- **O**pen/closed – extend by adding classes, not editing working code.
- **L**iskov – subclasses must work wherever the base works.
- **I**nterface segregation – small focused interfaces.
- **D**ependency inversion – depend on abstractions; inject them.

**Q: Design patterns you've used?**
Repository + Unit of Work (data access with Dapper), Strategy (protocol drivers in FactoryOS), Factory (creating the right driver from config), Observer (events / SignalR live updates), Singleton (via DI lifetime, not static), State (workflow/ATM), Adapter (wrapping carrier APIs FedEx/TNT behind one interface).

**Q: `Dispose` pattern code**
```csharp
public sealed class InstrumentSession : IDisposable
{
    private IntPtr _handle;          // unmanaged resource
    private bool _disposed;

    public void Dispose()
    {
        if (_disposed) return;
        NativeClose(_handle);
        _handle = IntPtr.Zero;
        _disposed = true;
        GC.SuppressFinalize(this);
    }
    ~InstrumentSession() => NativeClose(_handle);   // safety net only
    private static void NativeClose(IntPtr h) { /* ... */ }
}
```

## C++

**Q: Stack vs heap?**
Stack: automatic, fast, freed at scope end, limited size (default 1 MB on Windows, so deep recursion causes stack overflow `0xC00000FD`). Heap: `new`/`delete` or smart pointers, lifetime controlled by you, slower, can fragment or leak.

**Q: `new/delete` vs `malloc/free`?**
`new` calls constructors and is type-safe. `malloc` only allocates bytes. Never mix them (`delete` on `malloc` memory = undefined behaviour). Use `delete[]` for arrays from `new[]`.

**Q: Rule of 3 / 5 / 0?**
If a class manages a resource and defines one of destructor, copy constructor or copy assignment, it needs all three (Rule of 3). Add move constructor and move assignment (Rule of 5). Best: use RAII members (`unique_ptr`, `vector`) so you need none of them (Rule of 0).

**Q: What is a vtable?**
Each class with virtual functions has a table of function pointers, and each object has a hidden pointer (vptr) to its class's table. A virtual call looks up the function at runtime. In WinDbg, `dps` on an object's first pointer shows its vtable, which is useful to identify a corrupted or already-freed object.

**Q: `const` correctness?**
`const T&` parameters to avoid copies and promise no change. `const` member functions don't modify the object. It helps the compiler and readers.

**Q: `std::vector` vs `std::list`?**
`vector`: contiguous, cache-friendly, fast random access, amortised O(1) push_back. Inserting in the middle is O(n), and iterators are invalidated on reallocation, a classic crash. `list`: O(1) insert anywhere but poor cache use. Default to `vector`.

**Q: Undefined behaviour examples**
Reading uninitialised variables, out-of-bounds access, use-after-free, signed integer overflow, data races, returning a reference to a local. These often "work" in Debug and crash in Release.

**Q: Debug vs Release crash differences?**
Debug initialises memory with patterns (`0xCCCCCCCC` uninitialised stack, `0xCDCDCDCD` uninitialised heap, `0xDDDDDDDD` freed heap, `0xFEEEFEEE` freed by HeapFree). Seeing these values in a register in a dump tells you what happened. Release optimises, so variables may be missing in the debugger.

## OOP-style coding question to practise

"Model test instruments: there are DC sources and digital pins. Each can `Setup()` and `Measure()`. Run a list of tests per site and bin the parts." → solved in `04-Coding-Practice/csharp/Program.cs` (Drill 4) and `04-Coding-Practice/cpp/drills.cpp`.
