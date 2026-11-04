# SNE website redesign — 4 November 2026

Локальная ветка: `codex/complete-website-redesign`.
База: `301810e3effa2d1f1ae209165143c68b8702c2a8`; origin/main проверен перед работой.
На момент локального QA push, merge и Production deploy не выполнялись.
После просмотра предпросмотра владелец разрешил публикацию 4 ноября 2026 года.
SQL и migration repair не требуются и не выполняются.

Точка отката перед публикацией: Vercel `8Em2QRFW24Eun9b8VKywYuMxnGFN`,
Ready / Current, commit `301810e3effa2d1f1ae209165143c68b8702c2a8`.
При регрессии вернуть эту сборку через Vercel Instant Rollback;
если действие недоступно, выполнить revert release-коммита обычным коммитом
и дождаться автоматической сборки main. Force push не использовать.
Production-переменные и действующий OAuth сохраняются.

## Аудит

Next.js 16.2.10, React 19.2.4, App Router. Прочитаны package.json, layouts,
компоненты, маршруты, стили, SEO, SQL существующей схемы и серверный Early Access.
В репозитории нет специальной Vercel-конфигурации; next.config.ts без overrides.
Проверены только имена env, значения секретов не читались.

До редизайна версия и обещание «public in one week» повторялись независимо
в Home, About, Download и FAQ. На Home были неподтверждённые Players/Scenes.
Early Access не был согласован с публичными загрузками; Devlog отсутствовал.
HTML lang был ru при английском контенте. Несколько страниц наследовали
одинаковый title. Исправлены эти расхождения.

