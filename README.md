# Elrizo — Zamonaviy E-Commerce Internet Magazini

Ushbu loyiha to'liq funksional, zamonaviy dizaynga ega internet do'kon bo'lib, React, Vite, Tailwind CSS va zamonaviy web texnologiyalari yordamida yaratilgan.

---

## 🚀 Texnik Talablar va Bajarilgan Imkoniyatlar (17 ta talab)

| # | Talab | Holati | Tavsifi |
|---|---|:---:|---|
| **1** | **uz ru en** | ✅ Bajarildi | 3 ta tilda (O'zbekcha, Ruscha, Inglizcha) to'liq lokalizatsiya qilingan interfeys. Til tanlagich Header va Admin panellarida mavjud. |
| **2** | **darklight** | ✅ Bajarildi | Zamonaviy Qorong'u (Dark) va Yorug' (Light) rejimlar. Tanlangan mavzu `localStorage`da eslab qolinadi. |
| **3** | **react + routes** | ✅ Bajarildi | React Router DOM v6 orqali barcha yo'nalishlar (`/`, `/catalog`, `/about`, `/contact`, `/faq`, `/cart`, `/favorites`, `/login`, `/admin/*`) sozlandi. |
| **4** | **tailwindcss** | ✅ Bajarildi | Tailwind CSS v3 orqali tayyorlangan moslashuvchan (responsive) va zamonaviy UI dizayn. |
| **5** | **landing page - 5ta page** | ✅ Bajarildi | 5 ta to'liq asosiy sahifa: <br>1. **Bosh sahifa** (`/`)<br>2. **Katalog** (`/catalog`)<br>3. **Biz haqimizda** (`/about`)<br>4. **Do'kon xaritasi & Aloqa** (`/contact`)<br>5. **Savol-javob & Yetkazish** (`/faq`) |
| **6** | **admin panel + dashboard** | ✅ Bajarildi | To'liq Admin boshqaruv paneli (`/admin`): Savdo statistikasi, haftalik diagramma, turkumlar ulushi, yangi buyurtmalar, tovarlar, mijozlar va promokodlar. |
| **7** | **telegram bot** | ✅ Bajarildi | Real Telegram Bot API integratsiyasi (`src/services/telegram.js`). Yangi buyurtma va murojaat xabarlari to'g'ridan-to'g'ri Telegram guruh/kanaliga yuboriladi. Admin panelda test tugmasi mavjud. |
| **8** | **localstorage** | ✅ Bajarildi | Savat, sevimlilar, tovarlar (CRUD), promokodlar, buyurtmalar, tizimga kirgan foydalanuvchi, mavzu va Telegram bot tokeni `localStorage`da saqlanadi. |
| **9** | **mahsulot CRUD** | ✅ Bajarildi | Admin panelda tovarlarni qo'shish (Add), tahrirlash (Edit) va o'chirish (Delete) imkoniyati. O'zgarishlar darhol sayt vitrinasida aks etadi. |
| **10** | **sevimlilar (izbranniy)** | ✅ Bajarildi | Mahsulotlarni sevimlilarga qo'shish/o'chirish, Headerdagi badge hisoblagich, suriluvchi Drawer va maxsus `/favorites` sahifasi. |
| **11** | **savat + promokod** | ✅ Bajarildi | Savatga qo'shish, sonini o'zgartirish, promokod tizimi (`UZBEK2026`, `SKIDKA10`, `SUPER20`, `FREE`). Chegirma va yetkazib berish avtomatik hisoblanadi. |
| **12** | **login (username yoki telefon) + parol** | ✅ Bajarildi | Kirishda foydalanuvchi nomi yoki telefon raqami (`+998...`) va parol orqali autentifikatsiya. Ro'yxatdan o'tish va 1-bosishda Demo admin/mijoz kirish imkoniyati. |
| **13** | **online sotiladigan magazin** | ✅ Bajarildi | To'liq onlayn xarid jarayoni: tovar tanlash, savat, manzil kiritish, to'lov usulini tanlash (Payme, Click, Uzum, Naqd), buyurtma berish va ID generatsiyasi. |
| **14** | **github + vercel** | ✅ Bajarildi | Vercel uchun `vercel.json` SPA routing fayli tayyorlandi, loyiha xatosiz build bo'ladi (`npm run build`). |
| **15** | **search** | ✅ Bajarildi | Headerda jonli qidiruv takliflari (Live preview dropdown) va Katalog sahifasida to'liq qidiruv filtri. |
| **16** | **saralash + filtr + sort** | ✅ Bajarildi | Turkumlar, narx oralig'i (Min - Max), faqat omborda borlari, faqat chegirmadagilar, 4+ yulduzli reyting filtrlari hamda 7 xil saralash (narx, ommaboplik, yangilik va h.k.). |
| **17** | **xaritada joylashuvi** | ✅ Bajarildi | 4 ta filial uchun interaktiv xarita (OpenStreetMap), Google Xaritalar va Yandex Xaritalar orqali yo'nalish olish tugmalari (`/contact`). |

---

## 🔑 Demo Kirish Ma'lumotlari

Test qilish uchun qulay 1-klik tugmalari kirish oynasida mavjud:

- **Admin hisobi:**
  - Login / Telefon: `admin` yoki `+998900000001`
  - Parol: `admin123`
  - Roli: `admin` (Admin panelga to'liq ruxsat)

- **Mijoz hisobi:**
  - Login / Telefon: `user` yoki `+998901234567`
  - Parol: `user123`
  - Roli: `customer`

---

## 🏷 Amaldagi Promokodlar

Savatda yoki buyurtma berishda quyidagi promokodlarni kiritib sinab ko'rishingiz mumkin:
- `UZBEK2026` — 15% chegirma
- `SKIDKA10` — 10% chegirma
- `SUPER20` — 20% chegirma
- `FREE` — Bepul yetkazib berish (Free delivery)

---

## 🤖 Telegram Bot Sozlamalari

Yangi buyurtmalar va saytdan yuborilgan murojaatlar avtomatik ravishda Telegram botga yuboriladi.

1. `/admin/settings` sahifasiga kiring.
2. O'zingizning **Bot Token** va **Chat ID** ma'lumotlaringizni kiriting.
3. **"Test xabar yuborish"** tugmasini bosing.
4. Xarid amalga oshirilganda buyurtma tafsilotlari darhol Telegramga keladi!

---

## 📦 Loyihani Ishga Tushirish

```bash
# 1. Bog'liqliklarni o'rnatish
npm install

# 2. Mahalliy serverni ishga tushirish
npm run dev

# 3. Production uchun build qilish
npm run build
```

---

## 🌐 GitHub va Vercel-ga Joylash

### 1. GitHub-ga yuklash:
```bash
git init
git add .
git commit -m "feat: complete ecommerce app with all 17 requirements"
git branch -M main
git remote add origin https://github.com/<sizning-username>/<repo-nomi>.git
git push -u origin main
```

### 2. Vercel-ga deploy qilish:
1. [vercel.com](https://vercel.com) saytiga kiring va GitHub hisobingiz orqali kiring.
2. **"Add New Project"** tugmasini bosing.
3. Ushbu GitHub repozitoriyasini tanlang.
4. **Deploy** tugmasini bosing (loyihadagi `vercel.json` SPA routingni avtomatik to'g'ri ishlatadi).
