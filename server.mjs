import { createServer } from 'node:http'
import { mkdir, appendFile } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('.', import.meta.url))
const port = Number(process.env.PORT || 3001)
const contentTypes = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' }

const readBody = async (request) => {
  let body = ''
  for await (const chunk of request) body += chunk
  if (body.length > 100_000) throw new Error('Payload too large')
  return JSON.parse(body)
}

const server = createServer(async (request, response) => {
  response.setHeader('X-Content-Type-Options', 'nosniff')
  response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  if (request.method === 'POST' && request.url === '/api/contact') {
    try {
      const data = await readBody(request)
      if (!data.name || !data.email || !data.phone) throw new Error('Missing required fields')
      await mkdir(join(root, 'data'), { recursive: true })
      await appendFile(join(root, 'data', 'submissions.ndjson'), `${JSON.stringify({ ...data, receivedAt: new Date().toISOString() })}\n`)
      response.writeHead(201, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify({ ok: true }))
    } catch (error) {
      response.writeHead(error.message === 'Payload too large' ? 413 : 400, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify({ error: 'Invalid contact request' }))
    }
    return
  }
  if (request.method !== 'GET') {
    response.writeHead(405)
    response.end()
    return
  }
  const requested = request.url === '/' ? '/dist/index.html' : `/dist${request.url.split('?')[0]}`
  const safePath = normalize(join(root, requested))
  const filePath = safePath.startsWith(join(root, 'dist')) ? safePath : join(root, 'dist', 'index.html')
  try {
    const file = await import('node:fs/promises').then(({ readFile }) => readFile(filePath))
    response.writeHead(200, { 'Content-Type': contentTypes[extname(filePath)] || 'application/octet-stream' })
    response.end(file)
  } catch {
    const fallback = await import('node:fs/promises').then(({ readFile }) => readFile(join(root, 'dist', 'index.html')))
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    response.end(fallback)
  }
})

server.listen(port, () => console.log(`API and production server listening on http://localhost:${port}`))
