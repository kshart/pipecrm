import type { FlCard } from '@/types/FlCard'
import { InfluxDB, Point, HttpError } from '@influxdata/influxdb-client'

const appConfig = useAppConfig()
const { url, token, org, bucket } = appConfig.influxDB

const writeApi = new InfluxDB({ url, token })
  .getWriteApi(org, bucket, 'ns')

const queryApi = new InfluxDB({ url, token })
  .getQueryApi(org)

export function useCardLogger () {
  return {
    async read (cardUuid: string) {
      let fluxQuery = `
        import "date"
        from(bucket: "buck-test")
          |> range(start: -1d)
          |> filter(fn: (r) => r._measurement == "card")
          |> map(fn: (r) => ({ r with hour: date.hour(t: r._time) }))
          |> group(columns: ["hour"], mode:"by")
      `

      return new Promise((resolve, reject) => {
        const result = []
        queryApi.queryRows(fluxQuery, {
          next: (row, tableMeta) => {
            const tableObject = tableMeta.toObject(row)
            result.push(tableObject)
          },
          error (error) {
            reject(error)
          },
          complete () {
            resolve(result)
          },
        })
      })
    },
    async log (card: FlCard) {
      const point = new Point('card')
        .tag('uuid', card.uuid)
        .stringField('title', card.title)
        .stringField('tags', JSON.stringify(card.tags))
        .stringField('columnUuid', card.columnUuid)
        .timestamp(card.updatedAt)
      for (const fieldUuid in card.fields) {
        point.stringField(fieldUuid, JSON.stringify(card.fields[fieldUuid]))
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
