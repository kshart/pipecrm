<template>
  <v-navigation-drawer
    :modelValue="!!cardUuid"
    location="right"
    permanent
    temporary
    :width="800"
  >
    <FlCardFull
      v-if="cardUuid"
      ref="flCardFullRef"
      :funnel="props.funnel"
      :cardUuid="cardUuid"
      @close="cardUuid = null"
    />
    <template #append>
      <div v-if="flCardFullRef" class="pa-2">
        <v-btn @click="flCardFullRef.save()">
          save
        </v-btn>
        <v-btn @click="cardUuid = null">
          close
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import FlCardFull from './FlCardFull.vue'
import type { Funnel } from '@prisma/client'

const cardUuid = defineModel<string | null>()
const props = defineProps<{
  funnel: Funnel
}>()
const flCardFullRef = ref<FlCardFull | undefined>()

</script>
