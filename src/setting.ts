/** Wedding copy, venue, and calendar metadata (single source for UI + .ics / deep links). */
export const weddingHeroNames = 'Александр и Лейла'

/** 15:00–00:00 локальное время (Минск, UTC+3). */
export const weddingEventStart = new Date('2026-07-27T15:00:00+03:00')
export const weddingEventEnd = new Date('2026-07-28T00:00:00+03:00')

export const weddingHeroDateRu = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Europe/Minsk',
}).format(weddingEventStart)

export const weddingEventTitle = `Свадьба ${weddingHeroNames}`
export const weddingEventDescription =
  'Церемония и празднование. Дресс-код: формальный. Будем рады видеть вас!'
export const weddingEventLocation =
  'Комплекс Богдановичей «Двор Стайки»'
