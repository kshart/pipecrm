import type { Tag } from '@prisma/client'
import { debounce } from 'perfect-debounce'
import tagApi from '@/api/tag'

const loadedTags = ref(new Map<string, Tag>())
const requestedTags = new Set<string>()

const saveTag = debounce((title: string) => {
  const tag = loadedTags.value.get(title)
  if (tag) {
    tagApi.save(title, {
      textColor: tag.textColor,
      bgColor: tag.bgColor,
      cardOutlineColor: tag.cardOutlineColor,
    })
  }
}, 500)

/**
 * Хранилище настроек тегов
 */
export default (refTags?: Ref<string[]>) => {
  /** css стили для тега */
  const getStyle = (title: string) => {
    const tag = !title ? null : loadedTags.value.get(title)
    return {
      color: tag?.textColor || undefined,
      background: tag?.bgColor || undefined,
    }
  }
  /** Настройки карточки по тегам */
  const getCardConf = (tags: string[]) => {
    let cardOutlineColor: Tag['cardOutlineColor'] = null
    for (const tagTitle of tags) {
      const tag = loadedTags.value.get(tagTitle)
      if (tag?.cardOutlineColor) {
        cardOutlineColor = tag.cardOutlineColor
        break
      }
    }
    return {
      cardOutlineColor,
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
  const change = (title: string, props: Partial<Pick<Tag, 'textColor' | 'bgColor' | 'cardOutlineColor'>>) => {
    const tag = loadedTags.value.get(title)
    if (tag) {
      tag.textColor = props.textColor !== undefined ? props.textColor : tag.textColor
      tag.bgColor = props.bgColor !== undefined ? props.bgColor : tag.bgColor
      tag.cardOutlineColor = props.cardOutlineColor !== undefined ? props.cardOutlineColor : tag.cardOutlineColor
      loadedTags.value.set(title, tag)
      saveTag(title)
    }
  }

  if (refTags) {
    watch(refTags, () => load(refTags.value), { immediate: true })
  }

  return {
    loadedTags,
    load,
    apply,
    change,
    getStyle,
    getCardConf,
  }
}
