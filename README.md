## FullStack MonoRepo template

The repository contains two main Applications under the _apps_ folder and some configuration packages under **packages** folder to be shared.

### Apps

- [Nest JS application ](https://docs.nestjs.com/) under _apps/server_
- [NextJS 15](https://nextjs.org/) application under _apps/web_

### Packages

- Tailwind
- Typescript
- Eslint
- UI Components

### Getting started

```bash
pnpm install
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env.local
pnpm db:up      # Postgres 18 on localhost:5433 (5432 is often already taken)
pnpm dev
```

|               | Port |                                                                   |
| ------------- | ---- | ----------------------------------------------------------------- |
| `apps/web`    | 3000 | `next dev`'s default                                              |
| `apps/server` | 3001 | overridable with `PORT`; they'd collide on 3000 under `turbo dev` |

The API answers on `http://localhost:3001/health`; everything else sits behind
the `api/v1` prefix, which is what `NEXT_PUBLIC_BACKEND_URL` points the web app at.

**The database is opt-in.** `AppModule` only registers TypeORM when
`DB_ENABLED=true`, so a fresh clone boots with no Postgres at all. `pnpm dev`
defaults it to `true`; use `DB_ENABLED=false pnpm dev` to run without a DB.
Because the flag is read while `AppModule` is constructed — before `ConfigModule`
reads `.env` — it must be a real environment variable. Every other `DB_*` value
is read through `ConfigService` and works fine from `.env`.

| Command                               | What it does                                 |
| ------------------------------------- | -------------------------------------------- |
| `pnpm dev`                            | Runs web + server via turbo                  |
| `pnpm db:up` / `db:down` / `db:reset` | Local Postgres lifecycle                     |
| `pnpm lint` / `pnpm build`            | Workspace-wide                               |
| `pnpm server:deploy:plan`             | Builds the bundle and plans the Lambda stack |
| `pnpm server:deploy`                  | Same, then applies                           |

### Deploying the server (AWS Lambda)

`apps/server/iac/terraform` wraps the Lambda in the
[lambda-wrapper module](https://github.com/MatheusDev20/terraform-modules).
`esbuild` bundles the app to a single `dist-lambda/index.js`, and the module runs
its own `archive_file` over that **directory** — it takes `source_dir`, never a
prebuilt `.zip`.

One-time setup:

1. Create the S3 state bucket in your AWS account (versioning on).
2. `cd apps/server/iac/terraform && cp backend.hcl.example backend.hcl`, then
   fill in the bucket name. The backend is a _partial_ config so this template
   carries no account-specific values.
3. `pnpm server:deploy:plan` to check, `pnpm server:deploy` to ship.

The deployed function gets a public Lambda function URL; `terraform output
function_url` prints it, and health lives at `<url>health`.

### CI

| Workflow                              | Trigger                                                                              | Does                                                                       |
| ------------------------------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| `.github/workflows/ci.yml`            | every push to `main` + all PRs                                                       | install, lint, build, unit tests, e2e against a Postgres service container |
| `.github/workflows/deploy-server.yml` | push to `main` touching `apps/server/**`, `packages/**` or the lockfile; also manual | builds the bundle, `terraform apply`, then smoke-tests `/health`           |

Configure in the repo's GitHub settings:

- Secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
- Variable: `TF_STATE_BUCKET` (same bucket as `backend.hcl`)

Locally Terraform uses the named AWS profile from `variables.tf` (default
`matheus`); CI sets `TF_VAR_aws_profile=""` so the provider falls back to those
credentials instead.

### Folder Structure

```bash
├─ apps/
│  ├─server/
│  │  ├─ package.json
│  │  └─ ...
│  ├─web/
│  │  ├─ package.json
│  │  └─ ...
│
├─ packages/
│  ├─config-tailwind
│  │  ├─ package.json
│  │  └─ ...
│  ├─eslint-config
│  │  ├─ package.json
│  │  └─ ...
│  ├─typescript-config
│  │  ├─ package.json
│  │  └─ ...
│─ │─ui
│  │  ├─ package.json
│  │  └─ ...
│
├─ package.json
└─ README.md
└─ pnpm-workspace.yaml
└─ .gitignore
└─ pnpm-lock.yaml
└─ turbo.json
└─ .npmrc
```
