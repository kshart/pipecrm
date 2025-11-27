import 'v-phone-input/dist/v-phone-input.css'
import { createVPhoneInput } from 'v-phone-input'

export default defineNuxtPlugin(nuxtApp => {
  const vPhoneInput = createVPhoneInput({
    displayFormat: 'international'
  })

  nuxtApp.vueApp.use(vPhoneInput)
})
