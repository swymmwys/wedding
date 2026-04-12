import { google } from 'calendar-link'
import {
  weddingEventDescription,
  weddingEventEnd,
  weddingEventLocation,
  weddingEventStart,
  weddingEventTitle,
} from '@/setting'

const event = {
  title: weddingEventTitle,
  description: weddingEventDescription,
  location: weddingEventLocation,
  start: weddingEventStart,
  end: weddingEventEnd,
}

export function googleCalendarUrl(): string {
  return google(event)
}
