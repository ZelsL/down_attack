# Contributing to Down Attack

Thank you for your interest in contributing to **Down Attack**! This guide covers the tech stack, local development setup, admin permissions, Arena of Solare match simulation, and testing workflow.

---

## 🛠️ Tech Stack

- **Framework:** [Nuxt 4](https://nuxt.com/) (Vue 3 + Nitro Server API)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Custom BDO Dark UI theme)
- **Database:** PostgreSQL (`pg` + `node-pg-migrate`)
- **Authentication:** Discord OAuth2 + Database Sessions
- **Testing:** Jest (`@swc/jest` for unit & integration tests)
- **Code Style & Commits:** ESLint, Prettier, Husky, and Commitizen (Conventional Commits)

---

## 🚀 Local Development Setup

### Prerequisites

- **Node.js** `v24+` (see `.nvmrc`)
- **Docker & Docker Compose** (for local PostgreSQL container)

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/ZelsL/down_attack.git
cd down_attack
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root with your local PostgreSQL and Discord OAuth2 credentials:

```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=local_user
POSTGRES_DB=local_db
POSTGRES_PASSWORD=local_password
DATABASE_URL=postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}
```

### 3. Start the Development Server

```bash
# Starts Docker PostgreSQL, waits for database readiness, runs migrations, and starts Nuxt on http://localhost:3000
npm run dev
```

### 4. Seed Skills & Official Presets

```bash
# Seeds BDO skills and official calculator presets into PostgreSQL
npm run db:seed
```

---

## 🔑 Granting Admin Permissions in Development

Some features (such as managing skills in `/skills`, curating official presets in `/builds`, or viewing full system status) require admin permissions:

```bash
# Grant admin permissions to the default local mock user (mock_admin)
npm run user:admin

# Or grant admin permissions to your own logged-in user (by Discord username or Discord ID)
npm run user:admin <your_username_or_discord_id>
```

---

## ⚔️ Simulating Arena of Solare Matches Locally

To test the **Arena of Solare Overlay (`/solare`)** and live OBS widget (`20s` auto-refresh, win-streak bonus calculation, and session PDL deltas) in development:

```bash
# 1. Seed initial demo player 'Okazaki' (SA) with 4 base matches (#930001-#930004)
npm run solare:seed

# 2. Simulate a new VICTORY (+26 base PDL + win streak bonus) for 'Okazaki'
npm run solare:win

# 3. Simulate a new DEFEAT (-21 PDL and streak reset) for 'Okazaki'
npm run solare:loss
```

---

## 🧪 Scripts & Testing

| Command                       | Description                                                                |
| :---------------------------- | :------------------------------------------------------------------------- |
| `npm run dev`                 | Starts PostgreSQL container, runs migrations, and launches Nuxt dev server |
| `npm run build`               | Seeds database and builds application for production                       |
| `npm test`                    | Runs full integration & unit test suite with Jest                          |
| `npm run lint:eslint:check`   | Checks code for linting issues with ESLint                                 |
| `npm run lint:prettier:check` | Checks formatting with Prettier                                            |
| `npm run lint:prettier:fix`   | Formats code automatically with Prettier                                   |
| `npm run migrations:create`   | Creates a new PostgreSQL migration in `infra/migrations`                   |
| `npm run migrations:up`       | Applies pending PostgreSQL migrations                                      |
| `npm run db:seed`             | Seeds BDO skills and official presets into PostgreSQL                      |
| `npm run db:save-seed`        | Exports current database skills into `infra/seeds/skills.json`             |
| `npm run user:admin`          | Grants admin permissions to `mock_admin` or `<username_or_discord_id>`     |
| `npm run solare:seed`         | Seeds initial Arena of Solare test player (`Okazaki` - SA)                 |
| `npm run solare:win`          | Simulates a new Arena of Solare victory for `Okazaki`                      |
| `npm run solare:loss`         | Simulates a new Arena of Solare defeat for `Okazaki`                       |

---

## 📋 Pull Request Guidelines

1. **Create a Feature Branch:** Branch off `main` using a descriptive kebab-case name (e.g., `git checkout -b feat-name`).
2. **Code Style:** Ensure both `npm run lint:eslint:check` and `npm run lint:prettier:check` pass without warnings.
3. **Tests:** Add or update unit/integration tests in `tests/` and verify with `npm test`.
4. **Conventional Commits:** Follow Conventional Commits format (e.g., `feat(calculator): ...`, `fix(solare): ...`) or use `npm run commit`.