Изучены публичные сценарии и направления ссылок референса:
[Home](https://www.houseofshinobi.com/),
[Play](https://www.houseofshinobi.com/play),
[Guide & Downloads](https://www.houseofshinobi.com/guide),
[Early Access](https://www.houseofshinobi.com/early-access),
[Devlog](https://www.houseofshinobi.com/blog).
Полезная структура: явный выбор Play/Download, связанный release board,
загрузки вместе с changelog/guide, отдельная проверка доступа и журнал обновлений.
В чужую авторизацию не входили, файлы игры и исходный код не копировали.
Ассеты референса не использованы.

## Дизайн-система

- Фон #090b0f, поверхности #11151b, основной текст #f4f0e8.
- Красные действия #c83c31 и золотые акценты #d8b57b.
- Системная типографика: тяжёлые display-заголовки, Georgia для отдельных
  акцентов, monospace для технических меток. Внешние шрифты не загружаются.
- Shell до 1240 px, согласованные секции, панели, кнопки, таблицы, FAQ.
- Фиксированный Header, единый Footer, skip link, видимый keyboard focus.
- Лёгкий desktop parallax, пять CSS-частиц, reveal-анимации без скрытия
  контента при отсутствии JS. prefers-reduced-motion отключает движения.
- Next Image: eager/high priority Hero, lazy изображения ниже, responsive sizes.
- Галерея использует native dialog с Escape, стрелками и возвратом фокуса.

Использованы только уже существующие public/images. Содержимое public/game
и закрытые игровые CG не переносились в галерею. Отдельный официальный PNG/SVG
логотип пока не предоставлен; используется текстовый бренд, не новый «официальный» знак.

## Подтверждённые данные

Владелец сообщил: текущая публичная версия 0.4beta, следующая 0.4.
Дата и changelog не сообщены. Публичные ссылки в исходном коде подписаны v0.2b;
по указанию владельца они сохранены с исходной версией в раскрытом архиве.
Они не переименованы в 0.4beta. На Downloads есть прямой переход к ним.
Кнопки 0.4beta показывают ожидание подтверждения ссылок.

Неподтверждённые системные требования, статистика и относительное обещание
«через неделю» удалены. Точные игровые механики не выдумывались: guide
помечает отсутствие проверенного version-specific walkthrough.

## Единая модель релизов

Единственная точка чтения для страниц: `getReleaseCenter()` из
`lib/releases/server.js`. Home, Download и Early Access используют её;
Devlog использует тот же редакционный каталог через `getPosts()`.
Независимых hardcoded-версий в страницах больше нет.

Текущие источники имеют разные, явно определённые обязанности:

1. `lib/releases/catalog.mjs`: подтверждённые редакционные сведения публичных
   релизов и анонса; единственное место изменения публичной версии/ссылок/changelog.
2. Уже существующая `public.early_access_releases`: опубликованные приватные
   платформенные сборки. Серверный read-only адаптер использует текущие поля.
3. `lib/releases/model.mjs`: нормализация и явная безопасная публичная проекция.

Это общий read model, но **ещё не единый редактор релизов в Supabase**.
Поле `private_storage_paths` есть во внутренней модели, а реальное хранение
остаётся в существующих storage_bucket/object_path. В клиентскую проекцию
эти поля не попадают. Предоставляется id, version, platform и unlock date.
Неподтверждённые даты остаются null. Draft и чужие buckets не показываются.
Ошибка Supabase даёт отдельное состояние error, а не выдуманный релиз.
При локально выключенном auth сервер не обращается к БД за сборками.

Кэш: request-level React cache объединяет чтения внутри render. Статические
страницы и изображения используют механизмы Next. Общего кэша сессий,
подписок или signed URLs нет; их проверки остаются private/no-store.

### Предложение по расширению существующей схемы

Для текущего адаптера миграция не нужна и SQL-файл не добавлялся.
Если нужен единый Supabase back office для публичных релизов и публикаций,
следующий согласуемый шаг — расширить **эту же таблицу**, не создавать вторую:

| Поле модели | Сейчас | Предлагаемое хранение |
| --- | --- | --- |
| version | существующее поле / public catalog | существующее поле |
| title, description | catalog / безопасные общие подписи private | nullable text |
| release_type, status | определяются адаптером | text с CHECK, legacy default early_access |
| public_release_at | null до подтверждения | nullable timestamptz |
| early_access_at | существующее unlock_at | адаптер к unlock_at без дублирования даты |
| changelog | редакционный объект по шести категориям | jsonb object с валидацией |
| platforms | public список / private platform | группировка существующих строк по version |
| public_download_urls | существующие public URLs в catalog | public-only jsonb, только HTTPS |
| private_storage_paths | existing bucket/object_path, server-only | сохранить существующие поля |
| allowed_tier_ids | существующее поле | сохранить, не выдавать клиенту как источник прав |
| is_published, created_at | existing private / явные public значения | существующие поля |
| updated_at | null, если не подтверждено | новое timestamptz и контролируемое обновление |

Перед такой миграцией потребуется свежий read-only аудит схемы/constraints
и согласование conditional CHECK: public rows без object_path, private rows
обязательно с private bucket, object_path, unlock_at и allowed tiers.
Нельзя просто снять все ограничения. RLS и запрет client writes сохранить.
После миграции переключить адаптер, сверить версии, затем убрать public catalog
как источник данных. Текущие download API обязаны продолжать проверять private
row по id; существующие id/FK download_grants сохранить.

## Patreon и защита

OAuth start/callback/state, sessions, encryption, refresh, entitlement verification,
rate limiting, download API и signing не изменялись. Единственное дополнение
серверного status API — массив названий `tiers` после существующей live проверки.
Новая pure-функция фильтрует его по действующим allowed IDs. Это отображение,
не источник доступа. Provider user ID, tokens и cookie values клиенту не добавлены.

Client download отправляет прежний releaseId серверу. Кнопки отключены без active
статуса и до unlock date. Сервер по-прежнему решает доступ на каждом запросе.
При отказе download API интерфейс снимает устаревший active-статус:
unauthorized возвращает кнопку входа, access_denied показывает expired.
Возвращённая ссылка дополнительно проверяется на origin выделенного проекта
и signed storage endpoint. Никаких private/public переключений Storage нет.

Проект строго `avdkvtmugeizoqqvayek`. Старый игровой Supabase не затрагивался.
SubscribeStar — pending_approval; Boosty — under_review; фиктивного login нет.
Дополнительные env не нужны; существующие Production-переменные не изменялись.
Локально EARLY_ACCESS_AUTH_ENABLED=false. Read-only Production status во время
QA: 401 unauthorized и loginEnabled=true — действующий вход остаётся включённым.

## QA: фактически выполнено

| Проверка | Результат |
| --- | --- |
| npm run test | 29/29 PASS, provider/DB/signing тесты mock |
| ESLint изменённых JS/JSX/MJS/TS | PASS |
| npm run build | PASS; исходный EPERM дочерних процессов устранён запуском вне ограничения среды |
| /, /about, /characters, /play, /download, /early-access, /faq, /blog, /gallery | HTTP 200, уникальные title/canonical |
| /blog/not-a-real-post | HTTP 404; фиктивной статьи нет |
| sitemap.xml, robots.txt | HTTP 200, новые публичные маршруты в sitemap, API запрещены robots |
| Локальные status/start/callback/download | unavailable, loginEnabled=false; start/callback/download 503, noindex на API |
| Secret markers в .next/static/*.js | 0 файлов со service-role/client-secret/encryption-key/private-key markers |
| Mobile navigation | открытие, Escape, возврат фокуса PASS |
| Mobile layout, 390 px | все 9 публичных страниц без горизонтального переполнения; исправлена ширина Play |
| Gallery | фильтр, lightbox, стрелки, Escape, возврат фокуса PASS |
| Browser game | исходный архивный web build дошёл до title menu через read-only local proxy |
| Fullscreen | визуально открыл игровой экран; Escape проверен, поведение зависит от браузера |
| Недоступная game URL | реальный локальный HTTP 404 → понятная ошибка и Retry |
| Архив v0.2b | все три исходные ссылки сохранены |
| Public/private DTO | автоматические тесты исключают paths, secrets и private URLs |

Lighthouse mobile Home после исправлений доступности:
Performance **95**, Accessibility **100**, Best Practices **100**, SEO **100**.
FCP 1.0 s, LCP 3.0 s, TBT 60 ms, CLS 0. Это один локальный lab run,
не полевые Core Web Vitals; LCP выше ориентира 2.5 s. Результаты зависят
от машины, нагрузки и сети. Отчёт HTML/JSON сохранён вне Git.

Lighthouse mobile Downloads: Performance **100**, Accessibility **100**,
Best Practices **100**, SEO **100**. LCP 0.9 s, TBT 70 ms, CLS 0.
Это также локальный lab run с выключенным OAuth, без Production-секретов
и реального запроса списка релизов к Supabase.

Проверки с реальной Patreon-сессией **нового интерфейса** не выполнялись:
на этапе локального QA Production deploy ещё не был разрешён, секретов локально нет.
Предыдущие live тесты 301810e не объявляются тестами этого редизайна.
Reduced motion проверен по исходникам; системные настройки Windows не менялись.
Временные ошибки внешних сервисов покрыты mock-тестами, не созданием сбоев в production.

## Предпросмотр

- http://localhost:3011 — редизайн + существующая игра из исходного архива.
- http://localhost:3010 — непосредственно Next production server; public/game
  исключён sparse checkout, поэтому этот порт намеренно использован для 404-теста.
- Локальный proxy-файл `../redesign-local-preview.mjs` находится вне репозитория,
  слушает только loopback и читает исходные игровые assets, не меняя их.
- Скриншоты: `../redesign-preview/` (desktop/mobile Home, Downloads, Early Access).
- Lighthouse: `../redesign-lighthouse-home-final.report.html` и `.report.json`.
- Downloads Lighthouse: `../redesign-lighthouse-downloads.report.html` и `.report.json`.

После перезапуска компьютера: в каталоге репозитория установить для процесса
EARLY_ACCESS_AUTH_ENABLED=false и запустить `npm run start -- --hostname 127.0.0.1 --port 3010`,
затем отдельно `node ../redesign-local-preview.mjs`. Это локальные команды,
они не публикуют сайт. Для следующей локальной сборки выполнить npm run build.

## Что ещё нужно от владельца / перед публикацией

1. Официальный отдельный логотип PNG/SVG, если требуется вместо текстового бренда.
2. Подтверждённые URLs 0.4beta и возможных зеркал; сейчас оставлены старые v0.2b.
3. Реальные release notes, даты и публикации Devlog; до этого пустые состояния.
4. Проверенные подробные инструкции по игровым механикам и совместимости saves.
5. UI просмотрен, публикация разрешена владельцем 4 ноября 2026 года.
6. После разрешённой публикации — live проверка active/неподходящего tier,
   refresh/logout, повтор callback и отказа в скачивании без опубликованного релиза.
7. Для полевых CWV нужны реальные данные после публикации; текущий Lighthouse
   не гарантирует те же значения на Vercel или на устройствах игроков.

Никакие старые untracked docs/early-access-* и supabase/tests не относятся
к этому редизайну и не должны случайно попасть в будущий commit.

## Файлы редизайна (34)

- `app/about/page.js`
- `app/api/early-access/status/route.js`
- `app/blog/[slug]/page.js`
- `app/blog/page.js`
- `app/characters/page.js`
- `app/download/page.js`
- `app/early-access/AccessStatus.jsx`
- `app/early-access/config.js`
- `app/early-access/page.js`
- `app/early-access/SupporterAccess.jsx`
- `app/faq/page.js`
- `app/gallery/page.js`
- `app/globals.css`
- `app/layout.js`
- `app/page.js`
- `app/play/layout.js`
- `app/play/page.js`
- `app/redesign.css`
- `app/seo.js`
- `app/sitemap.ts`
- `components/CharacterCards.jsx`
- `components/Footer.jsx`
- `components/Gallery.jsx`
- `components/MotionScene.jsx`
- `components/Navbar.jsx`
- `components/ReleaseBoard.jsx`
- `components/Ui.jsx`
- `docs/website-redesign.md`
- `lib/early-access/presentation.mjs`
- `lib/releases/catalog.mjs`
- `lib/releases/model.mjs`
- `lib/releases/server.js`
- `lib/site-content.mjs`
- `tests/release-center.test.mjs`
