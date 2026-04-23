export type RsvpAttendance = 'yes' | 'no'

export interface RsvpPayload {
  guestId: string | null
  guestNameFromToken: string | null
  attendance: RsvpAttendance
  fullName: string
  dietary: string
  message: string
  submittedAt: string
}
