# Выпуск исправления OAuth state с отключённым входом

Подготовлено 3 ноября 2026. Это план, не разрешение выполнить публикацию.
Push, merge, deploy, включение OAuth и изменения Supabase не выполнялись.

## Итог проверки

Блокирующих замечаний в финальном diff не обнаружено. Изменены шесть файлов
кода/тестов: 107 добавлений, 10 удалений. Одноразовое потребление state,
проверка cookie, TTL 600 секунд, проверка сессии и подписки сохранены.
Отклонённый callback перенаправляет на проверку доступа, но не выдаёт сессию.
Инфраструктурные ошибки остаются закрытыми с HTTP 503.

Исправление устраняет показ сырой ошибки после отклонённого callback.
Инициатор повторного запроса в production не установлен; исправление не
следует описывать как доказанное устранение причины повторной навигации.
Подробности и пределы доказательств: `early-access-oauth-state-incident.md`.

GitHub `EshikGames/shinobi-new-era`, локальный HEAD и удалённый main,
проверенный через `git ls-remote origin refs/heads/main`:
`9692ac974102a6f5ca649fbcef41129dc6d1b9da`.
Индекс Git пуст. Релизный коммит пока не создан.

В этой проверке публичный production вернул:

| Запрос | Результат |
| --- | --- |
| GET /early-access | 200 |
| GET /api/early-access/status | 200, status=unavailable, loginEnabled=false |
| GET /api/auth/patreon/start | 503, status=unavailable |

Ранее фактически выполнены на неизменившемся коде этого исправления:
22/22 локальных mock-теста, ESLint шести изменённых файлов и production build
с `EARLY_ACCESS_AUTH_ENABLED=false` — PASS. Повторная проверка diff — PASS.
Это не реальные интеграционные тесты Patreon/Supabase. Новый production
релиз и реальный OAuth после исправления ещё не проверены.

В diff нет секретных значений, env-файлов, миграций, игровых файлов или
изменений настройки Supabase. Серверная проверка выделенного проекта
`avdkvtmugeizoqqvayek` остаётся в силе. Игровой проект не затрагивается.
Это проверка состава выпуска, а не заявление о сканировании всей истории Git.

## Разрешённый состав будущего коммита

Добавлять строго эти восемь файлов, не использовать `git add .` или `git add -A`:

1. `app/api/auth/patreon/callback/route.js`
2. `app/api/auth/patreon/start/route.js`
3. `app/early-access/SupporterAccess.jsx`
4. `lib/early-access/oauth-flow.mjs`
5. `lib/early-access/oauth-state.mjs`
6. `tests/early-access-flow.test.mjs`
7. `docs/early-access-oauth-state-incident.md`
8. `docs/early-access-oauth-state-release.md`

Остальные имеющиеся untracked-документы и `supabase/tests/` в выпуск не входят.
Также исключены `.env*`, резервные копии, временные файлы, `public/game`, SQL.

Контрольные SHA-256 семи файлов исправления (сам этот план не хешируется):

| Файл | SHA-256 |
| --- | --- |
| app/api/auth/patreon/callback/route.js | bddde13fb7b69b1ac2e87ae26b85902940c2d741658d7e2333890b6bf54f6c2c |
| app/api/auth/patreon/start/route.js | 9b50a06bc29c2d0f2cba12002267a1843e0252468409ec62fc71b7dc3ba4f889 |
| app/early-access/SupporterAccess.jsx | 67bb834feb9c877c9e67649d36edb625e18aacdb80d90b9118f0e6c8806ae72a |
| lib/early-access/oauth-flow.mjs | 28e6564d8019e493b790cee4927590e23087f289a79c8adba54469d82132960e |
| lib/early-access/oauth-state.mjs | d76c8a69b6f050305783c702894c24058a5f5f130398539dd982f7367dfcfbe0 |
| tests/early-access-flow.test.mjs | e3ca0c4f49a23aa9a0e75e5fe52104e979af494734c4a9a2db801903cf9c87db |
| docs/early-access-oauth-state-incident.md | 849fe0823abaf4e1760aa8f349c4c2902deea26d317b25d3a81d54c7f26af94f |

## Публикация — только после отдельного разрешения

