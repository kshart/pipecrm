import prisma from '~/lib/prisma'

export default {
  async cardUpdateTags (newTags: string[], oldTags: string[]) {
    const newTagsCountMap = new Map<string, number>()
    const oldTagsCountMap = new Map<string, number>()
    for (const tag of newTags) {
      newTagsCountMap.set(tag, (newTagsCountMap.get(tag) || 0) + 1)
    }
    for (const tag of oldTags) {
      oldTagsCountMap.set(tag, (oldTagsCountMap.get(tag) || 0) + 1)
    }
    const newTagsUnique = [...new Set(newTags)]
    const oldTagsUnique = [...new Set(oldTags)]

    const addTags: string[] = []
    const removeTags: string[] = []
    for (const tag of newTagsUnique) {
      const newCount = newTagsCountMap.get(tag) || 0
      const oldCount = oldTagsCountMap.get(tag) || 0
      if (newCount > oldCount) {
        for (let i = 0; i < newCount - oldCount; i++) {
          addTags.push(tag)
        }
      }
    }
    for (const tag of oldTagsUnique) {
      const newCount = newTagsCountMap.get(tag) || 0
      const oldCount = oldTagsCountMap.get(tag) || 0
      if (oldCount > newCount) {
        for (let i = 0; i < oldCount - newCount; i++) {
          removeTags.push(tag)
        }
      }
    }

    if (addTags.length > 0) {
      const tagsCount = new Map<string, number>()
      for (const tag of addTags) {
        tagsCount.set(tag, (tagsCount.get(tag) || 0) + 1)
      }
      const promises: Promise<unknown>[] = []
      for (const [tag, count] of tagsCount) {
        promises.push(prisma.tag.upsert({
          where: { title: tag },
          update: { count: { increment: count } },
          create: { title: tag, count, primary: false },
        }))
      }
      await Promise.all(promises)
    }
    if (removeTags.length > 0) {
      const tagsCount = new Map<string, number>()
      for (const tag of removeTags) {
        tagsCount.set(tag, (tagsCount.get(tag) || 0) + 1)
      }
      const promises: Promise<unknown>[] = []
      for (const [tag, count] of tagsCount) {
        promises.push(prisma.tag.update({
          where: { title: tag },
          data: { count: { decrement: count } },
        }))
      }
      await Promise.all(promises)
    }
  }
}
