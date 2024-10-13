import type { Tag } from '@prisma/client'
import { groupablePost } from '@/api/groupable'

interface TagSearchResult {
  data: Tag[]
  total: number
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
}
