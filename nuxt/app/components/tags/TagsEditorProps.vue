<template>
  <v-list class="pa-4">
    <v-row>
      <v-col>
        Text color
        <v-btn
          variant="plain"
          icon="mdi-close"
          size="x-small"
          @click="textColor = null; save()"
        />
        <v-color-picker
          v-model="textColor"
          class="mt-2"
          :canvasHeight="100"
          mode="rgb"
          hideInputs
          @update:modelValue="save"
        />
      </v-col>
      <v-col>
        Background color
        <v-btn
          variant="plain"
          icon="mdi-close"
          size="x-small"
          @click="bgColor = null; save()"
        />
        <v-color-picker
          v-model="bgColor"
          class="mt-2"
          :canvasHeight="100"
          mode="rgb"
          hideInputs
          @update:modelValue="save"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        Card outline color
        <v-btn
          variant="plain"
          icon="mdi-close"
          size="x-small"
          @click="cardOutlineColor = null; save()"
        />
        <v-color-picker
          v-model="cardOutlineColor"
          class="mt-2"
          :canvasHeight="100"
          mode="rgb"
          hideInputs
          @update:modelValue="save"
        />
      </v-col>
      <v-col />
    </v-row>
  </v-list>
</template>

<script lang="ts" setup>
import { debounce } from 'perfect-debounce'

const props = defineProps<{
  tag: string
}>()

const tagService = useTagService(computed(() => [props.tag]))

const textColor = ref<string | null>(null)
const bgColor = ref<string | null>(null)
const cardOutlineColor = ref<string | null>(null)

onMounted(() => {
  const tag = tagService.loadedTags.value.get(props.tag)
  if (tag) {
    textColor.value = tag.textColor
    bgColor.value = tag.bgColor
    cardOutlineColor.value = tag.cardOutlineColor
  }
})
const save = debounce(() => {
  tagService.change(props.tag, {
    textColor: textColor.value,
    bgColor: bgColor.value,
    cardOutlineColor: cardOutlineColor.value,
  })
}, 10)
</script>
