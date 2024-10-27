import type { FunnelColumn } from '@prisma/client'
import prisma from '~/lib/prisma'
import { v4 as uuidV4 } from 'uuid'

/**
 * Нужна валидация body
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const uuid = String(query.uuid)
  const { title, columns } = await readBody(event)

  const funnel = await prisma.funnel.findFirstOrThrow({
    where: { uuid },
    include: {
      columns: true,
    },
  })

  if (Array.isArray(columns)) {
    const columnsToRemove = [] as string[]
    const columnsToCreate = [] as FunnelColumn[]
    for (const column of funnel.columns) {
      const newColumn = columns.find(c => c.uuid === column.uuid)
      if (!newColumn) {
        columnsToRemove.push(column.uuid)
      }
    }
    for (const column of columns) {
      const oldColumn = funnel.columns.find(c => c.uuid === column.uuid)
      if (!oldColumn) {
        columnsToCreate.push({
          ...column,
          funnelUuid: funnel.uuid,
        })
      } else {
        await prisma.funnelColumn.update({
          where: {
            uuid: column.uuid,
          },
          data: column,
        })
      }
    }
    if (columnsToRemove.length > 0) {
      await prisma.funnelColumn.deleteMany({
        where: {
          uuid: {
            in: columnsToRemove,
          }
        },
      })
    }
    if (columnsToCreate.length > 0) {
      await prisma.funnelColumn.createMany({
        data: columnsToCreate
      })
    }
  }

  return await prisma.funnel.update({
    where: { uuid },
    data: {
      title,
      updatedUuid: uuidV4(),
    },
    include: {
      columns: true,
    },
  })
})
