<template>
  <div>
    <v-combobox
      :modelValue="tags"
      :items="allTags"
      itemTitle="title"
      itemValue="title"
      label="Tags"
      chips
      closableChips
      clearable
      multiple
      :loading="loading"
      @update:search="search"
      @update:modelValue="tags = ($event as (string | Tag)[]).map(t => typeof t === 'string' ? t : t.title)"
    >
      <template #chip="{ item, index }">
        <v-chip
          closable
          :style="tagService.getStyle(item.value)"
          @click="false"
          @click:close="tags?.splice(index, 1)"
        >
          {{ item.title }}
          <v-menu
            activator="parent"
            :closeOnContentClick="false"
          >
            <TagsEditorProps :tag="item.value" />
          </v-menu>
        </v-chip>
      </template>
      <template #item="{ item, props }">
        <v-list-item
          v-bind="props"
          role="option"
          :style="tagService.getStyle(item.value)"
        >
          <template #prepend>
            <VCheckboxBtn
              :key="item.value"
              :modelValue="tags?.includes(item.value)"
              :ripple="false"
              :tabindex="-1"
            />
          </template>
        </v-list-item>
      </template>
    </v-combobox>
  </div>
</template>

<script lang="ts" setup>
import type { Tag } from '@prisma/client'
import { debounce } from 'perfect-debounce'
import tagApi from '@/api/tag'

const tags = defineModel<string[]>()
const allTags = ref<Tag[]>([])

const loading = ref(false)

const search = debounce(async (fts: string) => {
  loading.value = true
  const r = await tagApi.search(fts)
  loading.value = false
  allTags.value = r.data
}, 500)

const tagService = useTagService(tags as Ref<string[]>)
</script>
