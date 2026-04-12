import { createEvent, type EventAttributes } from 'ics'
import {
  weddingEventDescription,
  weddingEventEnd,
  weddingEventLocation,
  weddingEventStart,
  weddingEventTitle,
} from '@/setting'

function toIcsDateParts(d: Date): [number, number, number, number, number] {
  return [
    d.getUTCFullYear(),
    d.getUTCMonth() + 1,
    d.getUTCDate(),
    d.getUTCHours(),
    d.getUTCMinutes(),
  ]
}

export function downloadWeddingIcs(): void {
  const event: EventAttributes = {
    start: toIcsDateParts(weddingEventStart),
    end: toIcsDateParts(weddingEventEnd),
    title: weddingEventTitle,
    description: weddingEventDescription,
    location: weddingEventLocation,
    status: 'CONFIRMED',
    busyStatus: 'BUSY',
  }

  const { error, value } = createEvent(event)
  if (error || !value) {
    console.error(error)
    return
  }

  const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'wedding.ics'
  a.click()
  URL.revokeObjectURL(url)
  a.remove()
}
