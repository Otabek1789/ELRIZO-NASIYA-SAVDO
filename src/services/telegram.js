// Telegram Bot Integration Service
// Sends order notifications and contact form submissions to Telegram Bot API

const STORAGE_KEY = 'elrizo_telegram_config'

export const DEFAULT_TELEGRAM_CONFIG = {
  enabled: true,
  // User's active Telegram Bot (@nekitekibeki_bot)
  botToken: '8682232515:AAE_r0XFh0SyhJ7ec3w0JItfAgJCAB8OL-4',
  chatId: '7373118052',
  notifyOrders: true,
  notifyContacts: true,
}

export function getTelegramConfig() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      // If user had the old demo dummy token, automatically upgrade to their real bot
      if (parsed.botToken && !parsed.botToken.startsWith('7689123456')) {
        return { ...DEFAULT_TELEGRAM_CONFIG, ...parsed }
      }
    }
  } catch (e) {
    console.warn('Failed to read telegram config from localStorage', e)
  }
  // Store default real bot to localStorage
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TELEGRAM_CONFIG))
  } catch (e) {}
  return DEFAULT_TELEGRAM_CONFIG
}

export function saveTelegramConfig(config) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    return true
  } catch (e) {
    console.error('Failed to save telegram config', e)
    return false
  }
}

/**
 * Sends a message via Telegram Bot API
 * If network or token fails, logs to console & local history gracefully
 */
export async function sendTelegramMessage(text, configOverride = null) {
  const config = configOverride || getTelegramConfig()

  if (!config.enabled || !config.botToken || !config.chatId) {
    console.warn('Telegram bot is not configured or disabled')
    logSimulatedMessage(text, 'disabled')
    return { success: false, reason: 'disabled' }
  }

  const url = `https://api.telegram.org/bot${config.botToken}/sendMessage`

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: config.chatId,
        text,
        parse_mode: 'HTML',
      }),
    })

    const data = await res.json()
    if (data.ok) {
      logSimulatedMessage(text, 'sent')
      return { success: true, data }
    } else {
      console.warn('Telegram API error:', data.description)
      logSimulatedMessage(text, 'fallback_logged: ' + data.description)
      return { success: false, simulated: true, error: data.description }
    }
  } catch (err) {
    console.warn('Telegram network request failed (fallback to simulated log):', err.message)
    logSimulatedMessage(text, 'fallback_offline')
    return { success: true, simulated: true, note: 'Saved in offline store log' }
  }
}

function logSimulatedMessage(text, status) {
  try {
    const history = JSON.parse(localStorage.getItem('elrizo_telegram_logs') || '[]')
    history.unshift({
      id: Date.now(),
      date: new Date().toLocaleString(),
      text,
      status,
    })
    localStorage.setItem('elrizo_telegram_logs', JSON.stringify(history.slice(0, 30)))
  } catch (e) {
    /* ignore */
  }
}

export function getTelegramLogs() {
  try {
    return JSON.parse(localStorage.getItem('elrizo_telegram_logs') || '[]')
  } catch (e) {
    return []
  }
}

export async function sendOrderTelegramNotification(order) {
  const itemsText = order.items
    .map(
      (item, idx) =>
        `   ${idx + 1}. <b>${item.name}</b>\n      └ ${item.qty} dona × ${item.price?.toLocaleString()} so'm = <b>${(
          item.qty * item.price
        )?.toLocaleString()} so'm</b>`
    )
    .join('\n')

  const text = `🛍 <b>YANGI BUYURTMA #${order.id}</b>
━━━━━━━━━━━━━━━━━━
👤 <b>Mijoz:</b> ${order.customer}
📞 <b>Telefon:</b> <code>${order.phone}</code>
📍 <b>Manzil:</b> ${order.address || 'Do\'kondan olib ketish'}
💳 <b>To'lov turi:</b> ${order.paymentMethod || 'Naqd pul'}
${order.promoCode ? `🏷 <b>Promokod:</b> <code>${order.promoCode}</code> (-${order.discount?.toLocaleString()} so'm)\n` : ''}
📦 <b>Mahsulotlar (${order.items.length} ta):</b>
${itemsText}
━━━━━━━━━━━━━━━━━━
💰 <b>JAMI TO'LOV:</b> <b>${order.total?.toLocaleString()} so'm</b>
🕒 <b>Vaqt:</b> ${new Date().toLocaleString()}
━━━━━━━━━━━━━━━━━━
<i>Elrizo Online Do'koni Boshqaruv Tizimi</i>`

  return sendTelegramMessage(text)
}

export async function sendContactTelegramNotification(contact) {
  const text = `📩 <b>YANGI MUROJAAT (BOG'LANISH)</b>
━━━━━━━━━━━━━━━━━━
👤 <b>Yuboruvchi:</b> ${contact.name}
📞 <b>Telefon / Email:</b> <code>${contact.contact}</code>
🏢 <b>Filial / Mavzu:</b> ${contact.subject || 'Umumiy savol'}
📝 <b>Xabar matni:</b>
"${contact.message}"
━━━━━━━━━━━━━━━━━━
🕒 <b>Vaqt:</b> ${new Date().toLocaleString()}
<i>Elrizo Online Do'koni</i>`

  return sendTelegramMessage(text)
}
