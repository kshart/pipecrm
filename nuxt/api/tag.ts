import type { Tag } from '@prisma/client'
import { groupablePost } from '@/api/groupable'

interface TagSearchResult {
  data: Tag[]
  total: number
}
interface TagSaveData {
  textColor: string | null
  bgColor: string | null
  cardOutlineColor: string | null
}

export default {
  search (fts: string) {
    return $fetch<TagSearchResult>('/api/tag/search', {
      query: {
        fts,
      },
    })
  },

  getList: groupablePost<string[], string[], Tag, Tag[]>(
    '/api/tag/list',
    (accumulator, tagTitles) => (accumulator || []).concat(tagTitles).filter((v, i, a) => a.indexOf(v) === i),
    (tagTitles) => (tagTitles),
    (models, args) => models.filter(tag => args.includes(tag.title)),
    100
  ),

  async save (title: string, body: TagSaveData) {
    await $fetch('/api/tag', {
      method: 'post',
      fatal: true,
      query: { title },
      body,
    })
  }
}
