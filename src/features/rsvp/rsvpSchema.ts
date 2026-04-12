import { z } from 'zod'

export const rsvpFormSchema = z
  .object({
    attendance: z.string(),
    fullName: z.string().min(1, 'Укажите имя'),
    phone: z.string(),
    dietary: z.string(),
    companions: z.string(),
    message: z.string(),
    website: z.preprocess(
      (v) => (v === undefined || v === null ? '' : String(v)),
      z.string().max(0, 'Ошибка отправки'),
    ),
  })
  .superRefine((data, ctx) => {
    const attendanceOk = data.attendance === 'yes' || data.attendance === 'no'
    if (!attendanceOk) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Выберите вариант',
        path: ['attendance'],
      })
      return
    }
    if (data.attendance === 'yes' && data.phone.trim().length < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Укажите телефон',
        path: ['phone'],
      })
    }
  })

export type RsvpFormValues = z.infer<typeof rsvpFormSchema>
