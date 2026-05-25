import type { FlCard } from '@@/types/FlCard'
import { InfluxDB, Point, HttpError } from '@influxdata/influxdb-client'

interface ReadResultRecord {
  field: string
  time: string
  value: string
}

const { influxDB } = useRuntimeConfig()
const { url, token, org, bucket } = influxDB

const writeApi = new InfluxDB({ url, token })
  .getWriteApi(org, bucket, 'ns')

const queryApi = new InfluxDB({ url, token })
  .getQueryApi(org)

export function useCardLogger () {
  return {
    /**
     * Прочитать историю изменений карточки
     * @param count Максимальное колличество записей в текущем запросе
     */
    async read (cardUuid: string, timeStart:string, timeStop: string, count: number = 10) {
      const cardUuidRaw = cardUuid.replaceAll(/[^0-9a-zA-Z-]*/g, '')

      if (!Number.isInteger(count)) {
        throw new Error('Это как?')
      }

      let fluxQuery = `
        import "date"
        data = from(bucket: "buck-test")
          |> range(start: 0)
          |> filter(fn: (r) => r._measurement == "card" and r.uuid == "${cardUuidRaw}")
          |> group()
          |> sort(columns: ["_time"], desc: true)

        firstTime = data
          |> first()
          |> yield(name: "f")

        lastTime = data
          |> last()
          |> yield(name: "l")

        data
          |> range(start: 0, stop: ${timeStop})
          |> limit(n: ${count})
          |> yield(name: "v")
      `

      return new Promise((resolve, reject) => {
        const data: ReadResultRecord[] = []
        let lastTime = ''
        let firstTime = ''

        queryApi.queryRows(fluxQuery, {
          next: (row, tableMeta) => {
            const { table, result, ...fields } = tableMeta.toObject(row)

            if (result === 'l') {
              firstTime = fields._time
            } else if (result === 'f') {
              lastTime = fields._time
            } else {
              data.push({
                field: fields._field,
                time: fields._time,
                value: fields._value,
              })
            }
          },
          error (error) {
            reject(error)
          },
          complete () {
            resolve({ data, firstTime, lastTime })
          },
        })
      })
    },
    async log (card: FlCard) {
      let fluxQuery = `
        import "date"
        from(bucket: "buck-test")
          |> range(start: 0)
          |> filter(fn: (r) => r._measurement == "card" and r.uuid == "${card.uuid}")
          |> last()
      `
      const oldValues = new Map<string, any>()

      await new Promise<void>((resolve, reject) => {
        queryApi.queryRows(fluxQuery, {
          next: (row, tableMeta) => {
            const { _field, _value } = tableMeta.toObject(row)

            oldValues.set(_field, _value)
          },
          error (error) {
            reject(error)
          },
          complete () {
            resolve()
          },
        })
      })

      const tagsRaw = JSON.stringify(card.tags)
      const point = new Point('card')
        .tag('uuid', card.uuid)
        .timestamp(card.updatedAt)

      if (oldValues.get('title') !== card.title) {
        point.stringField('title', card.title)
      }
      if (oldValues.get('tags') !== tagsRaw) {
        point.stringField('tags', tagsRaw)
      }
      if (oldValues.get('columnUuid') !== card.columnUuid) {
        point.stringField('columnUuid', card.columnUuid)
      }

      for (const fieldUuid in card.fields) {
        const rawValue = JSON.stringify(card.fields[fieldUuid])

        if (oldValues.get(fieldUuid) !== rawValue) {
          point.stringField(fieldUuid, rawValue)
        }
      }

      writeApi.writePoint(point)
      try {
        await writeApi.flush()
        // writeApi.close()
      } catch (e) {
        console.error(e)
        if (e instanceof HttpError && e.statusCode === 401) {
          console.log('Run ./onboarding.js to setup a new InfluxDB database.')
        }
      }
    }
  }
}
