<script setup lang="ts">
import ScrollReveal from '@/components/ScrollReveal.vue'
import { storeToRefs } from 'pinia'
import { Form, Field } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { computed, ref } from 'vue'
import { submitRsvp, RsvpConfigurationError } from '@/features/rsvp/rsvpService'
import { useGuestStore } from '@/stores/guest'
import { rsvpFormSchema } from './rsvpSchema'

const guestStore = useGuestStore()
const { guestId, guestName } = storeToRefs(guestStore)

const validationSchema = toTypedSchema(rsvpFormSchema)

const initialValues = computed(() => ({
  attendance: '' as '' | 'yes' | 'no',
  fullName: guestName.value ?? '',
  phone: '',
  dietary: '',
  companions: '',
  message: '',
  website: '',
}))

const submitError = ref<string | null>(null)
const submitSuccess = ref(false)
const submitting = ref(false)

function hasAttendanceChoice(attendance: unknown): attendance is 'yes' | 'no' {
  return attendance === 'yes' || attendance === 'no'
}

async function onSubmit(values: Record<string, unknown>): Promise<void> {
  const parsed = rsvpFormSchema.safeParse(values)
  if (!parsed.success) return

  const v = parsed.data
  if (!hasAttendanceChoice(v.attendance)) return

  submitError.value = null
  submitting.value = true
  try {
    await submitRsvp({
      guestId: guestId.value,
      guestNameFromToken: guestName.value,
      attendance: v.attendance,
      fullName: v.fullName,
      phone: v.phone,
      dietary: v.dietary,
      companions: v.companions,
      message: v.message,
      submittedAt: new Date().toISOString(),
    })
    submitSuccess.value = true
  } catch (e) {
    if (e instanceof RsvpConfigurationError) {
      submitError.value =
        'Отправка не настроена: задайте VITE_APPS_SCRIPT_URL для продакшена.'
    } else if (e instanceof Error) {
      submitError.value = e.message
    } else {
      submitError.value = 'Не удалось отправить. Попробуйте позже.'
    }
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section id="rsvp" class="section rsvp">
    <div class="section-inner">
      <ScrollReveal>
        <h2 class="heading-script">Ответ на приглашение</h2>
      </ScrollReveal>

      <ScrollReveal :y="30">
        <div v-if="submitSuccess" class="card success-card">
          <p class="success-title">Спасибо!</p>
          <p class="muted">Ваш ответ сохранён. Если что-то изменится — напишите нам.</p>
        </div>

        <Form
          v-else
          :key="String(guestName)"
          v-slot="{ values }"
          class="card form-card"
          :validation-schema="validationSchema"
          :initial-values="initialValues"
          @submit="onSubmit"
        >
          <Field type="text" name="website" class="hp" autocomplete="off" tabindex="-1" />
            
            <label class="field">
              <span class="label">Ваше имя (+ имя партнёра) *</span>
              <Field name="fullName" v-slot="{ field, errors }">
                <input v-bind="field" type="text" class="input" autocomplete="name" />
                <span v-if="errors[0]" class="err">{{ errors[0] }}</span>
              </Field>
            </label>

            <label class="field">
              <span class="label">Присутствие *</span>
              <Field name="attendance" v-slot="{ field, errors }">
                <select v-bind="field" class="input">
                  <option value="" disabled>Выберите вариант</option>
                  <option value="yes">С удовольствием приду</option>
                  <option value="no">К сожалению, не смогу</option>
                </select>
                <span v-if="errors[0]" class="err">{{ errors[0] }}</span>
              </Field>
            </label>

          <template v-if="values.attendance === 'yes'">
            <label class="field">
              <span class="label">Телефон *</span>
              <Field name="phone" v-slot="{ field, errors }">
                <input v-bind="field" type="tel" class="input" autocomplete="tel" />
                <span v-if="errors[0]" class="err">{{ errors[0] }}</span>
              </Field>
            </label>

            <label class="field">
              <span class="label">Аллергии и пожелания по меню</span>
              <Field name="dietary" v-slot="{ field }">
                <textarea v-bind="field" class="textarea" rows="2" />
              </Field>
            </label>

            <label class="field">
              <span class="label">Кто едет с вами (имена, дети/взрослые)</span>
              <Field name="companions" v-slot="{ field }">
                <textarea v-bind="field" class="textarea" rows="2" />
              </Field>
            </label>
          </template>

            <label class="field">
              <span class="label">Сообщение для нас</span>
              <Field name="message" v-slot="{ field }">
                <textarea v-bind="field" class="textarea" rows="3" />
              </Field>
            </label>

          <p v-if="submitError" class="err banner">{{ submitError }}</p>

          <button type="submit" class="btn primary" :disabled="submitting">
            {{ submitting ? 'Отправка…' : 'Отправить' }}
          </button>
        </Form>
      </ScrollReveal>
    </div>
  </section>
</template>

<style scoped>
.section {
  box-sizing: border-box;
  padding: var(--section-padding);
  background: var(--color-ivory);
}

.section-inner {
  max-width: 32rem;
  margin: 0 auto;
}

.heading-script {
  font-family: var(--font-script);
  font-size: clamp(2.25rem, 6vw, 3rem);
  color: var(--color-sage-dark);
  text-align: center;
  margin-bottom: 0.5em;
}

.lede {
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 0.95rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 2rem;
}

.card {
  background: var(--color-surface);
  border-radius: 16px;
  padding: 1.75rem;
  box-shadow: var(--chrome-shadow);
}

.success-card {
  text-align: center;
}

.success-title {
  font-family: var(--font-script);
  font-size: 2rem;
  color: var(--color-sage-dark);
}

.muted {
  color: var(--color-text-secondary);
  margin-top: 0.75rem;
}

.field {
  display: block;
  margin-bottom: 1.25rem;
}

.label {
  display: block;
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
  margin-bottom: 0.35rem;
}

.input,
.textarea {
  width: 100%;
  border: 1px solid var(--color-border-input);
  border-radius: 8px;
  padding: 0.65rem 0.85rem;
  font-family: var(--font-body);
  font-size: 1rem;
  background: var(--color-surface-muted);
  color: var(--color-sage-dark);
}

.checkbox-line {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.95rem;
}

.err {
  display: block;
  color: #9b2c2c;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.banner {
  margin-bottom: 1rem;
}

.hp {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.btn {
  width: 100%;
  border: none;
  border-radius: 999px;
  padding: 0.85rem 1.5rem;
  font-family: var(--font-body);
  font-size: 0.95rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
}

.btn.primary {
  background: var(--color-primary);
  color: var(--color-on-primary);
}

.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.btn-change {
  display: block;
  width: 100%;
  margin-top: 0.75rem;
  padding: 0.35rem;
  border: none;
  background: none;
  font-family: var(--font-body);
  font-size: 0.85rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
  text-decoration: underline;
  text-underline-offset: 0.1em;
  cursor: pointer;
}
</style>
