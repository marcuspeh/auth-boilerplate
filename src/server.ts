require('dotenv').config()

import app from './app'
import { dataSource } from './data-source'

dataSource.initialize()
  .then(() => {
    const port = process.env.PORT || 3000
    app.listen(port)
    console.log(`listening to port ${port}`)
  })
  .catch(console.error)