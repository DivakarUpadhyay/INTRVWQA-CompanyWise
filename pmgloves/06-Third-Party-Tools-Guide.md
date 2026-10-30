# Third-Party Tools Guide — what, why, how, demo, interview script

Tools in the JD: **BorG BPM · Automation 360 · Power BI · n8n · Dify · Git**

Each section: **What it is → Why companies use it → How it is used → Demo project → How to explain it in the interview.**

> **Golden rule for the interview:** never claim production experience you don't have. Say *"I haven't used X in production, but I built a demo to learn it. Here's what I built and what I learned."* Interviewers respect that far more than a bluff, especially at a company with low-difficulty, conversation-style interviews.

---

## 0. One demo that covers everything (recommended)

Instead of 6 separate toy projects, build **one small system** that tells one story a glove company understands:

### `Divakar.GloveOps` — Sample-Request & Quality Portal
| Part | Tool | What it does in the story |
|---|---|---|
| Core web app | **.NET Core MVC + Dapper + MSSQL + jQuery** | A customer **sample request** form (product, size, material NBR/PVC/TPE, qty, customer, country). List, detail and edit pages |
| E-form approval | **BPM concept** (built in MVC, standing in for BorG) | Sales → Sales Manager → QA → Plant approval steps, with send-back, delegate and history |
| Notifications & integration | **n8n** | On approval, a webhook goes to n8n, which emails or Telegrams the plant and writes a log row to SQL |
| Bot | **Automation 360** | Reads an Excel file of 20 sample requests and types them into the MVC form (simulating a legacy system with no API) |
| Dashboard | **Power BI** | Requests by country and material, approval lead time, plant output vs defect rate |
| AI assistant | **Dify** | A chatbot that answers "Which glove is suitable for chemotherapy?" from product spec PDFs, embedded in the MVC app |
| Source control | **Git/GitHub** | Feature branches, PRs, tags, a README with architecture diagram, GitHub Actions build |

**Why this wins:** in the interview you can say *"I built a mini version of the system your team runs"*. That's a concrete conversation, not theory.

**Suggested build order (about 7–10 evenings):**
1. MVC + Dapper + SQL CRUD (1–2 days)
2. Approval workflow (1 day)
3. n8n webhook + email (½ day)
4. Power BI dashboard (1 day)
5. Dify chatbot + C# API call (1 day)
6. Automation 360 bot (1 day)
7. README, screenshots, a short screen recording (½ day)

Folder suggestion: `D:\Divakar-Apps\Divakar.GloveOps` (own GitHub repo, public, with **no** PM Gloves logo or real company data, only fake sample data).

---

## 1. BorG BPM (e-form & approval system, written "Brog" in the JD)

### What it is
A **Taiwanese BPM / e-form approval (電子表單簽核) system**, BorG SPM, with a mobile app called *BorG MFlow*. BPM = **Business Process Management**: turning paper or Excel forms and email approvals into digital forms with **routing rules**. Similar products used in Taiwan: UOF (一等一), Flowring Agentflow, EasyFlow (鼎新). Globally: Power Automate Approvals, Camunda, Nintex.

### Why companies use it
- Paper and email approvals are slow, get lost, and leave no audit trail.
- Medical device companies (ISO 13485, FDA) **must prove who approved what and when**.
- Managers can approve on a phone, even while at the Vietnam plant.
- Reports show where approvals are stuck.

