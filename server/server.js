import express from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import sockjs from 'sockjs'
import { renderToStaticNodeStream } from 'react-dom/server'
import React from 'react'

import cookieParser from 'cookie-parser'
import config from './config'
import Html from '../client/html'

const { readFile, writeFile, unlink } = require('fs').promises
const shortId = require('shortid')
const { readdirSync } = require('fs')

const Root = () => ''

try {
  // eslint-disable-next-line import/no-unresolved
  // ;(async () => {
  //   const items = await import('../dist/assets/js/root.bundle')
  //   console.log(JSON.stringify(items))

  //   Root = (props) => <items.Root {...props} />
  //   console.log(JSON.stringify(items.Root))
  // })()
  console.log(Root)
} catch (ex) {
  console.log(' run yarn build:prod to enable ssr')
}

let connections = []

const port = process.env.PORT || 8090
const server = express()

const middleware = [
  cors(),
  express.static(path.resolve(__dirname, '../dist/assets')),
  bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }),
  bodyParser.json({ limit: '50mb', extended: true }),
  cookieParser()
]

middleware.forEach((it) => server.use(it))

const filteredKeys = (array) => {
  return array.reduce((acc, rec) => {
    // eslint-disable-next-line no-underscore-dangle
    if (rec._isDeleted) {
      return acc
    }
    return [...acc, { taskId: rec.taskId, title: rec.title, status: rec.status }]
  }, [])
}

const write = (cat, tasks) => {
  return writeFile(`${__dirname}/categories/${cat}.json`, JSON.stringify(tasks, 1, 2), {
    encoding: 'utf8'
    // eslint-disable-next-line consistent-return
  })
}
const read = (cat) => {
  return readFile(`${__dirname}/categories/${cat}.json`, { encoding: 'utf8' })
    .then((result) => {
      return JSON.parse(result)
    })
    .catch(() => {
      return []
    })
}

server.get('/api/v1/tasks/:category', async (req, res) => {
  const { category } = req.params
  const tasks = filteredKeys(await read(category))
  res.json(tasks)
})

server.get('/api/v1/categories', async (req, res) => {
  const categories = await readdirSync(`${__dirname}/categories`).map((el) =>
    el.split('.json').join('')
  )
  res.json(categories)
})

server.get('/api/v1/tasks/:category/:timespan', async (req, res) => {
  const { category, timespan } = req.params
  const tasks = await read(category)
  const time = {
    day: 1000 * 60 * 60 * 24,
    week: 1000 * 60 * 60 * 24 * 7,
    month: 1000 * 60 * 60 * 24 * 30
  }
  const filteredTasks = filteredKeys(
    // eslint-disable-next-line no-underscore-dangle
    tasks.filter((el) => +new Date() - el._createdAt < time[timespan])
  )
  res.json(filteredTasks)
})

server.post('/api/v1/tasks/:category', async (req, res) => {
  const { category } = req.params
  if (Object.keys(req.body).length === 0) {
    await write(category, [])
    res.json({ status: 'Added' })
  } else {
    const tasks = await read(category)
    const newTask = {
      taskId: shortId.generate(),
      title: req.body.title,
      status: 'new',
      _isDeleted: false,
      _createdAt: +new Date(),
      _daletedAt: null
    }
    const addedTasks = [...tasks, newTask]
    await write(category, addedTasks)
    res.json({ status: 'Added', newTask })
  }
})

server.patch('/api/v1/tasks/:category/:id', async (req, res) => {
  const { category, id } = req.params
  const statuses = ['done', 'in progress', 'blocked', 'new']
  const newStatus = req.body.status
  if (statuses.includes(newStatus)) {
    const tasks = await read(category)
    const updatedStatus = tasks.map((el) => (el.taskId === id ? { ...el, status: newStatus } : el))
    await write(category, updatedStatus)
    res.json({ status: 'updated' })
  } else {
    res.status(501)
    res.json({ status: 'error', message: 'incorrect status' })
  }
})

server.delete('/api/v1/tasks/:category/:id', async (req, res) => {
  const { category, id } = req.params
  const tasks = await read(category)
  const deleted = tasks.map((el) => (el.taskId === id ? { ...el, _isDeleted: true } : el))
  await write(category, deleted)
  res.json({ status: 'deleted' })
})

server.delete('/api/v1/categories/:category', async (req, res) => {
  const { category } = req.params
  const deleted = await unlink(`${__dirname}/categories/${category}.json`)
  res.json(deleted)
})

server.use('/api/', (req, res) => {
  res.status(404)
  res.end()
})

const [htmlStart, htmlEnd] = Html({
  body: 'separator',
  title: 'Boilerplate'
}).split('separator')

server.get('/', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

server.get('/*', (req, res) => {
  const initialState = {
    location: req.url
  }

  return res.send(
    Html({
      body: '',
      initialState
    })
  )
})

const app = server.listen(port)

if (config.isSocketsEnabled) {
  const echo = sockjs.createServer()
  echo.on('connection', (conn) => {
    connections.push(conn)
    conn.on('data', async () => {})

    conn.on('close', () => {
      connections = connections.filter((c) => c.readyState !== 3)
    })
  })
  echo.installHandlers(app, { prefix: '/ws' })
}
console.log(`Serving at http://localhost:${port}`)
