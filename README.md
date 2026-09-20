# Dell Affiliate Prelanding

Тестовое fullstack-приложение для affiliate prelanding бренда Dell.

## Структура

- `client` — React, TypeScript и Vite
- `server` — Node.js, Express, TypeScript, Prisma и PostgreSQL

Frontend и backend являются отдельными npm-проектами.

## Требования

- Node.js 20 или новее
- npm
- PostgreSQL

Docker не используется.

## Настройка переменных окружения

Создайте локальные env-файлы на основе примеров:

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```