### How it is used (and what a developer does)
- **Business users** fill in forms: leave, purchase request, sample request, quality deviation, price approval, new customer.
- **Developers (you):**
  1. Design the **form**: fields, validation, default values (e.g. pull the applicant's department from HR data).
  2. Configure the **flow**: steps, approvers by role or department, conditions (amount > NT$100k goes to the GM).
  3. Write **scripts/APIs**: on submit or approve, call an API, query SQL, push data to SAP or another system.
  4. Build **reports** on form data in SQL.
- Key approval terms (useful in Taiwan): **會簽** parallel countersign · **加簽** add an approver · **退回** send back · **撤回** withdraw · **代理人** delegate · **知會** notify only · **逾時提醒** timeout reminder.

### Demo project
BorG isn't freely downloadable, so **build the BPM concept yourself** in the GloveOps MVC app:
- Tables:
  ```sql
  FormInstance(Id, FormType, ApplicantId, Status, CurrentStep, CreatedAt)
  FlowStep(FormType, StepNo, StepName, ApproverRole, ConditionSql)
  ApprovalTask(Id, FormId, StepNo, ApproverId, DelegateId, Status, ActedAt, Comment)
  ApprovalHistory(Id, FormId, StepNo, UserId, Action, Comment, ActedAt)   -- audit trail
  ```
- Statuses: Draft → Submitted → InApproval → Approved / Rejected / SentBack.
- Features: My Tasks inbox, Approve / Reject / Send Back buttons (jQuery AJAX), delegate while on leave, full history timeline, a condition ("qty > 10,000 boxes needs the Plant Manager").
- Stored procedure `usp_ApproveTask` with a transaction: close the current task, insert history, create the next task or mark the form Approved.

### How to explain in the interview (about 45 sec)
> "BPM digitises paper and email approvals into e-forms with routing rules, so every approval is traceable. That matters for a medical company under ISO 13485. I haven't used BorG specifically, but I built the same concept in .NET MVC with Dapper: form instances, flow steps, approval tasks, send-back, delegates and a full audit history, with the approve action in a transactional stored procedure. BPM products like BorG are usually extended with form design, scripts, SQL and API calls, so I'd be productive quickly. I'd especially like to integrate approved forms with SAP or other systems through APIs or n8n."

**Likely follow-ups:** *How do you handle a rejected form?* (status SentBack, return to applicant, keep history) · *Approver on leave?* (delegate table checked when creating the task) · *Parallel approval?* (create several tasks for one step; move on when all, or any one, are done).

---

## 2. Automation 360 (Automation Anywhere RPA)

### What it is
**Automation Anywhere's cloud RPA platform.** RPA = Robotic Process Automation: **software bots that use apps the way a human does**: click, type, read screens, copy between Excel and SAP, download files, send emails.

Parts:
- **Control Room**: web portal to build, schedule and monitor bots.
- **Bot Agent**: installed on the PC or VM where bots run.
- **Bot Editor**: drag-and-drop actions (Excel, Browser, Recorder, Email, Loop, If, Error handler, SAP, PDF, REST).
- **Attended** bot (a person triggers it on their PC) vs **unattended** bot (runs by schedule on a server).
- **Credential Vault**: stores passwords securely.
- **Document Automation (IQ Bot)**: reads invoices or POs from PDFs.

### Why companies use it
- Many systems (**SAP GUI**, old Web Forms, bank portals, customs or shipping sites) **have no API**.
- Repetitive work (entering 200 orders, downloading daily reports) wastes staff hours and causes typing errors.
- Faster than building a full integration. Business value comes in weeks.
- **Downside:** fragile when the UI changes. Prefer API or DB integration when available.

### How it is used at a manufacturer
- Enter customer POs from Excel or email into SAP sales orders.
- Download bank statements or exchange rates daily and upload them to finance.
- Consolidate Excel production reports from 6 plants into one file and email it.
- Check shipping or container tracking websites and update ETA in the system.
- Read supplier invoices (PDF) and post them.

### Demo project
1. Sign up for **Automation Anywhere Community Edition** (free). Install the Bot Agent and the Chrome extension.
2. Bot **"SampleRequestEntryBot"**:
   - Open `SampleRequests.xlsx` (20 rows).
   - Loop through each row and open the GloveOps MVC form in Chrome.
   - Use Recorder/Browser actions to type the fields and click Submit.
   - Capture the new request number from the page and write it back to Excel.
   - Try/Catch: on error, take a screenshot, mark the row "Failed" and continue.
   - At the end, email a summary: "18 success / 2 failed".
3. Bonus: a scheduled bot that downloads the daily exchange rate from a public site and saves it to Excel/SQL.
4. Record a 1-minute screen video for your portfolio.

### How to explain in the interview (about 45 sec)
> "Automation 360 is Automation Anywhere's cloud RPA: bots that operate applications like a person, which is useful where there's no API, such as SAP GUI or legacy pages. You build bots in the Control Room, run them on a Bot Agent, attended or unattended, and keep passwords in the Credential Vault. In my demo, a bot reads 20 sample requests from Excel, enters them into my MVC app, writes the generated numbers back, handles errors with screenshots, and emails a summary. My rule: if a system has an API or DB access, integrate directly. Use RPA for UI-only systems, and make bots robust with waits, retries, logging and alerts."

**Follow-ups:** *Bot breaks when the UI changes?* (stable selectors, object cloning, version control, monitoring) · *Attended vs unattended?* · *RPA vs API?*

---

## 3. Power BI

### What it is
**Microsoft's business intelligence tool** for building interactive dashboards and reports.
- **Power BI Desktop** (free, Windows): connect to data, model it, build reports.
- **Power BI Service** (cloud): publish, share, schedule refresh, set up access.
- **Power Query (M)**: clean and transform data.
- **DAX**: formulas for measures (KPIs).
- **On-premises Data Gateway**: lets the cloud refresh data from an internal SQL Server.

### Why companies use it
- Management wants **one live view** of sales, production, quality and inventory across plants, instead of 20 Excel files.
- Self-service: users filter and drill down themselves.
- Integrates with Excel, Teams and SQL Server, and Microsoft licences often already include it.
- **Row-Level Security**: each plant manager sees only their own plant.

### How it is used at a glove manufacturer
KPIs: output per line per day · **defect rate / AQL fail rate (pinholes)** · OEE · sales by country, customer and material · on-time delivery · inventory days · raw material cost (NBR, PVC) · sample-request lead time.
Developer tasks: create **SQL views or stored procedures** for reports, design a **star schema**, write DAX measures, set up the gateway and refresh, set up RLS, sometimes **embed reports in the internal MVC portal**.

### Demo project
1. In SQL Server, create a small **star schema** with fake data (a script that generates about 50k rows):
   - Facts: `FactProduction(DateKey, PlantKey, ProductKey, LineNo, OutputBoxes, DefectBoxes)` and `FactSales(DateKey, CustomerKey, ProductKey, Boxes, AmountUSD)`
   - Dimensions: `DimDate`, `DimPlant` (Tainan, China, Vietnam), `DimProduct` (NBR / PVC / TPE / Cleanroom, size S–XL), `DimCustomer` (country)
2. In Power BI Desktop: Import mode, set relationships, then DAX measures:
   ```DAX
   Total Output = SUM(FactProduction[OutputBoxes])
   Defect Rate % = DIVIDE(SUM(FactProduction[DefectBoxes]), [Total Output])
   Sales YTD = TOTALYTD(SUM(FactSales[AmountUSD]), DimDate[Date])
   Sales vs LY % = DIVIDE([Sales YTD] - CALCULATE([Sales YTD], SAMEPERIODLASTYEAR(DimDate[Date])), CALCULATE([Sales YTD], SAMEPERIODLASTYEAR(DimDate[Date])))
   ```
3. Three pages: **Executive overview** (KPI cards, sales trend, map), **Production & Quality** (output vs defect by plant and line), **Sample Requests** (from the GloveOps DB: count, approval lead time).
4. RLS: add a mapping table `UserPlant(UserEmail, PlantKey)` related to `DimPlant`. Create a role "PlantManager" with the filter `UserPlant[UserEmail] = USERPRINCIPALNAME()`. Demonstrate it with "View as role".
5. Save the `.pbix` and screenshots to GitHub.

### How to explain in the interview (about 45 sec)
> "Power BI turns data into interactive dashboards. I use Power Query for cleaning, a star schema for modelling, DAX for KPIs, and the on-premises gateway to refresh from SQL Server. My demo is a glove-plant dashboard: output and defect rate by plant and line, sales by country and material, and year-over-year growth, with row-level security so each plant manager sees only their plant. As a developer, I put heavy logic into SQL views and stored procedures so reports stay fast, and I can embed reports in the internal MVC portal."

**Follow-ups:** *Import vs DirectQuery?* (Import is fast and cached but needs refresh; DirectQuery is live but slower) · *Measure vs calculated column?* · *Report is slow?* (aggregate in SQL, fewer visuals, avoid bi-directional relationships).

---

## 4. n8n

### What it is
An **open-source, self-hostable workflow automation tool**, like Zapier or Make, but you can run it on your own server (Docker). You build flows visually from **nodes**:
- **Triggers**: Webhook, Schedule (cron), Email received, new SQL row, form.
- **Actions**: HTTP Request (any REST API), Microsoft SQL, Email, Teams, Slack, Telegram, Google Sheets, OpenAI, Code (JavaScript/Python), IF, Switch, Merge, Loop.
- Credentials are stored encrypted. Error workflows. Executions are logged.

### Why companies use it
- **Glue between systems** (BPM ↔ SQL ↔ SAP API ↔ email/Teams) without writing a whole C# service each time.
- Self-hosted, so **data stays inside the company**. That matters for a medical company.
- Fast to change; IT can build integrations in hours.
- Has AI nodes (LLM, agents) and works well with Dify.
- **n8n vs RPA vs C#:** n8n for API-to-API integration and notifications; RPA for UI-only systems; C# for core business logic and complex or high-volume processing.

### How it is used at a manufacturer
- When a BPM form is approved: write to SQL, call the SAP API, and notify the plant on Teams.
- Every morning at 8:00: query yesterday's production from SQL and email a summary to managers.
- A new email with a PO attached: save the file, extract data with AI, create a draft order.
- Sync master data (customers, products) between systems overnight.

### Demo project
1. Run n8n locally: `npx n8n` or `docker run -it --rm -p 5678:5678 docker.n8n.io/n8nio/n8n`, then open `http://localhost:5678`.
2. **Flow A — Approval notification:**
   - GloveOps MVC calls the webhook after the final approval:
     ```csharp
     await _http.PostAsJsonAsync(_n8nWebhookUrl, new { requestNo, customer, product, qty, plant, approvedBy });
     ```
   - n8n: **Webhook** → **IF** (qty > 10,000 → high priority) → **Microsoft SQL** (insert into `IntegrationLog`) → **Send Email / Telegram** to the plant → **Respond to Webhook** `{ ok: true }`.
3. **Flow B — Daily report:** **Schedule** 08:00 → **Microsoft SQL** query of yesterday's output and defects → **Code** node to build an HTML table → **Email**.
4. **Flow C — AI** (bonus): new request → **HTTP Request** to the Dify API → AI suggests a suitable glove model → add the suggestion as a comment.
5. Export the workflows as JSON and commit them to Git (`/n8n-workflows`).

### How to explain in the interview (about 45 sec)
> "n8n is an open-source workflow automation tool, like Zapier but self-hosted, so company data stays inside. You chain nodes: a webhook or schedule trigger, then SQL, HTTP APIs, email, Teams or AI. In my demo, when a sample request is fully approved in my MVC app, it calls an n8n webhook. n8n checks priority, logs to SQL Server and notifies the plant. Another flow sends a daily production summary at 8 am. I export workflows as JSON into Git for version control. I use n8n for integration glue, RPA only for systems without APIs, and C# for core business logic."

**Follow-ups:** *Securing webhooks?* (header auth/secret, internal network only, HTTPS) · *Error handling?* (Error Trigger workflow, retries, alert email) · *Why not just C#?* (speed of change, visual flows anyone in IT can maintain).

---

## 5. Dify

### What it is
An **open-source LLM application platform**, used to build AI apps without writing all the plumbing:
- **Chatbot / Agent / Workflow / Text generator** app types.
- **Knowledge base (RAG)**: upload PDFs and Word files. Dify chunks them, creates embeddings and retrieves relevant parts for each question.
- Works with many models (OpenAI, Claude, Azure OpenAI, Gemini, local models through Ollama).
- **Prompt orchestration**, variables, tools (web search, HTTP, code), logs and annotation.
- **API for every app**, so your C# system can call it. Can be self-hosted with Docker or used on Dify Cloud.

### Why companies use it
- Staff waste time searching SOPs, ISO procedures, product specs and certificates.
- **Self-hosting keeps confidential documents inside the company.**
- IT can build and adjust AI apps quickly; business users can manage the knowledge base.
- One platform for many AI use cases with logs and access control.

### How it is used at a glove manufacturer
- **Product spec assistant**: "Which glove passes ASTM D6978 for chemo drugs? What's the thickness of model X?"
- **SOP / ISO 13485 / HR policy Q&A** bot for employees (in Chinese, English and Vietnamese).
- Draft customer email replies or quotations; summarise complaint or QC reports.
- Workflows that extract fields from PO PDFs into JSON for the order system.

### Demo project
1. Use **Dify Cloud** (free sandbox), or self-host: `git clone https://github.com/langgenius/dify` → `cd dify/docker` → `cp .env.example .env` → `docker compose up -d` → open `http://localhost/install`.
2. Add a model provider (your API key).
3. **Knowledge base:** write 5–6 fake product spec sheets (NBR exam glove, chemo-rated NBR, PVC food glove, TPE, cleanroom glove) plus a short FAQ. Upload them and choose the chunk settings.
4. **Chatbot app "Glove Advisor":** system prompt — *"Answer only from the knowledge base. Cite the document. If unsure, say you don't know. Reply in the user's language."*
5. **Call it from C#** (GloveOps "Ask AI" page, jQuery chat box):
   ```csharp
   var req = new HttpRequestMessage(HttpMethod.Post, "https://api.dify.ai/v1/chat-messages");
   req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _difyApiKey);
   req.Content = JsonContent.Create(new {
       inputs = new { }, query = question, response_mode = "blocking",
       conversation_id = conversationId ?? "", user = User.Identity!.Name
   });
   var res = await _http.SendAsync(req);
   var json = await res.Content.ReadFromJsonAsync<JsonElement>();
   string answer = json.GetProperty("answer").GetString()!;
   ```
6. Show a test: ask in English and Chinese, and show it refusing an off-topic question.

### How to explain in the interview (about 60 sec)
> "Dify is an open-source platform for building LLM apps: chatbots, agents and workflows, with a built-in knowledge base for RAG. RAG means splitting documents into chunks, storing embeddings, retrieving the most relevant parts for each question and giving them to the model, so answers come from company documents, not guesses. In my demo I built a 'Glove Advisor' over product spec sheets and called it from my .NET MVC app through Dify's REST API with a jQuery chat box. It answers in English or Chinese and cites the source. For a medical company I'd self-host Dify to keep documents private, restrict the bot to the knowledge base to reduce hallucination, and log conversations for review. Good use cases here: an SOP and ISO assistant, product spec Q&A, and extracting PO data from PDFs."

**Follow-ups:** *RAG vs fine-tuning?* (RAG for changing documents, cheaper, easy to update; fine-tuning for style or format) · *Hallucination?* (only-from-context prompt, citations, low temperature, human review) · *Data security?* (self-host, private model, access control, no sensitive personal data).

---

## 6. Git

### What it is
A **distributed version control system**. It tracks every change to code, lets many developers work in parallel on branches, and merges their work. Hosted on GitHub, GitLab, Azure DevOps or Bitbucket.

### Why companies use it
- History and **rollback** of every change; you can see who changed what and why.
- **Parallel work** with branches, plus **code review** through pull requests.
- Foundation for **CI/CD** (automatic build, test, deploy).
- The JD says "proficient", so expect practical questions.

### How it is used day to day
```bash
git pull                                   # get latest
git switch -c feature/sample-request-approval
git add . && git commit -m "Add approval step for QA"
git push -u origin feature/sample-request-approval   # then open a Pull Request
# after review → merge to main/develop → tag release
git tag v1.2.0 && git push --tags
```
Also useful: `git stash`, `git rebase` (on local branches only), `git cherry-pick` (a hotfix), `git revert` (undo on a shared branch), `git log --oneline --graph`, resolving conflicts, `.gitignore` for `bin/ obj/ appsettings.Development.json`.

### Demo project
Use the **GloveOps repo itself** as the Git demo:
- `main` + `develop` + `feature/*` branches, with PRs merged with descriptions.
- A **GitHub Actions** workflow `.github/workflows/build.yml` that runs `dotnet build` and `dotnet test` on every PR.
- **Tags** `v0.1`–`v1.0` and a `CHANGELOG.md`.
- **README** with an architecture diagram, setup steps, screenshots and links to each tool demo (JD point: documentation the team can edit).
- n8n workflow JSON and the Power BI `.pbix` are versioned in the repo too.

### How to explain in the interview (about 40 sec)
> "I use Git daily. I work on feature branches, make small commits with clear messages, and merge through pull requests with code review. I rebase only my local branches and use revert on shared branches so history isn't rewritten. I tag releases, resolve conflicts by understanding both changes and re-testing, and keep secrets out of the repo with .gitignore. In my demo, GitHub Actions builds and tests every PR. I also version non-code assets like n8n workflow JSON and Power BI files, and keep the README up to date as documentation the team can edit."

**Follow-ups:** *merge vs rebase?* · *reset vs revert?* · *You committed a password, what now?* (rotate the secret first, then remove it from history with `git filter-repo`, add a .gitignore rule) · *Branching strategy?*

---

## 7. The "big picture" answer (when they ask *"How would you use all these tools together?"*)

> "I see them as layers. **.NET MVC + SQL** is the core: the business systems and data. **BorG BPM** handles forms and approvals. When a form is approved, **n8n** connects systems through APIs: SQL, SAP, email, Teams. For systems with no API, like SAP GUI screens or vendor portals, **Automation 360** bots do the clicking. **Power BI** shows management the results across all plants. **Dify** adds AI on top of company documents and data. **Git** keeps everything versioned and documented. I built a small version of exactly this pipeline, GloveOps, as a demo. I'm happy to show it."

Draw this if there's a whiteboard:
```
 Users ──► [MVC Portal (.NET + Dapper + MSSQL)] ◄──► [BorG BPM e-forms]
                  │ webhook                          │ approved
                  ▼                                  ▼
               [n8n] ──► SQL / SAP API / Email / Teams
                  │
     no-API systems ◄── [Automation 360 bots]
                  │
        [MSSQL data] ──► [Power BI dashboards]
                  │
   documents/specs ──► [Dify RAG chatbot] ──► API ──► MVC "Ask AI"
            (everything versioned in Git)
```

## 8. Honesty lines (use when needed)
- "I haven't used **BorG** itself, but I've built approval workflows and understand BPM concepts. Is your team configuring it, or extending it with code?"
- "My **Automation 360** experience is a demo with the Community Edition. My production automation experience is with C#, Playwright and scheduled jobs."
- "I'm comfortable with **Power BI** basics and SQL-side reporting. I'd like to grow into advanced DAX here."
