Начну с общего плана, потом дам готовый каркас «документации для разработки + роадмап», который вы можете сразу положить в репозиторий как docs/print-design-corp.md и по нему пилить проект.

1. Что делают крупные онлайн-типографии (короткий разбор)
ViperPrint (Польша) 
viperprint.pl
+2
viperprint.pl
+2

Главные особенности:

Жёсткая структура каталога: «Визитки», «Улотки», «Плакаты», «Календари», «Картонные упаковки» и т.п. – всегда один и тот же паттерн: категория → тип продукта → конфигуратор.

Конфигуратор шагами:

формат, бумага, печать 1/0, 4/4,

покрытие, доп. эффекты,

тираж,

сроки (термин стандартный / экспресс)
При каждом выборе сразу меняется цена и сроки производства. 
viperprint.pl
+1

Сильный акцент на логистике: практически везде отображаются сроки изготовления и доставки, иногда отдельная вкладка «Terminy».

Полный онлайн-цикл: загрузка файла, проверка статуса, счёт/фактура онлайн, отслеживание заказа. 
viperprint.pl

Flyeralarm 
FLYERALARM
+2
FLYERALARM
+2

Каталог очень широкий: от базовой полиграфии до текстиля, POS-материалов и т.д.

Множество вариаций одного продукта: бизнес-карты с разными материалами, эффектами, углами, формой.

Отдельная платформа для реселлеров (Flyeralarm PRO) – личный кабинет перепродавца с улучшенными ценами и фокусом на B2B-клиентов. 
FLYERALARM PRO

Хорошие практики UX:

подсказки/FAQ прямо на продуктовых страницах,

много визуальных примеров (mockup’ы, фото),

«best seller»/«top price-performance» бейджи.

VistaPrint 
vistaprint.com
+3
vistaprint.com
+3
vistaprint.com
+3

Сильный фокус на простоте для непрофессионалов:

шаблоны по отраслям,

встроенный дизайнер/редактор,

3D-превью визитки перед заказом. 
vistaprint.com

Разделение по «линейкам качества»: стандарт, премиум, премиум+ (толщина, бумага, отделка). 
vistaprint.com
+1

Хорошие upsell-паттерны:

блоки «рекомендуем к этому продукту» (letterhead, конверты, наклейки),

предложение более премиальной бумаги/отделки «+X €».

Общие best practices для web-to-print и конфигураторов

По итогам статей по web-to-print и product configurator’ам: 
imprintnext.com
+5
factory.dev
+5
commerce-ui.com
+5

Конфигуратор в несколько понятных шагов (визуально разделённых): 1) формат, 2) материал, 3) отделка, 4) тираж, 5) сроки, 6) файл.

Всегда показывать живую цену + ориентировочную дату доставки.

Возможность сохранить конфигурацию и вернуться позже.

Возможность быстро повторить прошлый заказ.

Много визуальных подсказок: примеры печати, mockup’ы, фото, схемы вылетов и зон реза.

Грамотное отображение ошибок и требований к файлам (разрешение, вылеты, цветовой профиль).

2. Как улучшить ваш план на основе этого

По сравнению с вашим документом, стоит добавить/усилить:

Страницы доверия:

Требования к файлам (подготовка макетов),

Сроки производства и доставка,

Оплата и возвраты,

FAQ.

Модуль повторения заказов и шаблонов:

«Повторить заказ» с изменением только тиража/срока.

Модуль партнёрских аккаунтов (агентства) – как у Flyeralarm PRO, но можно сделать мини-версию:

спец. цены,

суб-клиенты,

брендированные фактуры.

Более детальная модель цен:

разделить цену на печать + послепечатка + логистика,

дать возможность быстро менять прайс, не трогая код.

Инфраструктура и деплой:

окружения: dev, staging, prod,

единая схема настроек (.env, Prisma миграции),

минимальный CI/CD, чтобы не было «сюрпризов» при деплое.

Дальше – обещанный «большой документ». Ты можешь прямо копипастнуть его в репу.

3. Документация для разработки Print Design Corp (v1)
3.1. Общее описание

Название: Print Design Corp
Домен: https://print.designcorp.eu
Роль: онлайн-полиграфия + личный кабинет клиентов + база для будущих партнёрских аккаунтов.

Цели:

Простой и быстрый заказ базовой полиграфии (визитки, листовки, плакаты и т.д.).

Максимально автоматизированный цикл: от конфигурации товара до фактуры и статуса производства.