1. Повторно проверить удалённый main, рабочие файлы и хеши. Если main или
   исходники изменились, остановить выпуск до нового review и необходимых тестов.
2. В Vercel → shinobi-new-era → Settings → Environment Variables проверить
   Production: `EARLY_ACCESS_AUTH_ENABLED=false`,
   `SITE_URL=https://shinobinewera.com`. Значения секретов не раскрывать.
   В Overview записать фактический Current Deployment и доступную точку отката.
   Ранее подтверждённая отключённая сборка: `GFT7YMG5XSKWt6sGUuchk8GFyrfB`.
3. Создать локальную ветку `codex/oauth-state-recovery`, добавить только восемь
   перечисленных файлов. Проверить полный staged diff, `git diff --cached --check`
   и список staged-файлов. Создать отдельный коммит
   `fix: recover safely from rejected Patreon callbacks`; записать полный SHA.
4. Только при неизменном main перенести этот коммит fast-forward и отправить
   main после разрешения владельца. Не использовать force push. Если remote
   изменился, не перезаписывать его; согласовать новый diff и повторить проверки.
5. Учесть текущий Instant Rollback: автоматическое назначение production-домена
   остановлено. Проверить созданную Vercel сборку по точному SHA, окружению
   Production и статусу Ready. Не выбирать прежнюю активированную сборку
   `HYLp4DvnKCMVidmx7kxmo22LqRnf`.
6. До назначения домена проверить URL новой сборки: страницу Early Access,
   status API с `loginEnabled=false`, закрытые start/callback/download.
   Если защита Vercel не даёт выполнить проверку, использовать авторизованный
   доступ владельца; не объявлять её успешной без результата.
7. Для выхода из rollback в Overview нажать Undo Rollback и выбрать именно
   новую проверенную сборку по SHA/ID. Подтверждение публикует её и возобновляет
   автоматическое назначение доменов. Если нужной сборки нет или SHA/флаг
   не подтверждён, остановиться, не подтверждать предложенную по умолчанию.
8. Сразу выполнить проверки ниже. Любая регрессия — остановка и откат.

Механика promotion и ограничения Instant Rollback сверены с
[официальной документацией Vercel](https://vercel.com/docs/instant-rollback).

## Проверка после публикации

| Проверка | Ожидается при выключенном OAuth |
| --- | --- |
| GET /, /download, /play, /characters, /early-access | 200, страницы корректно отображаются |
| GET /api/early-access/status | loginEnabled=false, status=unavailable |
| GET /api/auth/patreon/start | 503; нет перехода в Patreon |
| GET /api/auth/patreon/callback без code/state | 503; сессия не создаётся |
| POST /api/early-access/download с JSON {} | 503; нет signed URL |
| Мобильная и desktop страница /early-access | Нет ошибок интерфейса, вход недоступен |

Не использовать старый callback URL или настоящие code/state для smoke-проверок.
Не запускать вход, не загружать платные файлы, не выполнять SQL.
Реальная проверка recovery требует отдельного разрешения на включение OAuth:
один новый вход, проверка status/подписки, повтор callback без новой сессии,
logout и вход без разрешённого tier. HTTP 303 сам по себе не означает доступ.

## Откат

1. До выпуска убедиться, что отключённая сборка
   `GFT7YMG5XSKWt6sGUuchk8GFyrfB` сохранена и доступна для возврата. На Hobby
   Instant Rollback ограничен предыдущей production-сборкой; проверить выбор
   в Dashboard, не предполагать доступность произвольного старого deployment.
2. При регрессии выбрать Instant Rollback на подтверждённую отключённую
   сборку, сверить ID и домен shinobinewera.com, подтвердить откат.
3. Проверить `loginEnabled=false`, start/callback/download 503 и страницы 200.
   Production-переменная должна остаться false. Rollback использует прежний
   снимок сборки/переменных, а не заново прочитанные настройки проекта.
4. Записать неудачный deployment ID, SHA и симптомы без токенов/URL callback.
   Не делать автоматических повторов deploy или включения OAuth.
5. При необходимости исправить Git отдельным `git revert` релизного коммита
   после разрешения владельца; не применять reset/force push. Пока действует
   rollback, новые push не должны автоматически заменить восстановленную сборку.

Откат БД не требуется: этот выпуск не содержит изменений Supabase.
