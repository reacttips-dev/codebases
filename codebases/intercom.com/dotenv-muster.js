module.exports = {
  config() {
    if (typeof window !== 'undefined') return

    const path = require('path')

    try {
      const fs = require('fs')
      const dotenv = require('dotenv')
      dotenv.config()
      dotenv.config({ path: 'environment.env' })

      if (!process.env.LOADED_MUSTER_ENV) {
        const configFile = fs.readFileSync('./configuration_variables.json').toString()
        const config = JSON.parse(configFile)
        process.env = { ...process.env, ...config }
      }
    } catch (e) {
      // We must not be in Muster
      console.log(
        `Did not find Muster configuration variables in ${path.resolve(
          './configuration_variables.json',
        )}`,
      )
    }

    process.env.LOADED_MUSTER_ENV = true
  },
}
