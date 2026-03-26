# Code IT

Проєкт блогу про розробку: статті, категорії, теги, сторінки авторів і адмінка для керування контентом.

## Стек

- `frontend`: Next.js (App Router), TypeScript, Tailwind CSS
- `backend`: Node.js + Express
- `database`: Supabase (PostgreSQL + Storage)

## Структура

- `apps/frontend` — клієнтська частина сайту
- `apps/backend` — API, адмін-ендпоїнти, завантаження файлів
- `apps/backend/migrations` — SQL для схеми та початкових даних

## Локальний запуск

1. Встановити залежності:

```bash
cd apps/backend && npm install
cd ../frontend && npm install
```

2. Налаштувати змінні середовища:

- `apps/backend/.env` (по прикладу `apps/backend/.env.example`)
- `apps/frontend/.env` (по прикладу `apps/frontend/.env.example`)

3. Запустити два сервіси в окремих терміналах:

```bash
# backend (порт 3001)
cd apps/backend
npm run dev
```

```bash
# frontend (порт 3000)
cd apps/frontend
npm run dev
```

4. Відкрити сайт: [http://localhost:3000](http://localhost:3000)

## База даних

Міграції:

1. `001_supabase_schema.sql`

## Нотатки

- Брендинг проєкту: **Code IT**
- RSS доступний за ` /rss.xml`
- Sitemap: ` /sitemap.xml`