Единая точка входа для будущих партнёров-агентств (white-label и реселлеры).

3.2. Сайт-мап (структура страниц)
Публичная часть

/ — Главная

Hero: «Онлайн-полиграфия для бизнеса»

Популярные продукты (карточки)

Преимущества (скорость, качество, автоматизация, интеграция с Group Design Corp)

CTA: «Каталог продукции», «Войти в кабинет»

/products — Каталог

Список категорий: визитки, листовки, плакаты, баннеры, наклейки, календари, каталоги, упаковка и т.п.

/products/:category — Страница категории

Список продуктов (варианты по формату/качества/технологии)

/products/:category/:slug — Страница продукта (конфигуратор)

Краткое описание

Шаги конфигурации

Реальное обновление цены и сроков

Загрузка макетов

Кнопка «Добавить в корзину»

/cart — Корзина

Позиции, итоги, налог, доставка

CTA: «Оформить заказ»

/checkout — Оформление заказа

Авторизация/регистрация/гостевой вариант (по желанию)

Адрес доставки и данные для фактуры

Способ доставки

Способ оплаты

/login, /register, /reset-password

Страницы доверия:

/file-requirements — Требования к макетам (вылеты, цвета, PDF/X и т.д.)

/delivery-and-payment — Доставка и оплата

/about — О компании / инфраструктура

/contact — Контакты, форма связи

/faq — Часто задаваемые вопросы

опционально: /blog — статьи про дизайн/полиграфию

Личный кабинет клиента

