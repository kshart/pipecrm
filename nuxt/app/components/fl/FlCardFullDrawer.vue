<template>
  <v-navigation-drawer
    :modelValue="!!cardUuid"
    location="right"
    permanent
    temporary
    :width="800"
  >
    <div class="card-full-drawer" v-if="cardUuid">
      <FlCardHistory
        class="panel-history"
        :funnel="props.funnel"
        :cardUuid="cardUuid"
      />
      <div class="panel-card">
        <FlCardFull
          v-if="cardUuid"
          ref="flCardFullRef"
          :funnel="props.funnel"
          :cardUuid="cardUuid"
          @close="cardUuid = null"
        />
        <div v-if="flCardFullRef" class="pa-2">
          <v-btn @click="flCardFullRef.save()">
            save
          </v-btn>
          <v-btn @click="cardUuid = null">
            close
          </v-btn>
        </div>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import FlCardFull from './FlCardFull.vue'
import type { Funnel } from '@@/types/prisma'

const cardUuid = defineModel<string | null>({ default: null })
const props = defineProps<{
  funnel: Funnel
}>()
const flCardFullRef = ref<typeof FlCardFull | undefined>()

</script>

<style scoped lang="scss">
.card-full-drawer {
  height: 100%;
  display: flex;
  overflow: hidden;
  .panel-history {
    width: 400px;
    background: #0f0;
    overflow-y: auto;
  }
  .panel-card {
    width: 400px;
    overflow-y: auto;
  }
}
</style>
