module.exports = {
    apps: [
      {
        name: 'pipecrm.ru',
        port: '3000',
        exec_mode: 'cluster',
        instances: 'max',
        script: './.output/server/index.mjs'
      }
    ]
}
