docker compose up -d --build
docker compose up -d postgres

<h1 align="center">🚀 Lead Tracker — Mini CRM System</h1>

<p align="center">
Full-stack додаток для управління лідами та історії взаємодії через коментарі.<br>
Побудовано на архітектурі <b>Monorepo</b>.
</p>

---

## 🛠 Як запустити локально

### Попередні вимоги

- **Node.js** (v18+)
- **Docker & Docker Compose**

---

### Швидкий старт (Docker Compose)

Запустіть весь проект однією командою:

```bash
docker compose up -d --build
```

---

### Ручний запуск по кроках

<details>
<summary>Крок 1: База даних</summary>

```bash
docker compose up -d postgres
```

</details>

<details>
<summary>Крок 2: Backend (NestJS)</summary>

```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run start:dev
```

Доступний за адресою: [http://localhost:4000](http://localhost:4000)

</details>

<details>
<summary>Крок 3: Frontend (Next.js)</summary>

```bash
cd frontend
npm install
npm run dev
```

Доступний за адресою: [http://localhost:3000](http://localhost:3000)

</details>

---

## 🔑 Змінні оточення (.env)

Для коректної роботи створіть файли <b>.env</b> у відповідних папках:

### Backend (`backend/.env`)

| Ключ         | Опис              | Приклад                                       |
| ------------ | ----------------- | --------------------------------------------- |
| DATABASE_URL | Підключення до БД | postgresql://user:pass@localhost:5432/lead_db |
| PORT         | Порт сервера      | 4000                                          |

### Frontend (`frontend/.env`)

| Ключ                | Опис           | Приклад                   |
| ------------------- | -------------- | ------------------------- |
| NEXT_PUBLIC_API_URL | URL вашого API | http://localhost:4000/api |

---

## 📑 Як перевірити API (Swagger)

Після запуску бекенду автоматична документація доступна тут:

- [http://localhost:4000/api/docs](http://localhost:4000/api/docs)

### Основні Endpoints

- `GET /api/leads` — отримати всіх лідів
- `POST /api/leads` — створити ліда
- `POST /api/leads/:id/comments` — додати коментар

---

## 🏗 Build та Production режим

### Backend

```bash
cd backend
npm run build
npm run start:prod
```

### Frontend

```bash
cd frontend
npm run build
npm run start
```

---

## 📂 Структура проекту

- **backend/** — Серверна частина (NestJS + Prisma)
- **frontend/** — Клієнтська частина (Next.js + Tailwind)
- **docker-compose.yml** — Конфігурація сервісів та бази даних
