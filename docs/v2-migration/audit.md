# ReactRouterAdmin v2.0 Migration Audit

Date: 2026-09-07 · Branch: `refactor/v2-admin-foundation` · Baseline commit: `c33ce38`

Scope: full classification of the existing codebase per `docs/重构文档.md` Phase 0.
Verdicts: **KEEP** (stable, untouched) · **REFACTOR** (behavior preserved, location/API adjusted) · **DEPRECATE** (legacy, scheduled for removal or replacement).

## 1. App shell & routing

| Area                                                                                   | Verdict                                      | Notes                                                                                                         |
| -------------------------------------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `app/root.tsx`                                                                         | REFACTOR                                     | Keep loader/Toaster/ErrorBoundary; wrap `<Outlet/>` in AppProvider (P1); ThemeProvider moves into AppProvider |
| `app/routes.ts` (`autoRoutes()`)                                                       | KEEP                                         | File-based routing stays; splat dispatcher added in P17                                                       |
| `app/routes/_authenticated/_layout.tsx`                                                | REFACTOR                                     | Drop AuthProvider (P1, global), PanelProvider (P5); add AuthGuard (P7)                                        |
| `app/routes/_auth/*`, `_errors/*`                                                      | KEEP                                         | Untouched                                                                                                     |
| Legacy demo routes: `tasks/`, `users/`, `apps/`, `chats/`, `settings/`, `help-center/` | KEEP                                         | Demo UI shell preserved (Rule 4); conform stack stays here only                                               |
| Public site routes: `_index`, `links`, `$slug`, `p.$slug`, `portal`                    | KEEP                                         | Consumes site module; import paths flip in P16                                                                |
| Admin routes `app/routes/_authenticated/admin/**`                                      | KEEP (pages) / REFACTOR (imports, i18n copy) | Hand-written pages stay; registry metadata migrates                                                           |

## 2. Foundation layers (`app/admin/`)

| Area                                                                                                                                            | Verdict              | Target                                                                                                                                                     |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `core/auth/` (auth-context, types)                                                                                                              | REFACTOR             | → `app/core/auth/` P7: + auth.service (MockAuthService), auth.store (useSyncExternalStore), use-auth; hardcoded wildcard logic unified in core/permissions |
| `core/permissions/` (permission, types)                                                                                                         | REFACTOR             | → `app/core/permissions/` P8: + permission-provider, use-permission, can.tsx; delete duplicated wildcard logic                                             |
| `core/permissions/ProtectedAction.tsx`                                                                                                          | DEPRECATE→DELETE     | Unused outside barrel; replaced by `<Can>` (P8)                                                                                                            |
| `core/navigation/` (registry, builder, types)                                                                                                   | REFACTOR             | → `app/core/navigation/` P9 + new idempotent `static-navigation.ts`                                                                                        |
| `core/resource/` (resource, registry, types)                                                                                                    | REFACTOR             | → `app/resource-engine/` (P12) + `app/core/registry/` (P12); metadata-only today                                                                           |
| `core/module/` (module, registry, types)                                                                                                        | KEEP (relocated P16) | `defineModule`/`moduleRegistry` remain the resource-bundling unit                                                                                          |
| `core/panel/` (panel, panel-provider)                                                                                                           | REFACTOR→MERGE       | `panel.ts` fields fold into `app/config/admin.config.ts`; PanelProvider merged into AdminProvider (P5); `usePanel` deleted                                 |
| `ui/page/`                                                                                                                                      | REFACTOR             | → `app/components/admin/page/` P4 (+ new PageToolbar)                                                                                                      |
| `ui/table/`                                                                                                                                     | REFACTOR             | → `app/components/admin/table/` P4; extended P10 (column header, faceted filter, server-paging props)                                                      |
| `ui/form/` (AdminForm + 10 fields)                                                                                                              | REFACTOR             | → `app/components/admin/form/` P4; extended P11 (FormSection/FormActions); THE admin form engine (RHF+zod)                                                 |
| `ui/actions/`                                                                                                                                   | REFACTOR             | → `app/components/admin/actions/` P4; permission prop delegates to core service (P8)                                                                       |
| `ui/feedback/`, `ui/overlay/`                                                                                                                   | REFACTOR             | → `app/components/admin/{feedback,overlay}/` P4                                                                                                            |
| `ui/themes/`                                                                                                                                    | REFACTOR             | → `app/components/admin/themes/` P4 (admin business UI, not core)                                                                                          |
| `ui/layout/` (AdminLayout/AdminHeader/AdminSidebar)                                                                                             | DEPRECATE→DELETE     | Dead code (P3); real shell is `_authenticated/_layout.tsx`                                                                                                 |
| `ui/manifest/features.ts`                                                                                                                       | DEPRECATE→DELETE     | Duplicates PanelFeatures (P3/P5 merge)                                                                                                                     |
| `ui/primitives/` (AdminButton, AdminInput, …)                                                                                                   | DEPRECATE            | Keep (existing fields depend); no new usage; new code uses `components/ui` + `<Can>`                                                                       |
| Barrel semantic aliases (DataTable, SmartForm, DashboardPage\*, ActionButton, PageCard, ConfirmDialog, EmptyState, LoadingState, FeedbackAlert) | DEPRECATE            | Marked P3; consumers flipped to canonical names by P20, then deleted                                                                                       |

