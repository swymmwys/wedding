export type RsvpAttendance = 'yes' | 'no'

export interface RsvpPayload {
  guestId: string | null
  guestNameFromToken: string | null
  attendance: RsvpAttendance
  fullName: string
  phone: string
  dietary: string
  companions: string
  needsTransport: boolean
  accommodation: string
  song: string
  message: string
  submittedAt: string
}
