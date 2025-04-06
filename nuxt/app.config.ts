export default defineAppConfig({
  influxDB: {
    url: process.env.INFLUX_DB_URL,
    token: process.env.INFLUX_DB_TOKEN,
    org: process.env.INFLUX_DB_ORG,
    bucket: process.env.INFLUX_DB_BUCKET
  }
})
