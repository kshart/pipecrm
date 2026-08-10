import { v4 as uuidV4 } from 'uuid'
import contentDispositionParser from 'content-disposition-parser'
import { getServerSession } from '#auth'
import prisma from '@@/lib/prisma'
import cardMe from '@@/server/cardMe'
import { S3 } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'

interface CreateCardMessageQuery {
  cardUuid: string
}

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)

  if (!session) {
    throw createError({ statusCode: 401 })
  }

  const headers = getRequestHeaders(event)
  const { body } = toWebRequest(event)
  const query = getQuery<CreateCardMessageQuery>(event)
  const contentDisposition = contentDispositionParser(headers['content-disposition'])

  const { s3 } = useRuntimeConfig()
  const { region, endpoint, accessKeyId, secretAccessKey } = s3

  const s3Client = new S3({
    region,
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  })

  const s3Key = uuidV4()

  const parallelUploads3 = new Upload({
    client: s3Client,
    params: {
      Bucket: 'the-pomoika',
      Key: s3Key,
      Body: body!,
      ContentType: headers['content-type'],
      ContentDisposition: `attachment; filename="${contentDisposition.filename}"`,
    },
    queueSize: 4,
    partSize: 1024 * 1024 * 5,
  })

  parallelUploads3.on('httpUploadProgress', (progress) => {
    console.log(`Uploaded part: ${progress.part} - Loaded: ${progress.loaded} bytes`)
  })

  const result = await parallelUploads3.done()
  const fileHead = await s3Client.headObject({
    Bucket: 'the-pomoika',
    Key: s3Key,
  })

  const card = await prisma.card.findFirstOrThrow({
    where: { uuid: query.cardUuid },
  })

  return cardMe.message(card, {
    file: result.Location || '',
    filename: contentDisposition.filename,
    contentType: headers['content-type'] || 'application/octet-stream',
    contentLength: fileHead?.ContentLength || 0,
  }, session.user as User)
})
