<script lang="ts" setup>
import { FlCardFull } from '#components'

const cardUuid = defineModel<string | null>({ default: null })
const props = defineProps<{
  funnel: FlFunnel
}>()
const flCardFullRef = useTemplateRef<typeof FlCardFull | undefined>('flCardFull')
</script>

<template>
  <v-navigation-drawer
    :modelValue="!!cardUuid"
    location="right"
    permanent
    temporary
    :width="cardUuid === 'new' ? 400 : 800"
  >
    <div
      v-if="cardUuid"
      class="card-full-drawer"
    >
      <div
        v-if="cardUuid !== 'new'"
        class="panel-left"
      >
        <FlCardHistory
          class="panel-left-history"
          :funnel="props.funnel"
          :cardUuid="cardUuid"
        />
        <div class="panel-left-action">
          <div style="height: 200px">
            height: 200px
          </div>
        </div>
      </div>
      <div class="panel-card">
        <FlCardFull
          v-if="cardUuid"
          ref="flCardFull"
          :funnel="props.funnel"
          :cardUuid="cardUuid"
          @close="cardUuid = null"
        />
        <div
          v-if="flCardFullRef"
          class="pa-2"
        >
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

<style scoped lang="scss">
.card-full-drawer {
  height: 100%;
  display: flex;
  overflow: hidden;
  .panel-left {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    width: 400px;
    .panel-left-history {
      z-index: 1;
    }
    .panel-left-action {
      z-index: 2;
      background: #0ff;
    }
  }
  .panel-card {
    width: 400px;
    overflow-y: auto;
  }
}
</style>