## 3. Business modules (`app/modules/`)

| Area                                                                                                         | Verdict  | Target                                                                                      |
| ------------------------------------------------------------------------------------------------------------ | -------- | ------------------------------------------------------------------------------------------- |
| `user/`                                                                                                      | REFACTOR | → `app/resources/users/` P16; + api.ts facade (P19); hand-written pages stay                |
| `role/`                                                                                                      | REFACTOR | → `app/resources/roles/` P16; `permissions.ts` dictionary stays canonical permission source |
| `media/`                                                                                                     | REFACTOR | → `app/resources/media/` P16                                                                |
| `site/` (5 sub-slices, god repo/service)                                                                     | REFACTOR | → `app/resources/site/` P16 (structure intact); semantic-alias consumers updated P20        |
| Module registration side effects (`import '~/modules'` in app-sidebar, per-module `moduleRegistry.register`) | REFACTOR | Explicit idempotent `registerAllResources()` + `registerStaticNavigation()` (P9/P16)        |

## 4. Shared UI & libs

| Area                                                                   | Verdict                   | Notes                                                                                                                                                                              |
| ---------------------------------------------------------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/components/ui/` (46 shadcn components + markdown/rich-text/stack) | KEEP                      | Complete; verified against doc Phase 3 checklist (form/calendar/command/chart/carousel/drawer/input-otp/menubar/context-menu/navigation-menu/resizable/sonner/sidebar all present) |
| `app/components/layout/`                                               | KEEP                      | Real admin shell; seeding side effects removed P9                                                                                                                                  |
| `app/components/conform/`                                              | KEEP                      | Legacy demo routes only; never extended                                                                                                                                            |
| `app/components/theme-provider.tsx`                                    | REFACTOR                  | Relocated into `app/providers/` chain (P1)                                                                                                                                         |
| `app/context/`, `app/hooks/`, `app/lib/`, `app/data/sidebar-data.ts`   | KEEP / REFACTOR (sidebar) | sidebar-data titles become i18n keys (P2); seeding moves to explicit registration (P9)                                                                                             |

## 5. Cross-cutting gaps (to build)

| Gap                                                                     | Phase                    |
| ----------------------------------------------------------------------- | ------------------------ |
| No i18n (mixed Chinese/English hardcoded copy)                          | P2 (i18next, en default) |
| No unified provider entry / config                                      | P1/P5                    |
| No API client layer                                                     | P6                       |
| No auth service abstraction / route guard                               | P7                       |
| No `usePermission` / `<Can>`                                            | P8                       |
| `defineResource` metadata-only (no columns/fields/actions/data adapter) | P12–P15                  |
| No registry-driven route generation                                     | P17                      |
| No custom-page feature slice convention                                 | P18                      |
| No permissions resource                                                 | P19                      |
| No extension API                                                        | P20                      |
| No react-query                                                          | P1                       |

## 6. Migration risks

1. SSR + localStorage repositories (client-guarded today) — keep guards; QueryClient window singleton.
2. HMR-unsafe module-scope registration in `app-sidebar.tsx` — fixed by idempotent bootstrap (P9).
3. Import churn ~90 files across moves — barrel re-exports bridge; typecheck-enforced; grep audits per phase.
4. Chinese→English visible copy change — mandated; seed _data content_ excluded; CJK grep whitelist maintained.
5. Splat route ranking — static routes win by RR ranking; URL matrix verified in P17.

## 7. Phase execution log

- **P0** — baseline audit (this document); branch `refactor/v2-admin-foundation`.
- **P1** — AppProvider chain (Query → I18n(pending) → Theme → Auth) + `app/config/admin.config.ts`; `@tanstack/react-query` added; `app/root.tsx` mounted.
- **P2** — i18next inline `en` locale (strict key typing via `i18next.d.ts`); all UI copy migrated to `t()`; CJK whitelist = seed data + code comments only.
- **P3** — shadcn collection re-verified: `app/components/ui/` holds 49 files; doc Phase 3 checklist items (form/calendar/command/chart/carousel/drawer/input-otp/menubar/context-menu/navigation-menu/resizable/sonner/sidebar) all present. Deleted dead `app/admin/ui/layout/` (AdminLayout/AdminHeader/AdminSidebar — zero consumers outside the barrel) and `app/admin/ui/manifest/features.ts` (superseded by `adminConfig.features`). Semantic aliases in `app/admin/ui/index.ts` marked `@deprecated`; removal scheduled P20.
- **P4** — `app/admin/ui/*` physically moved to `app/components/admin/*` (kebab-case files, exports unchanged); `~/admin/ui` barrel now a pure re-export bridge; `page-toolbar.tsx` added.
- **P5** — `app/core/admin` (AdminContextValue: config/user/locale/features) replaces PanelProvider; AdminProvider mounted in AppProvider chain.
- **P6** — `app/core/api` (client/request/response/errors); infrastructure only, no runtime consumers yet.
- **P7** — auth moved to `app/core/auth` (AuthService interface + MockAuthService + useSyncExternalStore store); AuthGuard in `app/router/guards.tsx`; mock user = zero behavior change.
- **P8** — permissions unified in `app/core/permissions` (single `hasPermission`, `<Can>`, usePermission); ProtectedAction deleted; AdminButton/AdminAction/navigation-builder delegate.
- **P9** — navigation moved to `app/core/navigation`; `registerStaticNavigation()` + `registerAllResources()` idempotent; app-sidebar module-level side effects removed; bootstrapAdmin() runs in AdminProvider render body.
- **P10** — table files renamed `data-table*`; added column-header, filter; manualPagination/pageCount passthrough.
- **P11** — form fields normalized; FormSection/FormActions added.
- **P12** — resource-engine core: `defineResource` in `app/resource-engine/resource` (labelKey/groupKey/data adapter/customPages; no Chinese defaults); generic `Registry<T>` + `ResourceRegistry` in `app/core/registry`; old `app/admin/core/resource` deleted.
- **P13** — ColumnBuilder (text/number/badge/date/boolean/image/custom) producing tanstack ColumnDef with sortable headers.
- **P14** — FieldBuilder (10 kinds) + FormFieldRenderer on RHF FormProvider.
- **P15** — ActionBuilder (page/row/bulk) + ResourceActions renderer (Can + Button + AdminConfirmDialog; default labels/variants per kind; bulk delete defaults).
- **P16** — `app/modules/*` → `app/resources/{users,roles,media,site}`; module machinery (`defineModule`/`ModuleRegistry`/`app/admin/core`) deleted; `registerAllResources()` registers resources directly into `resourceRegistry` (AnyAdminResource escape moved to resource.registry.ts); side-effect registrations removed. Route matrix verified incl. /p/:slug and single sidebar registration.
- **P17** — splat `app/routes/_authenticated/admin/$.tsx` + generic `ResourceListPage/CreatePage/EditPage/DetailPage` + `ResourceRouter` dispatcher (403/404 states, permission gate) + `createResourceRoutes()` declarative alternative; useQuery/useMutation on ResourceDataAdapter; `actions` slot added to AdminResource. Ranking verified: handwritten routes win; splat 404s unknown paths; end-to-end list validation deferred to P19 permissions resource.
- **P18** — dashboard route components moved to `app/features/dashboard/components/`; `features/` convention: a feature folder owns its route-private components (no barrel needed, routes import via `~/features/<name>/...`), keeping `app/routes/` thin (meta/handle/loader only).
- **P19** — `app/resources/permissions/` read-only demo resource (rows from SYSTEM_PERMISSION_GROUPS, badge/text/custom columns) served fully by the splat + generic ListPage + ColumnBuilder; users/roles resources gained columns/fields/actions metadata + `api.ts` thin facades (future HTTP seam); handwritten pages untouched. Verified: sidebar entry + column headers SSR; client data hydration needs a manual browser look.
