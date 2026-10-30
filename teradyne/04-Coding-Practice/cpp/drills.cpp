// Teradyne interview C++ drills, with solutions.
// Build (Developer Command Prompt for VS):  cl /EHsc /std:c++17 /W4 drills.cpp && drills.exe
// Or run build.cmd in this folder.

#include <algorithm>
#include <cassert>
#include <cstdint>
#include <iostream>
#include <map>
#include <memory>
#include <sstream>
#include <string>
#include <vector>

// ---------------------------------------------------------------
// Drill 1: OOP + virtual destructor + smart pointers.
// Instruments behind an abstract base class, owned by unique_ptr.
// ---------------------------------------------------------------
class Instrument {
public:
    explicit Instrument(std::string name) : name_(std::move(name)) {}
    virtual ~Instrument() = default;                 // REQUIRED for delete via base pointer
    virtual void setup(double setting) { setting_ = setting; }
    virtual double measure(int site) const = 0;
    const std::string& name() const { return name_; }
protected:
    double setting_ = 0;
private:
    std::string name_;
};

class DcSource : public Instrument {
public:
    using Instrument::Instrument;
    double measure(int site) const override { return site == 2 ? setting_ * 2 : setting_; }
};

class DigitalPins : public Instrument {
public:
    using Instrument::Instrument;
    double measure(int site) const override { return site == 3 ? 0.0 : 1.0; }
};

struct TestStep {
    std::string name;
    Instrument* instrument;   // non-owning: the flow does not own instruments
    double setting, low, high;
    int failBin;
};

std::map<int, int> runFlow(const std::vector<TestStep>& steps, std::vector<int> active) {
    std::map<int, int> bins;
    for (const auto& step : steps) {
        step.instrument->setup(step.setting);
        // erase-remove idiom: drop failing sites while iterating safely
        active.erase(std::remove_if(active.begin(), active.end(), [&](int site) {
            double v = step.instrument->measure(site);
            if (v < step.low || v > step.high) { bins[site] = step.failBin; return true; }
            return false;
        }), active.end());
    }
    for (int site : active) bins[site] = 1;
    return bins;
}

// ---------------------------------------------------------------
// Drill 2: RAII wrapper (like a file/instrument handle). Rule of 5 via move-only.
// ---------------------------------------------------------------
class ScopedResource {
public:
    explicit ScopedResource(int& openCount) : count_(&openCount) { ++*count_; }
    ~ScopedResource() { if (count_) --*count_; }
    ScopedResource(const ScopedResource&) = delete;             // no copies: single owner
    ScopedResource& operator=(const ScopedResource&) = delete;
    ScopedResource(ScopedResource&& o) noexcept : count_(o.count_) { o.count_ = nullptr; }
    ScopedResource& operator=(ScopedResource&& o) noexcept {
        if (this != &o) { if (count_) --*count_; count_ = o.count_; o.count_ = nullptr; }
        return *this;
    }
private:
    int* count_;
};

// ---------------------------------------------------------------
// Drill 3: strings – reverse words in place, then split CSV.
// ---------------------------------------------------------------
std::string reverseWords(const std::string& s) {
    std::istringstream in(s);
    std::vector<std::string> words;
    for (std::string w; in >> w;) words.push_back(w);
    std::string out;
    for (auto it = words.rbegin(); it != words.rend(); ++it) {
        if (!out.empty()) out += ' ';
        out += *it;
    }
    return out;
}

std::vector<std::string> splitCsv(const std::string& line) {
    std::vector<std::string> parts;
    std::stringstream ss(line);
    for (std::string p; std::getline(ss, p, ',');) parts.push_back(p);
    return parts;
}

// ---------------------------------------------------------------
// Drill 4: bit manipulation (pin masks / registers).
// ---------------------------------------------------------------
int popCount(uint32_t v) { int c = 0; while (v) { v &= v - 1; ++c; } return c; }
uint32_t setBit(uint32_t m, int n) { return m | (1u << n); }
uint32_t clearBit(uint32_t m, int n) { return m & ~(1u << n); }
bool isPowerOfTwo(uint32_t v) { return v && !(v & (v - 1)); }

// ---------------------------------------------------------------
// Drill 5: reverse a singly linked list. Ownership is held by unique_ptr,
// so no node can leak or be freed twice (say this in the interview).
// ---------------------------------------------------------------
struct Node {
    int value;
    std::unique_ptr<Node> next;
};

std::unique_ptr<Node> reverse(std::unique_ptr<Node> head) {
    std::unique_ptr<Node> prev;
    while (head) {
        auto next = std::move(head->next);
        head->next = std::move(prev);
        prev = std::move(head);
        head = std::move(next);
    }
    return prev;
}

// ---------------------------------------------------------------
// Bug-spotting (talk through these in the interview; they are NOT called):
// ---------------------------------------------------------------
// int* bad1() { int x = 5; return &x; }                 // returns address of a local -> dangling
// void bad2() { int* a = new int[10]; delete a; }        // must be delete[] a;
// void bad3(std::vector<int>& v) { for (auto it = v.begin(); it != v.end(); ++it) if (*it == 0) v.erase(it); }
//                                                        // iterator invalidated after erase -> use it = v.erase(it)
// struct Base { ~Base(); };  struct D : Base { std::string s; };  Base* p = new D; delete p;  // no virtual dtor -> UB/leak
// char buf[8]; strcpy(buf, "UltraFLEXplus");             // buffer overrun -> 0xC0000409 / heap or stack corruption

int main() {
    // Drill 1
    auto vdd = std::make_unique<DcSource>("VDD");
    auto dig = std::make_unique<DigitalPins>("DIG");
    std::vector<TestStep> steps{
        {"IDD", vdd.get(), 1.2, 1.0, 1.5, 5},
        {"Functional", dig.get(), 0, 1, 1, 7},
    };
    auto bins = runFlow(steps, {0, 1, 2, 3});
    assert(bins[0] == 1 && bins[1] == 1 && bins[2] == 5 && bins[3] == 7);

    std::vector<std::unique_ptr<Instrument>> rack;
    rack.push_back(std::make_unique<DcSource>("VDD2"));
    rack.push_back(std::make_unique<DigitalPins>("DIG2"));
    assert(rack[1]->measure(0) == 1.0);       // polymorphic call, destroyed correctly via virtual dtor

    // Drill 2
    int open = 0;
    {
        ScopedResource a(open);
        ScopedResource b = std::move(a);
        assert(open == 1);
    }
    assert(open == 0);                        // released even though it was moved

    // Drill 3
    assert(reverseWords("  test the   chip ") == "chip the test");
    auto parts = splitCsv("0,IDD,1.2,1.0,1.5");
    assert(parts.size() == 5 && parts[1] == "IDD");

    // Drill 4
    assert(popCount(0b10110001) == 4);
    assert(clearBit(setBit(0, 5), 5) == 0);
    assert(isPowerOfTwo(64) && !isPowerOfTwo(65));

    // Drill 5
    auto head = std::make_unique<Node>(Node{1, std::make_unique<Node>(Node{2, std::make_unique<Node>(Node{3, nullptr})})});
    head = reverse(std::move(head));
    assert(head->value == 3 && head->next->value == 2 && head->next->next->value == 1 && !head->next->next->next);

    std::cout << "All C++ drills pass.\n";
    return 0;
}
