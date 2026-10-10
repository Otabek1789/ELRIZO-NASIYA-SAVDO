export const CATS = ["Electronics", "Fashion", "Home", "Beauty", "Kids", "Sport", "Food", "Books"]

const NAME_POOL = {
  Electronics: [
    "Simsiz quloqchin Pro X2",
    "Aqlli soat Fit 5",
    "Quvvatlash banki 20000mAh",
    "4K web-kamera",
    "Bluetooth kolonka Boom",
    "Mexanik klaviatura RGB",
    "Portativ SSD disk 1TB",
    "Simsiz sichqoncha Silent",
  ],
  Fashion: [
    "Erkaklar sport kostyumi",
    "Ayollar yozgi ko'ylagi",
    "Denim kurtka Classic",
    "Sport krossovka AirRun",
    "Yun sviter Comfort",
    "Charm hamyon",
    "Bosh kiyim beysbolka",
    "Zamonaviy futbolka Basic",
  ],
  Home: [
    "Oshxona kombayni Pro",
    "Chang yutgich Robot X1",
    "Yostiq to'plami (4 dona)",
    "Divan uchun pled",
    "Choynak elektr 1.8L",
    "LED stol lampasi",
    "Idish yuvish gubkasi to'plami",
    "Oshxona pichoq to'plami",
  ],
  Beauty: [
    "Yuz uchun seruma Vit-C",
    "Shampun tabiiy 500ml",
    "Parfyum Aroma Elegance",
    "Foundation krem SPF20",
    "Soch quritgich Ion Pro",
    "Lab bo'yog'i Matte",
    "Tirnoq lak to'plami",
    "Yuz maskasi (5 dona)",
  ],
  Kids: [
    "Yumshoq o'yinchoq ayiqcha",
    "Konstruktor 500 dona",
    "Bolalar velosipedi 16'",
    "Rangli qalamlar to'plami",
    "Bolalar sport kiyimi",
    "Interaktiv robot o'yinchoq",
    "Bolalar ryukzagi",
    "Puzzle 1000 bo'lak",
  ],
  Sport: [
    "Yoga gilamchasi Pro",
    "Gantel to'plami 2x5kg",
    "Trenajor uchun qo'lqop",
    "Sport butilkasi 1L",
    "Fitnes rezinka to'plami",
    "Velosiped dubulg'asi",
    "Sport sumka Training",
    "Skakalka tezkor",
  ],
  Food: [
    "Tabiiy asal 500g",
    "Qora choy premium 200g",
    "Quritilgan mevalar assorti",
    "Zaytun moyi Extra 1L",
    "Yong'oq aralashmasi 400g",
    "Qahva doni Arabica 250g",
    "Pechene assortisi",
    "Makaron uchligi 900g",
  ],
  Books: [
    "Zamonaviy roman to'plami",
    "Bolalar ertaklari kitobi",
    "Biznes strategiya qo'llanmasi",
    "She'riyat antologiyasi",
    "Ingliz tili grammatikasi",
    "Oshpazlik retseptlar kitobi",
    "Tarix entsiklopediyasi",
    "Motivatsion kitob",
  ],
}

function genProducts() {
  let id = 1
  const out = []
  CATS.forEach((cat) => {
    NAME_POOL[cat].forEach((name) => {
      const base = 35000 + ((id * 3719) % 480000)
      const hasDiscount = id % 3 === 0
      const price = Math.round(base / 1000) * 1000
      const old = hasDiscount ? Math.round((price * 1.28) / 1000) * 1000 : null
      out.push({
        id,
        name,
        cat,
        price,
        old,
        rating: (3.6 + (id % 14) / 10).toFixed(1),
        reviews: 12 + ((id * 17) % 480),
        stock: (id * 7) % 37,
        sold: (id * 23) % 900,
        isNew: id % 5 === 0,
      })
      id++
    })
  })
  return out
}

export const ALL_PRODUCTS = genProducts()

export const ORDERS = [
  { id: "BZ-10482", customer: "Dilnoza Yusupova", date: "2026-08-24", amount: 842000, status: "delivered" },
  { id: "BZ-10481", customer: "Javlon Karimov", date: "2026-08-24", amount: 265000, status: "shipped" },
  { id: "BZ-10480", customer: "Madina Tosheva", date: "2026-08-23", amount: 1240000, status: "processing" },
  { id: "BZ-10479", customer: "Sardor Aliyev", date: "2026-08-23", amount: 98000, status: "pending" },
  { id: "BZ-10478", customer: "Nilufar Rashidova", date: "2026-08-22", amount: 456000, status: "cancelled" },
  { id: "BZ-10477", customer: "Otabek Nazarov", date: "2026-08-22", amount: 322000, status: "delivered" },
  { id: "BZ-10476", customer: "Kamola Ergasheva", date: "2026-08-21", amount: 715000, status: "delivered" },
  { id: "BZ-10475", customer: "Bekzod Yoldashev", date: "2026-08-21", amount: 189000, status: "shipped" },
]

export const CUSTOMERS = [
  { name: "Dilnoza Yusupova", email: "+998 90 123 45 67", orders: 14, spent: 5240000, joined: "2024-03-11", seg: "vip" },
  { name: "Javlon Karimov", email: "+998 93 456 78 90", orders: 6, spent: 1580000, joined: "2025-01-22", seg: "regular" },
  { name: "Madina Tosheva", email: "+998 91 222 33 44", orders: 22, spent: 8920000, joined: "2023-11-05", seg: "vip" },
  { name: "Sardor Aliyev", email: "+998 94 777 88 99", orders: 1, spent: 98000, joined: "2026-08-20", seg: "new" },
  { name: "Nilufar Rashidova", email: "+998 90 555 12 34", orders: 3, spent: 456000, joined: "2026-06-14", seg: "regular" },
  { name: "Otabek Nazarov", email: "+998 97 111 22 33", orders: 9, spent: 2340000, joined: "2024-09-30", seg: "regular" },
]

export const REVIEWS = [
  {
    name: "Dilnoza Y.",
    product: "Simsiz quloqchin Pro X2",
    rating: 5,
    text: "Ovoz sifati juda yaxshi, batareyasi ham uzoq ishlaydi. Tavsiya qilaman!",
    date: "2026-08-20",
    replied: false,
  },
  {
    name: "Javlon K.",
    product: "Oshxona kombayni Pro",
    rating: 4,
    text: "Yaxshi mahsulot, lekin yetkazib berish biroz kechikdi.",
    date: "2026-08-18",
    replied: true,
  },
  {
    name: "Madina T.",
    product: "Ayollar yozgi ko'ylagi",
    rating: 5,
    text: "O'lchami aniq, mato sifati zo'r. Rahmat!",
    date: "2026-08-16",
    replied: false,
  },
  {
    name: "Sardor A.",
    product: "Yoga gilamchasi Pro",
    rating: 3,
    text: "Yaxshi, lekin hidini yo'qotishga biroz vaqt ketdi.",
    date: "2026-08-14",
    replied: false,
  },
]

export function formatMoney(n, lang) {
  const formatted = n.toLocaleString("ru-RU")
  return lang === "en" ? `${formatted} UZS` : `${formatted} so'm`
}
