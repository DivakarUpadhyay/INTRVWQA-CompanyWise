# JD Analysis — C# Programming & System Development Engineer / Senior Engineer

**Company:** 英屬維京群島商禾寶醫療器材股份有限公司 台灣分公司 (PM Gloves / Precious Mountain Group)
**Applied:** 2026-10-16 · **HR:** Martin, 02-66066688 #537 · **Applicants:** 6–10
**Location:** Neihu Technology Park, Taipei. Office only, no travel.
**Pay:** 104 shows NT$40,000+ as the minimum. Title (Engineer or Senior Engineer) and pay depend on experience.
**Hours:** flexible start 08:30–09:30, finish 18:00–19:00, two days off per week.

## What this team really is
This is an **internal IT / MIS team** at a manufacturer, not a software house. They build tools for the company's own staff: sales, factories, finance and HR across 6 plants (Taiwan, China, Vietnam).
- **Core job (I):** internal Web MVC systems, front end and back end. Write documentation the team can edit.
- **Side jobs (II):** a "digital transformation" toolkit:
  | Tool | What it is | Likely use at PM Gloves |
  |---|---|---|
  | **BorG BPM (written "Brog" in the JD)** | Taiwanese e-form and approval (簽核) system, BorG SPM / MFlow | leave, purchase requests, sample requests, quality deviation approvals |
  | **Automation 360** | Automation Anywhere's cloud RPA | SAP data entry, downloading bank or customs files, emailing reports |
  | **Power BI** | Microsoft BI | sales, production yield, inventory and on-time delivery dashboards |
  | **n8n** | open-source workflow automation, like Zapier | connecting APIs, webhooks, Teams/LINE/Email alerts, SAP to web system |
  | **Dify** | open-source LLM app platform: RAG, agents, workflows | internal chatbot over SOPs, ISO docs, product specs; email or quotation helpers |

  They also run **SAP** ERP, so expect integration questions (RFC/BAPI, OData, flat-file exports, SQL staging tables).

## Requirement → your evidence
| Requirement | Level asked | Your evidence | Gap / action |
|---|---|---|---|
| C# 2+ yrs (generics, inheritance, OOP) | Must | 8+ yrs C#/.NET | Revise generic constraints, covariance, abstract vs interface |
| MS SQL: stored procedures | Must | SQL Server daily; FactoryOS / BotNexus designs use MSSQL | Revise SP params, TRY/CATCH, transactions, indexes, execution plans |
| **Dapper** + ORM (EF) | Must | **FactoryOS and DemandRadar are built with Dapper + MSSQL**. Strong match, mention it | Revise Dapper `QueryMultiple`, `DynamicParameters`, SP calls, multi-mapping |
| .NET Core MVC | Must | ASP.NET Core, REST APIs | Revise filters, middleware, DI lifetimes, model binding, validation, Razor |
| Web Forms (some) | Nice | Check your past projects | ViewState, page life cycle, postback, UpdatePanel. Expect a legacy system |
| jQuery | Must | | `$.ajax`, event delegation `.on()`, DataTables, serialize forms, anti-forgery token |
| Git | Must | Daily (GitHub) | branching, merge vs rebase, resolving conflicts, revert vs reset |
| Technical documentation | Must | | Mention README/guides you write (e.g. FactoryOS GUIDE.md) |
| BPM e-forms | Plus | Workflow/approval logic | Learn the approval-flow concepts: 會簽, 加簽, 退回, 代理人 |
| RPA (Automation 360) | Plus | Bots/automation (jobbot, Playwright automation) | Watch one A360 intro; know bot / task / control room / credential vault |
| Power BI | Plus | SQL reporting | Know DirectQuery vs Import, DAX basics, gateway, RLS |
| n8n | Plus | Automation bots | Know triggers, nodes, webhook, self-host, credentials |
| Dify / LLM | Plus | AI apps you've built | RAG, knowledge base, prompt, workflow, API key, calling Dify from C# |
| English basic | — | Fluent | Advantage: you can handle overseas plant users and foreign vendors |
| Mandarin | not stated | beginner | Be honest. Offer English + basic Mandarin and say you're actively learning |

## Engineer vs Senior Engineer
With 8+ years, **aim for Senior**. To prove it, show:
1. You design, not just code: DB schema, layering, reusable components.
2. You think about maintenance: logging, error handling, documentation, code review.
3. You can automate: you see a manual process and turn it into a form, bot or dashboard.
4. You can talk to non-IT users: gather requirements from factory or sales staff.

## Your 30-second pitch for this role
> "I've worked with C# and .NET for over 8 years, building web systems on ASP.NET Core MVC with SQL Server stored procedures and Dapper, the same stack as your posting. I've built manufacturing and automation systems myself, such as a factory-operations platform on .NET, Dapper and MSSQL, and automation bots. I also work with AI and LLM integration. Your role combines internal web systems with BPM, RPA, Power BI, n8n and Dify. That's what interests me: helping a global manufacturer like PM Gloves automate its processes across its plants. I hold a Taiwan Gold Card, so I can start immediately with no visa sponsorship."

## Red flags / things to clarify (ask politely in the interview)
- Team size, and who owns SAP: internal staff or a vendor?
- How much of the job is new MVC work versus maintaining Web Forms.
- Is the working language Chinese? Are specs and documents written in Chinese?
- Reviews mention office politics and high turnover in some teams (see 05). Ask how the IT team prioritises requests.
