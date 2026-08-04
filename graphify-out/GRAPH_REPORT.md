# Graph Report - C:/Users/joaqu/OneDrive/Desktop/hotel-transitorio  (2026-07-31)

## Corpus Check
- 35 files · ~85,217 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 172 nodes · 212 edges · 18 communities (14 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 16

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `formatARS()` - 10 edges
3. `scripts` - 9 edges
4. `prisma` - 8 edges
5. `POST()` - 7 edges
6. `getTurnoDuration()` - 6 edges
7. `getAvailableSlots()` - 6 edges
8. `Logo()` - 5 edges
9. `getPernocte()` - 5 edges
10. `include` - 5 edges

## Surprising Connections (you probably didn't know these)
- `AdminPage()` --calls--> `formatARS()`  [EXTRACTED]
  src/app/admin/page.tsx → src/lib/format.ts
- `ConfirmacionPage()` --calls--> `formatARS()`  [EXTRACTED]
  src/app/confirmacion/[id]/page.tsx → src/lib/format.ts
- `HomePage()` --calls--> `formatARS()`  [EXTRACTED]
  src/app/page.tsx → src/lib/format.ts
- `Tarifa()` --calls--> `formatARS()`  [EXTRACTED]
  src/app/page.tsx → src/lib/format.ts
- `GET()` --calls--> `getAvailableSlots()`  [EXTRACTED]
  src/app/api/availability/route.ts → src/lib/turnos.ts

## Import Cycles
- None detected.

## Communities (18 total, 4 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.10
Nodes (19): AdminPage(), dynamic, dynamic, ConfirmacionPage(), dynamic, HomePage(), Tarifa(), dynamic (+11 more)

### Community 1 - "Community 1"
Cohesion: 0.16
Nodes (18): GET(), BookingSchema, POST(), Bucket, buckets, getClientIp(), rateLimit(), bookingRange() (+10 more)

### Community 2 - "Community 2"
Cohesion: 0.11
Nodes (19): autoprefixer, devDependencies, autoprefixer, postcss, prisma, tailwindcss, tsx, @types/node (+11 more)

### Community 3 - "Community 3"
Cohesion: 0.11
Nodes (19): dom, dom.iterable, esnext, compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules (+11 more)

### Community 4 - "Community 4"
Cohesion: 0.13
Nodes (15): clsx, date-fns, next, dependencies, clsx, date-fns, next, @prisma/client (+7 more)

### Community 5 - "Community 5"
Cohesion: 0.15
Nodes (12): name, private, scripts, build, db:push, db:seed, db:studio, dev (+4 more)

### Community 6 - "Community 6"
Cohesion: 0.25
Nodes (7): next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx, exclude, include

### Community 7 - "Community 7"
Cohesion: 0.33
Nodes (4): cormorant, inter, metadata, pinyon

### Community 8 - "Community 8"
Cohesion: 0.33
Nodes (4): alt, contentType, runtime, size

### Community 9 - "Community 9"
Cohesion: 0.33
Nodes (4): alt, contentType, runtime, size

### Community 10 - "Community 10"
Cohesion: 0.67
Nodes (3): config, middleware(), unauthorized()

## Knowledge Gaps
- **79 isolated node(s):** `securityHeaders`, `nextConfig`, `name`, `version`, `private` (+74 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Community 2` to `Community 5`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Community 4` to `Community 5`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Why does `prisma` connect `Community 0` to `Community 1`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **What connects `securityHeaders`, `nextConfig`, `name` to the rest of the system?**
  _79 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.0960960960960961 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._