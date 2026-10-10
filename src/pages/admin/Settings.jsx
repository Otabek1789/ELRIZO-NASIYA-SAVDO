import { useState, useEffect } from 'react'
import { Send, CheckCircle2, ShieldAlert, Sparkles, MessageCircle, Bot } from 'lucide-react'
import { useLang } from '../../context/LangContext'
import {
  getTelegramConfig,
  saveTelegramConfig,
  sendTelegramMessage,
  DEFAULT_TELEGRAM_CONFIG,
} from '../../services/telegram'

const inputCls =
  'w-full px-3 py-2.5 rounded-xl border border-line dark:border-[#332C23] bg-surface dark:bg-[#16130F] text-ink dark:text-[#F3EFE7] text-xs outline-none focus:border-brand transition-colors'

export default function Settings() {
  const { t } = useLang()

  // Store general settings
  const [shopName, setShopName] = useState('Elrizo')
  const [shopEmail, setShopEmail] = useState('support@elrizo.uz')
  const [shopPhone, setShopPhone] = useState('+998 71 200 00 00')
  const [currency, setCurrency] = useState('UZS')

  // Telegram bot settings (Req 7)
  const [tgConfig, setTgConfig] = useState(DEFAULT_TELEGRAM_CONFIG)
  const [testStatus, setTestStatus] = useState(null) // { success: boolean, msg: string }
  const [testing, setTesting] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  // Gmail SMTP Settings
  const [gmailAppPass, setGmailAppPass] = useState(() => {
    try {
      return localStorage.getItem('elrizo_gmail_app_password') || ''
    } catch (e) {
      return ''
    }
  })
  const [gmailStatus, setGmailStatus] = useState(null)
  const [testingGmail, setTestingGmail] = useState(false)

  useEffect(() => {
    const cfg = getTelegramConfig()
    setTgConfig(cfg)
  }, [])

  const handleSaveAll = (e) => {
    e.preventDefault()
    saveTelegramConfig(tgConfig)
    try {
      localStorage.setItem('elrizo_gmail_app_password', gmailAppPass)
    } catch (e) {}
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  const handleTestTelegram = async () => {
    setTesting(true)
    setTestStatus(null)

    const testText = `🤖 <b>TEST XABAR (Elrizo Bot Integratsiyasi)</b>\n\n✅ Telegram bot muvaffaqiyatli ulandi!\n🕒 Vaqt: ${new Date().toLocaleString()}\n\n<i>Buyurtmalar va murojaatlar shu kanalga yuboriladi.</i>`

    const res = await sendTelegramMessage(testText, tgConfig)
    setTesting(false)

    if (res.success) {
      setTestStatus({
        success: true,
        msg: t.testSuccess,
      })
    } else {
      setTestStatus({
        success: false,
        msg: t.testFailed + (res.error ? ` (${res.error})` : ''),
      })
    }
  }

  const handleTestGmail = async () => {
    setTestingGmail(true)
    setGmailStatus(null)

    try {
      localStorage.setItem('elrizo_gmail_app_password', gmailAppPass)
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'otabek1789@gmail.com',
          code: '777888',
          appPassword: gmailAppPass,
        }),
      })
      const data = await res.json()
      setTestingGmail(false)

      if (data.success) {
        setGmailStatus({
          success: true,
          msg: "✅ Test xat otabek1789@gmail.com manziliga muvaffaqiyatli yuborildi! Pochtani ochib ko'ring (yuboruvchi 'me' deb chiqadi).",
        })
      } else {
        setGmailStatus({
          success: false,
          msg: "❌ Xatolik: " + (data.error || "Ilova paroli noto'g'ri"),
        })
      }
    } catch (err) {
      setTestingGmail(false)
      setGmailStatus({
        success: false,
        msg: "❌ Tarmoq xatosi: " + err.message,
      })
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-good-soft text-good text-xs font-bold flex items-center gap-2 shadow-sm animate-fadeIn">
          <CheckCircle2 size={16} />
          <span>Barcha sozlamalar muvaffaqiyatli saqlandi!</span>
        </div>
      )}

      {/* Telegram Bot Integration Section (Req 7) */}
      <div className="bg-surface-elevated dark:bg-[#211C17] border border-line dark:border-[#332C23] rounded-2xl shadow-card overflow-hidden">
        <div className="px-6 py-4.5 border-b border-line dark:border-[#332C23] flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-soft dark:bg-[#2A2140] text-brand flex items-center justify-center">
              <Bot size={18} />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-ink dark:text-[#F3EFE7]">
                {t.telegramBotTitle}
              </h3>
              <p className="text-[11px] text-ink-soft">{t.telegramBotDesc}</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-good-soft text-good text-xs font-bold">
            <CheckCircle2 size={13} />
            <span>{t.botStatusActive}</span>
          </span>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-ink-soft mb-1.5">
              {t.botTokenLabel}
            </label>
            <input
              type="text"
              value={tgConfig.botToken || ''}
              onChange={(e) => setTgConfig({ ...tgConfig, botToken: e.target.value })}
              placeholder="7689123456:AAFlk9DemoToken..."
              className={inputCls}
            />
            <p className="text-[11px] text-ink-faint mt-1">{t.botTokenDesc}</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink-soft mb-1.5">
              {t.chatIdLabel}
            </label>
            <input
              type="text"
              value={tgConfig.chatId || ''}
              onChange={(e) => setTgConfig({ ...tgConfig, chatId: e.target.value })}
              placeholder="-1002345678901 yoki 987654321"
              className={inputCls}
            />
            <p className="text-[11px] text-ink-faint mt-1">{t.chatIdDesc}</p>
          </div>

          <div className="flex items-center gap-4 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-ink dark:text-[#F3EFE7]">
              <input
                type="checkbox"
                checked={tgConfig.notifyOrders}
                onChange={(e) =>
                  setTgConfig({ ...tgConfig, notifyOrders: e.target.checked })
                }
                className="rounded text-brand"
              />
              <span>Yangi buyurtmalar haqida xabar berish</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-ink dark:text-[#F3EFE7]">
              <input
                type="checkbox"
                checked={tgConfig.notifyContacts}
                onChange={(e) =>
                  setTgConfig({ ...tgConfig, notifyContacts: e.target.checked })
                }
                className="rounded text-brand"
              />
              <span>Mijoz murojaatlari haqida xabar berish</span>
            </label>
          </div>

          {/* Test Status feedback */}
          {testStatus && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                testStatus.success ? 'bg-good-soft text-good' : 'bg-bad-soft text-bad'
              }`}
            >
              {testStatus.success ? <CheckCircle2 size={16} /> : <ShieldAlert size={16} />}
              <span>{testStatus.msg}</span>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleTestTelegram}
              disabled={testing}
              className="px-4 py-2.5 rounded-xl border border-line dark:border-[#332C23] hover:border-brand bg-surface dark:bg-[#16130F] text-xs font-bold text-ink dark:text-[#F3EFE7] flex items-center gap-2 transition-colors disabled:opacity-60"
            >
              <Send size={13} className="text-brand" />
              <span>{testing ? 'Yuborilmoqda...' : t.testTelegramBtn}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                saveTelegramConfig(tgConfig)
                setSavedSuccess(true)
                setTimeout(() => setSavedSuccess(false), 3000)
              }}
              className="px-4 py-2.5 rounded-xl bg-brand text-white text-xs font-bold hover:brightness-110 transition-all shadow-md"
            >
              Bot sozlamalarini saqlash
            </button>
          </div>
        </div>
      </div>

      {/* Gmail Direct SMTP Integration Section */}
      <div className="bg-surface-elevated dark:bg-[#211C17] border border-line dark:border-[#332C23] rounded-2xl shadow-card overflow-hidden">
        <div className="px-6 py-4.5 border-b border-line dark:border-[#332C23] flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-soft dark:bg-[#2A2140] text-brand flex items-center justify-center">
              <span className="text-sm">📧</span>
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-ink dark:text-[#F3EFE7]">
                Gmail Integratsiyasi (otabek1789@gmail.com)
              </h3>
              <p className="text-[11px] text-ink-soft">
                Xatlarni to'g'ridan-to'g'ri o'zingizning Google pochtangizdan yuborish (Gmail'da 'me' bo'lib ko'rinadi)
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-soft text-brand text-xs font-bold">
            <span>Direct SMTP</span>
          </span>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-ink-soft mb-1.5">
              Google Ilova paroli (App Password)
            </label>
            <input
              type="password"
              value={gmailAppPass}
              onChange={(e) => setGmailAppPass(e.target.value)}
              placeholder="xxxx xxxx xxxx xxxx (16 ta harfli parol)"
              className={inputCls}
            />
            <p className="text-[11px] text-ink-faint mt-1.5 leading-relaxed">
              💡 <b>Qanday olinadi:</b> Google hisobingizdan (<code>myaccount.google.com/apppasswords</code>) 16 xonali Ilova parolini yarating va shu yerga qo'ying. <i>(FormSubmit ishlatilmaydi, to'g'ridan-to'g'ri Gmail serveri orqali o'zingizdan yuboriladi)</i>.
            </p>
          </div>

          {gmailStatus && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                gmailStatus.success ? 'bg-good-soft text-good' : 'bg-bad-soft text-bad'
              }`}
            >
              {gmailStatus.success ? <CheckCircle2 size={16} /> : <ShieldAlert size={16} />}
              <span>{gmailStatus.msg}</span>
            </div>
          )}

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleTestGmail}
              disabled={testingGmail || !gmailAppPass}
              className="px-4 py-2.5 rounded-xl border border-line dark:border-[#332C23] hover:border-brand bg-surface dark:bg-[#16130F] text-xs font-bold text-ink dark:text-[#F3EFE7] flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Send size={13} className="text-brand" />
              <span>{testingGmail ? 'Yuborilmoqda...' : 'Gmail orqali test xat yuborish'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                try {
                  localStorage.setItem('elrizo_gmail_app_password', gmailAppPass)
                  setSavedSuccess(true)
                  setTimeout(() => setSavedSuccess(false), 3000)
                } catch (e) {}
              }}
              className="px-4 py-2.5 rounded-xl bg-brand text-white text-xs font-bold hover:brightness-110 transition-all shadow-md"
            >
              Parolni saqlash
            </button>
          </div>
        </div>
      </div>

      {/* General Store Settings */}
      <div className="bg-surface-elevated dark:bg-[#211C17] border border-line dark:border-[#332C23] rounded-2xl shadow-card overflow-hidden">
        <div className="px-6 py-4.5 border-b border-line dark:border-[#332C23]">
          <h3 className="font-display font-bold text-base text-ink dark:text-[#F3EFE7]">
            {t.admSettingsTitle}
          </h3>
        </div>
        <form onSubmit={handleSaveAll} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-ink-soft mb-1.5">{t.admShopName}</label>
            <input
              className={inputCls}
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-ink-soft mb-1.5">{t.admShopEmail}</label>
              <input
                className={inputCls}
                value={shopEmail}
                onChange={(e) => setShopEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink-soft mb-1.5">{t.admShopPhone}</label>
              <input
                className={inputCls}
                value={shopPhone}
                onChange={(e) => setShopPhone(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-ink-soft mb-1.5">{t.admCurrency}</label>
              <select
                className={inputCls}
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="UZS">UZS (So'm)</option>
                <option value="USD">USD (Dollar)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-ink-soft mb-1.5">{t.admLanguageDefault}</label>
              <select className={inputCls} defaultValue="uz">
                <option value="uz">O'zbekcha</option>
                <option value="ru">Русский</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand text-white hover:brightness-110 transition-all shadow-md"
          >
            {t.admSaveSettings}
          </button>
        </form>
      </div>
    </div>
  )
}
