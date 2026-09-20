# Dell Affiliate Prelanding

Одностраничное fullstack-приложение для affiliate prelanding бренда Dell.

Пользователь переходит по CTA через backend, клик сохраняется в PostgreSQL, после чего backend возвращает HTTP `302` и перенаправляет пользователя на разрешённый URL Dell.

## Стек

### Frontend

- React
- TypeScript
- Vite
- Google Tag Manager
- GA4 через конфигурацию GTM

### Backend

- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL

Frontend и backend являются отдельными npm-проектами.

## Требования

- Node.js `20.19+` или `22.12+`
- npm
- PostgreSQL

## Переменные окружения

Создайте локальные env-файлы из примеров:

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

### Client

Файл `client/.env`:

```dotenv
VITE_API_URL=http://localhost:3000
VITE_GTM_ID=GTM-XXXXXXX
```

Переменные:

- `VITE_API_URL` — публичный URL backend без завершающего `/`;
- `VITE_GTM_ID` — ID контейнера Google Tag Manager.

Настоящий GTM ID должен иметь формат `GTM-XXXXXXX`. Не добавляйте реальные production ID в `.env.example`.

Переменные Vite встраиваются во frontend во время сборки. После их изменения необходимо перезапустить dev server или заново выполнить production build.

### Server

Файл `server/.env`:

```dotenv
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dell_affiliate?schema=public"
```

Переменные:

- `PORT` — порт Express-сервера; по умолчанию используется `3000`;
- `DATABASE_URL` — строка подключения к PostgreSQL.

Не добавляйте `.env` с реальными паролями и ID в Git.

## Установка зависимостей

Frontend:

```bash
cd client
npm ci
```

Backend:

```bash
cd server
npm ci
```

Если lock-файлы ещё не созданы или зависимости были изменены, вместо `npm ci` используйте:

```bash
npm install
```

## Prisma setup

PostgreSQL должен быть установлен и запущен. База из `DATABASE_URL` должна существовать до запуска миграций.

Перейдите в backend:

```bash
cd server
```

Сгенерируйте Prisma Client:

```bash
npm run prisma:generate
```

Примените миграции в локальной среде:

```bash
npm run prisma:migrate
```

Эта команда запускает `prisma migrate dev`.

Для просмотра данных во время разработки при необходимости можно использовать:

```bash
npx prisma studio
```

Модель `Click` содержит:

- `id` — внутренний числовой идентификатор;
- `clickId` — уникальный UUID клика;
- `offer` — название оффера;
- `sub1` — placement CTA или `null`;
- `timestamp` — время клика;
- `ip` — IP пользователя или `null`;
- `userAgent` — User-Agent пользователя или `null`.

## Локальный запуск

### Backend

В первом терминале:

```bash
cd server
npm run dev
```

Backend будет доступен по адресу:

```text
http://localhost:3000
```

### Frontend

Во втором терминале:

```bash
cd client
npm run dev
```

Frontend будет доступен по адресу:

```text
http://localhost:5173
```

Frontend и backend запускаются независимо.

## API endpoints

### `GET /health`

Проверка доступности backend.

Пример запроса:

```bash
curl http://localhost:3000/health
```

Успешный ответ:

```json
{
  "status": "ok"
}
```

### `GET /click`

Регистрирует affiliate-клик и перенаправляет пользователя на разрешённый URL Dell.

Query-параметры:

- `offer` — обязательный параметр; поддерживается `Dell`;
- `sub1` — необязательный placement CTA, сохраняемый без преобразования.

Пример:

```bash
curl -i "http://localhost:3000/click?offer=Dell&sub1=hero"
```

Перед перенаправлением backend сохраняет:

- сгенерированный через `crypto.randomUUID()` `clickId`;
- `offer`;
- `sub1`;
- `timestamp`;
- IP;
- User-Agent.

После успешной записи endpoint возвращает HTTP `302` с Dell URL в заголовке `Location`.

Некорректный или неподдерживаемый `offer` возвращает HTTP `400` без записи в базу.

### `GET /clicks`

Возвращает все клики в формате JSON, отсортированные по `timestamp` от новых к старым.

Пример:

```bash
curl http://localhost:3000/clicks
```

Поля ответа:

```json
[
  {
    "clickId": "00000000-0000-0000-0000-000000000000",
    "offer": "Dell",
    "sub1": "hero",
    "timestamp": "2026-09-20T10:00:00.000Z",
    "ip": "127.0.0.1",
    "userAgent": "Mozilla/5.0"
  }
]
```

Endpoint пока не использует pagination и authentication. Перед публичным production-деплоем доступ к нему следует ограничить.

## CTA flow

```text
CTA <a>
  → GET /click?offer=Dell&sub1=<placement>
  → валидация offer
  → генерация clickId
  → запись Click в PostgreSQL через Prisma
  → HTTP 302
  → разрешённый URL Dell
```

CTA являются обычными ссылками `<a>`, а не `fetch`-запросами. Они открывают backend URL в новой вкладке через:

```html
target="_blank" rel="noopener noreferrer"
```

Используемые placements:

- header CTA: GTM `placement=header`, backend `sub1=hero`;
- hero CTA: `hero`;
- products CTA: `products`;
- bottom CTA: `bottom`.

## GTM и GA4

Google Tag Manager инициализируется во frontend через `client/src/gtm.ts`. ID контейнера берётся из `VITE_GTM_ID`.

Каждый коммерческий CTA выполняет:

```ts
window.dataLayer.push({
  event: "cta_click",
  offer: "Dell",
  placement: "hero",
});
```

Возможные значения `placement`:

- `header`;
- `hero`;
- `products`;
- `bottom`.

Для отправки событий в GA4 необходимо настроить в Google Tag Manager:

1. GA4 Configuration или Google tag;
2. Custom Event trigger с именем `cta_click`;
3. GA4 Event tag;
4. event parameters `offer` и `placement`;
5. публикацию GTM-контейнера.

GA4 Measurement ID настраивается внутри GTM и не должен хардкодиться в React-коде.

## Production build

### Frontend

До сборки задайте production-переменные в окружении:

```bash
export VITE_API_URL="https://api.example.com"
export VITE_GTM_ID="GTM-XXXXXXX"
```

Установите зависимости и соберите приложение:

```bash
cd client
npm ci
npm run build
```

Готовые статические файлы будут находиться в:

```text
client/dist
```

Команда ниже предназначена только для локальной проверки production build:

```bash
npm start
```

Для production раздавайте содержимое `client/dist` через статический хостинг или web server.

### Backend

Задайте production-переменные:

```bash
export NODE_ENV="production"
export PORT="3000"
export DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
```

Установите зависимости, сгенерируйте Prisma Client, примените существующие миграции и соберите backend:

```bash
cd server
npm ci
npm run prisma:generate
npx prisma migrate deploy
npm run build
npm start
```

В production используйте `prisma migrate deploy`, а не `prisma migrate dev`.
