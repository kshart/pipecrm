<template>
  <div>
    <v-menu
      :closeOnContentClick="false"
    >
      <template #activator="{ props }">
        <v-btn
          :color="color || '#fff'"
          size="small"
          :width="20"
          v-bind="props"
        />
      </template>
      <v-color-picker
        v-model="color"
        class="mt-2"
        :canvasHeight="100"
        mode="rgb"
        hideInputs
        @update:modelValue="changeDebounced"
      />
    </v-menu>
    <v-btn
      variant="plain"
      icon="mdi-close"
      size="x-small"
      @click="color = null; model = null"
    />
  </div>
</template>

<script lang="ts" setup>
interface Props {
  delay?: number
}
const props = withDefaults(defineProps<Props>(), {
  delay: 500
})

const model = defineModel<string | null>()
const color = ref<string | null>(null)
let saveTimer: null | ReturnType<typeof setTimeout> = null

onBeforeUnmount(() => {
  if (saveTimer) {
    clearTimeout(saveTimer)
    saveTimer = null
    model.value = color.value
  }
})

watch(() => model.value, () => {
  if (!saveTimer) {
    color.value = model.value || null
  }
}, { immediate: true })

const changeDebounced = () => {
  if (saveTimer) {
    clearTimeout(saveTimer)
  }
  saveTimer = setTimeout(() => {
    model.value = color.value
    saveTimer = null
  }, props.delay)
}
</script>
