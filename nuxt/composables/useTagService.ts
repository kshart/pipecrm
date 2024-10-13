import type { Tag } from '@prisma/client'
import tagApi from '@/api/tag'

const loadedTags = ref(new Map<string, Tag>())
const requestedTags = new Set<string>()

/**
 * Хранилище настроек тегов
 */
export default (refTags?: Ref<string[]>) => {
  const getStyle = (title: string) => {
    const tag = !title ? null : loadedTags.value.get(title)
    return {
      color: tag?.textColor || '#eee',
      background: tag?.bgColor || '#999',
    }
  }
  const load = (tagTitles: string[]) => {
    tagTitles = tagTitles.filter(text => !requestedTags.has(text) && !loadedTags.value.get(text))
    if (tagTitles.length <= 0) {
      return
    }
    for (const title of tagTitles) {
      requestedTags.add(title)
    }
    tagApi.getList(tagTitles)
      .then(tags => apply(tags))
      .finally(() => {
        for (const text of tagTitles) {
          requestedTags.delete(text)
        }
      })
  }
  const apply = (tags: Tag[]) => {
    if (tags.length <= 0) {
      return
    }
    for (const tag of tags) {
      const oldTag = loadedTags.value.get(tag.title)
      if (oldTag) {
        oldTag.textColor = tag.textColor
        oldTag.bgColor = tag.bgColor
        loadedTags.value.set(tag.title, oldTag)
      } else {
        loadedTags.value.set(tag.title, tag)
      }
    }
  }

  if (refTags) {
    watch(refTags, () => load(refTags.value), { immediate: true })
  }

  return {
    loadedTags,
    getStyle,
    load,
    apply,
  }
}
