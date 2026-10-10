import { useLang } from '../context/LangContext'

export default function MiniBanners() {
  const { t } = useLang()

  const banners = [
    {
      title: t.mb1t,
      desc: t.mb1d,
      className: 'bg-gradient-to-br from-[#FFEFE3] to-[#FCD9BC] text-[#5C2D0C] dark:from-[#3A2418] dark:to-[#2A1710] dark:text-[#FFD9B8]',
    },
    {
      title: t.mb2t,
      desc: t.mb2d,
      className: 'bg-gradient-to-br from-[#E7F7ED] to-[#C7EBD3] text-[#0F3D22] dark:from-[#163827] dark:to-[#0F2418] dark:text-[#B8F0CE]',
    },
    {
      title: t.mb3t,
      desc: t.mb3d,
      className: 'bg-gradient-to-br from-[#EFE8FF] to-[#D9C8FF] text-[#2A1466] dark:from-[#2A2140] dark:to-[#1C1530] dark:text-[#D9C8FF]',
    },
  ]

  return (
    <section className="py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {banners.map((b) => (
          <div key={b.title} className={`rounded-2xl p-6.5 min-h-[150px] flex flex-col justify-center gap-2 ${b.className}`}>
            <h3 className="font-display text-[21px] font-semibold m-0">{b.title}</h3>
            <p className="text-[12.5px] m-0 opacity-85">{b.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
