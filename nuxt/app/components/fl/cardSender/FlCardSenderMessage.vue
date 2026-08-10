<script lang="ts" setup>
const props = defineProps<{
  cardUuid: string
}>()

const messageText = ref('')

function sendText() {
  fetch('/api/cardMessage/text?cardUuid=' + props.cardUuid, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: messageText.value,
    }),
  })
    .then(d => d.json())
    .then((d) => {
      messageText.value = ''
      console.log(d)
    })
}

function sendFile(file: File) {
  fetch('/api/cardMessage/file?cardUuid=' + props.cardUuid, {
    method: 'POST',
    headers: {
      'Content-Disposition': `attachment; filename="${file.name}"`,
      'Content-Type': file.type,
    },
    body: file,
  })
    .then(d => d.json())
    .then(d => console.log(d))
}

const dragShowHover = ref(false)
let a = 0

function onDragStart(event: DragEvent) {
  const isFileDrag = event.dataTransfer?.types?.includes('Files')

  if (!isFileDrag) {
    return
  }

  a++
  if (a !== 1) {
    return
  }

  dragShowHover.value = true
  event.stopPropagation()
}

function onDragEnd(event: DragEvent) {
  const isFileDrag = event.dataTransfer?.types?.includes('Files')

  if (!isFileDrag) {
    return
  }

  a--
  if (a !== 0) {
    return
  }

  dragShowHover.value = false
}

function onDrop(event: DragEvent) {
  const isFileDrag = event.dataTransfer?.types?.includes('Files')

  if (!isFileDrag) {
    return
  }

  a = 0
  event.preventDefault()

  const files = event.dataTransfer?.files || []

  for (const file of files) {
    sendFile(file)
  }

  dragShowHover.value = false
}

onMounted(() => {
  document.addEventListener('dragenter', onDragStart)
  document.addEventListener('dragleave', onDragEnd)
})

onBeforeUnmount(() => {
  document.removeEventListener('dragenter', onDragStart)
  document.removeEventListener('dragleave', onDragEnd)
})
</script>

<template>
  <div
    class="card-sender-message pa-3"
    :style="{
      background: dragShowHover ? '#ff0' : undefined,
    }"
    @drop="onDrop"
  >
    <v-textarea
      v-model="messageText"
      :rows="2"
      label="Message"
      hideDetails
    />
    <v-btn
      icon="mdi-send"
      @click="sendText"
    />

    <!-- <input ref="file" type="file">
    <v-btn @click="sendFile">send</v-btn> -->
  </div>
</template>

<style scoped lang="scss">
.card-sender-message {
  display: flex;
  gap: 12px;
}
</style>
