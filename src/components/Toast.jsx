import { Check } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function Toast() {
  const { toast } = useCart()

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-ink dark:bg-brand text-surface dark:text-white px-5 py-3 rounded-[11px] text-[13.5px] font-semibold z-[60] flex items-center gap-2 transition-all duration-250 ${
        toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5 pointer-events-none'
      }`}
    >
      <Check size={15} /> {toast}
    </div>
  )
}