Пространство /account/* (после авторизации).

/account — Дашборд (сводка последних заказов, быстрые действия)

/account/orders

список заказов

фильтры по статусу, дате

/account/orders/:id

детали заказа,

статус (хронология),

ссылка на макеты,

кнопка «Повторить заказ»,

кнопка «Скачать фактуру (PDF)».

/account/invoices

список фактур,

скачивание PDF.

/account/files

все загруженные макеты (с привязкой к заказам),

возможность переиспользовать в новом заказе.

/account/addresses

адреса доставки,

адреса для фактур,

адрес по умолчанию.

/account/profile

имя, компания, NIP/VAT, e-mail, телефон,

язык интерфейса,

смена пароля.

(будущее) /account/partner

для агентств: маржа, заказы клиентов, отчёты.

Кабинет администратора

Можно сделать отдельным namespace: /admin/* (потом вынести в subdomain admin.print.designcorp.eu, если нужно).

Основные разделы:

/admin/dashboard

число заказов, оборот, статус производства

/admin/orders

список всех заказов

фильтры: статус, клиент, диапазон дат, тип продукта

/admin/orders/:id

данные клиента, состав заказа

ссылки на макеты/файлы

изменение статуса (workflow)

/admin/products

список продуктов

создание/редактирование продукта

привязка конфигураторов и прайс-таблиц

/admin/price-tables

интерфейс работы с ценовыми таблицами (по продукту)

/admin/users

клиенты

флаги «агентство / обычный клиент»

/admin/settings

общие настройки: налоговая ставка, реквизиты компании, формат номеров заказов и фактур

/admin/invoices

поиск и просмотр сгенерированных фактур

4. Архитектура и стек
4.1. Frontend

Next.js (App Router), TypeScript

Tailwind CSS (без Figma – дизайн-система в коде)

Компонентный набор (по желанию): shadcn/ui как база.

Управление состоянием:

глобальное – React Query / TanStack Query для данных с сервера;

конфигураторы продуктов – Zustand.

Мультиязычность:

Next.js i18n routing (например: pl, en, ru, ua),

текстовые ресурсы в JSON/TS.

4.2. Backend

Зависит от того, хотите ли вы «единый монолит Next.js» или выделенный backend.

Вариант А (проще на старте): всё в Next.js

API-роуты (REST) / server actions для:

продуктов, конфигов, корзины,

заказов, оплат, фактур.

Серверный рендеринг страниц каталога и продукта.

Вариант B (более enterprise): отдельный backend (NestJS/Express)

api.print.designcorp.eu:

авторизация/регистрация,

CRUD по продуктам, прайсам, заказам,

интеграция с платёжкой,

генерация фактур (можно вынести в worker).

В любом случае:

БД: PostgreSQL

ORM: Prisma

Файлы: S3-совместимое хранилище (Hetzner / MinIO)

Очереди / фоновые задачи: n8n + webhooks (либо простой cron/worker).

4.3. Интеграции

Провайдер оплаты: Stripe / PayU / Przelewy24 / BLIK – делаем через абстракцию PaymentProvider (не хардкодим Stripe везде).

n8n:

триггеры по webhooks: новый заказ, смена статуса, неудачный платёж,

отправка e-mail’ов/уведомлений,

автоматическое создание задач для производства (на будущее).

5. Модель данных (черновой ERD)

Коротко по основным сущностям (имена – как в Prisma):

Пользователи и роли

User

id

email

passwordHash

name

companyName

vatNumber (NIP)

phone

role (CUSTOMER, ADMIN, PARTNER)

createdAt, updatedAt

Address

id

userId

type (SHIPPING, BILLING)

companyName, fullName

street, city, postalCode, country

isDefault

Товары и конфигурации

Product

id

category (BUSINESS_CARD, FLYER, …)

slug

name

description

isActive

ProductOptionGroup

id

productId

name (Размер, Бумага, Покрытие, Тираж, Срок)

type (SELECT, RADIO, NUMBER, MULTISELECT)

order

ProductOption

id

groupId

value (90x50, 350g матовая, soft touch, 1000 шт, экспресс 48ч)

code (для прайсов, типа SIZE_90x50)

priceFactor (если простой случай)

isDefault

Прайсы

PriceTable

id

productId

name (например, «Визитки стандартные офсет»)

currency

validFrom, validTo

PriceRow

id

priceTableId

optionsCombinationHash (хэш набора опций: размер+бумага+покрытие+тираж+срок)

basePrice

productionDays

minQuantity, maxQuantity (если диапазоны)

PriceAdjustment (опционально)

надбавки/скидки по опциям или статусу клиента (агентская скидка).

Корзина и заказы

Cart

id

userId (опционально – для гостя можно cookie)

createdAt, updatedAt

CartItem

id

cartId

productId

options (JSON со всеми выбранными опциями)

unitPrice

quantity

totalPrice

Order

id

orderNumber (формат типа PD-YYYYMMDD-XXXX)

userId

status (PENDING_PAYMENT, PAID, IN_PRODUCTION, SHIPPED, COMPLETED, CANCELLED)

totalNet, totalVat, totalGross

currency

billingAddressId, shippingAddressId

paymentMethod, paymentStatus

createdAt, updatedAt

OrderItem

id

orderId

productId

productNameSnapshot

options (JSON)

unitPrice

quantity

totalPrice

Файлы и фактуры

File

id

userId

orderItemId (опционально)

url

originalName

mimeType

size

usage (ARTWORK, INVOICE_PDF и т.д.)

Invoice

id

orderId

invoiceNumber

issueDate

totalNet, totalVat, totalGross

currency

fileId (PDF)

status (ISSUED, CANCELLED)

6. Ключевые бизнес-процессы
6.1. Конфигурация и расчёт цены

Пользователь заходит на /products/:slug.

Выбирает опции в конфигураторе.

Front собирает options и отправляет на API /pricing/quote.

Backend:

строит optionsCombinationHash,

ищет PriceRow,

высчитывает итог: basePrice * quantity + надбавки/скидки,

возвращает цену и ориентировочный срок готовности.

Front — моментально обновляет цену и сроки.

6.2. Заказ

Пользователь добавляет позиции в /cart.

На /checkout выбирает:

адрес доставки/фактуры,

способ доставки,

способ оплаты.

Для онлайн-оплаты:

создаём Order со статусом PENDING_PAYMENT,

создаём платёж через PaymentProvider,

редиректим на платёжную страницу.

После успешного платежа (webhook):

обновляем Order.status = PAID,

запускаем workflow производства (через n8n),

генерируем фактуру (если это политика компании).

6.3. Производство и статусы

Статусы:

PAID → IN_PREPRESS → IN_PRODUCTION → READY_FOR_SHIPPING → SHIPPED → COMPLETED.

Изменения статусов происходят:

либо вручную в /admin/orders/:id,

либо по интеграции с внутренними системами типографии.

При каждом изменении:

логируем (OrderStatusHistory),

уведомляем клиента (e-mail / SMS, опционально).

7. Среды, конфигурация и деплой (чтобы не было боли)
7.1. Окружения

Минимум:

local — разработка,

staging — тестовый сервер (например, staging.print.designcorp.eu),

production — боевой (print.designcorp.eu).

7.2. Настройки (.env)

Разделяем:

DATABASE_URL

STORAGE_ENDPOINT, STORAGE_ACCESS_KEY, STORAGE_SECRET_KEY, STORAGE_BUCKET

PAYMENT_PROVIDER_*

NEXTAUTH_SECRET (если используете NextAuth)

BASE_URL (для генерации ссылок в письмах и PDF)

Все переменные описать в docs/configuration.md.

7.3. Миграции и сиды

Prisma:

миграции через prisma migrate,

запрещаем деплой без прогнанных миграций.

Сиды:

базовые категории, продукт «Визитки», несколько тестовых прайсов.

7.4. CI/CD (минимальный)

GitHub Actions / GitLab CI:

шаги:

npm install

npm run lint && npm run test (по мере появления тестов)

npm run build

при success — деплой на staging/production (rsync/docker/pm2 — как в остальных проектах Group Design Corp).

Перед выкаткой на prod:

автоматический prisma migrate deploy.

8. Роадмап разработки (практический)
Фаза 0. Подготовка инфраструктуры

Цель: чистый старт без хаоса при деплое.

Создать репозиторий print-designcorp (monorepo или отдельный).

Добавить:

Next.js + Tailwind + TypeScript,

Prisma + PostgreSQL (подключиться к уже настроенной БД на Hetzner или поднять новую).

Настроить окружения:

dev сервер на dev.print.designcorp.eu,

staging на staging.print.designcorp.eu (можно позже),

prod на print.designcorp.eu.

Настроить Nginx reverse proxy и SSL (по аналогии с beauty.designcorp.eu).

Создать docs/ и поместить туда этот документ.

Фаза 1. Базовый UI и дизайн-система в Tailwind

Без Figma, всё в коде.

Определить:

цветовую палитру (brand цвета Print Design Corp),

типографику,

базовые отступы/радиусы.

Сделать общие компоненты:

кнопки, инпуты, селекты, чекбоксы,

карточки продуктов,

лейауты (header, footer, контейнер, breadcrumbs).

Собрать:

/ (главная, статичная),

/products (просто список категорий с мок-данными),

/login, /register.

Фаза 2. Модель данных и каталог (визитки как MVP)

Цель: запустить первую реальную категорию — визитки.

Ввести в Prisma модели из раздела 5 (минимальный набор).

Сидинг:

категория «Визитки»,

продукт «Визитки 90×50, 350 г, матовая».

Реализовать:

страницу категории /products/business-cards,

страницу продукта /products/business-cards/standard:

конфигуратор (формат, бумага, покрытие, тираж).

Фаза 3. Расчёт цены и корзина

Реализовать API /api/pricing/quote и простую PriceTable/PriceRow.

Реализовать:

добавление в корзину (/cart),

редактирование количества,

пересчёт итогов.

Связать корзину с авторизованным пользователем + гостевой режим по cookie.

Фаза 4. Checkout и заказы (без онлайн-оплаты)

Реализовать /checkout:

формы адресов, реквизитов,

создание Order и OrderItem по данным корзины.

Статус заказа пока: PENDING_PAYMENT / CONFIRMED (если оплата оффлайн).

Сделать:

/account + /account/orders + /account/orders/:id.

В админке:

/admin/orders + просмотр и изменение статусов.

Фаза 5. Онлайн-оплата

Подключить выбранного провайдера:

абстрактный сервис PaymentProvider,

создание платежа и обработка webhooks.

Изменение статусов:

при PAID запускать workflow «в производство».

Добавить отправку e-mail’ов через простой SMTP или через n8n.

Фаза 6. Фактуры (PDF)

Решить, чем генерировать:

либо server-side HTML → PDF (Puppeteer),

либо pdfkit.

Реализовать:

сущность Invoice,

генерацию при Order.status → PAID,

сохранение PDF в S3 и ссылку в Invoice.fileId.

В /account/invoices — список и скачивание;

В /admin/invoices — поиск и просмотр.

Фаза 7. Расширение каталога и UX

Добавить новые категории: листовки, плакаты, наклейки.

Доработать конфигураторы:

подсказки, иконки, требования к макетам.

Добавить «Повторить заказ».

Добавить больше UX-фишек (по мотивам VistaPrint/Flyeralarm):

рекомендуемые продукты,

бейджи «Top Seller».

Фаза 8. Партнёрские аккаунты и интеграции (future)

Роль PARTNER:

отдельный раздел /account/partner,

спец. прайсы/скидки,

отчёты по обороту.

Интеграция с Hub / Beauty:

единый логин (SSO),

общая база компаний/клиентов, если будете консолидировать.


Ниже — черновик ядра схемы под наш план для print.designcorp.eu. Его можно брать как основу и подрезать/расширять по ходу.

// schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ========================
// ENUMS
// ========================

enum UserRole {
  CUSTOMER
  ADMIN
  PARTNER
}

enum AddressType {
  SHIPPING
  BILLING
}

enum ProductCategory {
  BUSINESS_CARD
  FLYER
  POSTER
  BANNER
  STICKER
  CALENDAR
  BROCHURE
  PACKAGING
  OTHER
}

enum ProductOptionInputType {
  SELECT
  RADIO
  NUMBER
  MULTISELECT
}

enum OrderStatus {
  PENDING_PAYMENT
  PAID
  IN_PREPRESS
  IN_PRODUCTION
  READY_FOR_SHIPPING
  SHIPPED
  COMPLETED
  CANCELLED
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}

enum PaymentMethod {
  ONLINE
  BANK_TRANSFER
  CASH_ON_DELIVERY
}

enum FileUsage {
  ARTWORK
  INVOICE
  OTHER
}

enum InvoiceStatus {
  ISSUED
  CANCELLED
}

enum Currency {
  PLN
  EUR
  USD
}

// ========================
// USERS & AUTH
// ========================

model User {
  id           Int       @id @default(autoincrement())
  email        String    @unique
  passwordHash String
  name         String?
  companyName  String?
  vatNumber    String?   // NIP/VAT
  phone        String?
  role         UserRole  @default(CUSTOMER)

  addresses    Address[]
  carts        Cart[]
  orders       Order[]
  files        File[]
  statusLogs   OrderStatusHistory[] @relation("StatusChangedBy")

  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

model Address {
  id          Int         @id @default(autoincrement())
  user        User        @relation(fields: [userId], references: [id])
  userId      Int
  type        AddressType
  companyName String?
  fullName    String
  street      String
  city        String
  postalCode  String
  country     String
  isDefault   Boolean     @default(false)

  ordersShipping Order[]  @relation("ShippingAddress")
  ordersBilling  Order[]  @relation("BillingAddress")

  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

// ========================
// PRODUCTS & CONFIG
// ========================

model Product {
  id          Int                  @id @default(autoincrement())
  category    ProductCategory
  slug        String
  name        String
  description String?
  isActive    Boolean              @default(true)

  optionGroups ProductOptionGroup[]
  priceTables  PriceTable[]
  orderItems   OrderItem[]

  createdAt   DateTime             @default(now())
  updatedAt   DateTime             @updatedAt

  @@unique([category, slug])
}

model ProductOptionGroup {
  id        Int                    @id @default(autoincrement())
  product   Product                @relation(fields: [productId], references: [id])
  productId Int

  name      String                 // "Размер", "Бумага", "Покрытие" и т.д.
  code      String                 // напр. SIZE, PAPER, FINISH
  inputType ProductOptionInputType
  sortOrder Int                    @default(0)

  options   ProductOption[]

  createdAt DateTime               @default(now())
  updatedAt DateTime               @updatedAt

  @@unique([productId, code])
}

model ProductOption {
  id          Int                 @id @default(autoincrement())
  group       ProductOptionGroup  @relation(fields: [groupId], references: [id])
  groupId     Int

  label       String              // "90x50 мм", "350g матовая" и т.п.
  value       String              // машинный код
  code        String?             // доп. код для прайсов (если нужно)
  priceFactor Decimal?            @db.Numeric(10, 4)
  isDefault   Boolean             @default(false)
  sortOrder   Int                 @default(0)

  createdAt   DateTime            @default(now())
  updatedAt   DateTime            @updatedAt

  @@unique([groupId, value])
}

// ========================
// PRICING
// ========================

model PriceTable {
  id         Int        @id @default(autoincrement())
  product    Product    @relation(fields: [productId], references: [id])
  productId  Int

  name       String
  currency   Currency   @default(PLN)
  validFrom  DateTime? 
  validTo    DateTime?

  rows       PriceRow[]

  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt
}

model PriceRow {
  id                    Int       @id @default(autoincrement())
  priceTable            PriceTable @relation(fields: [priceTableId], references: [id])
  priceTableId          Int

  // Хэш комбинации опций (размер+бумага+покрытие+срок и т.д.)
  optionsCombinationHash String

  // Диапазон тиража, если нужно
  quantityFrom          Int       @default(1)
  quantityTo            Int?      // null = без верхнего лимита

  unitNetPrice          Decimal   @db.Numeric(12, 4) // цена за единицу (нетто)
  productionDays        Int       @default(3)

  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  @@unique([priceTableId, optionsCombinationHash, quantityFrom])
}

// На будущее, если захотите сделать общие надбавки/скидки
model PriceAdjustment {
  id          Int        @id @default(autoincrement())
  product     Product?   @relation(fields: [productId], references: [id])
  productId   Int?

  name        String
  description String?
  factor      Decimal    @db.Numeric(8, 4) // 1.1 = +10%, 0.9 = -10%

  isActive    Boolean    @default(true)

  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

// ========================
// CART & ORDERS
// ========================

model Cart {
  id        Int        @id @default(autoincrement())
  user      User?      @relation(fields: [userId], references: [id])
  userId    Int?
  sessionId String?    @unique // для гостей по cookie

  items     CartItem[]

  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}

model CartItem {
  id          Int       @id @default(autoincrement())
  cart        Cart      @relation(fields: [cartId], references: [id])
  cartId      Int

  product     Product   @relation(fields: [productId], references: [id])
  productId   Int

  // Выбранные опции в виде JSON (читаемо на фронте)
  options     Json

  quantity    Int       @default(1)
  unitNetPrice Decimal  @db.Numeric(12, 4)
  totalNet    Decimal   @db.Numeric(12, 4)

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Order {
  id             Int          @id @default(autoincrement())
  orderNumber    String       @unique
  user           User         @relation(fields: [userId], references: [id])
  userId         Int

  status         OrderStatus  @default(PENDING_PAYMENT)

  totalNet       Decimal      @db.Numeric(12, 2)
  totalVat       Decimal      @db.Numeric(12, 2)
  totalGross     Decimal      @db.Numeric(12, 2)
  currency       Currency     @default(PLN)

  billingAddress  Address     @relation("BillingAddress", fields: [billingAddressId], references: [id])
  billingAddressId Int

  shippingAddress  Address     @relation("ShippingAddress", fields: [shippingAddressId], references: [id])
  shippingAddressId Int

  paymentMethod   PaymentMethod?
  paymentStatus   PaymentStatus @default(PENDING)
  paymentReference String?      // id транзакции провайдера

  items          OrderItem[]
  invoices       Invoice[]
  statusHistory  OrderStatusHistory[]

  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
}

model OrderItem {
  id          Int       @id @default(autoincrement())
  order       Order     @relation(fields: [orderId], references: [id])
  orderId     Int

  product     Product   @relation(fields: [productId], references: [id])
  productId   Int

  productNameSnapshot String // название на момент заказа
  options             Json   // конфиг на момент заказа

  quantity           Int     @default(1)
  unitNetPrice       Decimal @db.Numeric(12, 4)
  totalNet           Decimal @db.Numeric(12, 4)

  files             File[]   @relation("OrderItemFiles")

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

// ========================
// FILES & INVOICES
// ========================

model File {
  id           Int       @id @default(autoincrement())
  user         User?     @relation(fields: [userId], references: [id])
  userId       Int?

  // связь с позицией заказа (можно null для общих файлов)
  orderItem    OrderItem? @relation("OrderItemFiles", fields: [orderItemId], references: [id])
  orderItemId  Int?

  url          String
  originalName String
  mimeType     String
  size         Int
  usage        FileUsage @default(ARTWORK)

  invoice      Invoice?

  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

model Invoice {
  id            Int          @id @default(autoincrement())
  order         Order        @relation(fields: [orderId], references: [id])
  orderId       Int

  invoiceNumber String       @unique
  issueDate     DateTime

  totalNet      Decimal      @db.Numeric(12, 2)
  totalVat      Decimal      @db.Numeric(12, 2)
  totalGross    Decimal      @db.Numeric(12, 2)
  currency      Currency     @default(PLN)

  status        InvoiceStatus @default(ISSUED)

  file          File         @relation(fields: [fileId], references: [id])
  fileId        Int

  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
}

// ========================
// ORDER STATUS HISTORY
// ========================

model OrderStatusHistory {
  id          Int         @id @default(autoincrement())
  order       Order       @relation(fields: [orderId], references: [id])
  orderId     Int

  fromStatus  OrderStatus?
  toStatus    OrderStatus

  changedBy   User?       @relation("StatusChangedBy", fields: [changedByUserId], references: [id])
  changedByUserId Int?

  comment     String?

  createdAt   DateTime    @default(now())
}
