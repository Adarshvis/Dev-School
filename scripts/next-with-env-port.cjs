const { spawn } = require('node:child_process')
const path = require('node:path')

require('dotenv').config({ path: path.resolve(process.cwd(), '.env') })

const mode = process.argv[2] || 'dev'
const isServerMode = mode === 'dev' || mode === 'start'
const port = process.env.PORT || '3000'

const nextBin = require.resolve('next/dist/bin/next')
const args = [nextBin, mode]

if (isServerMode) {
  args.push('-p', String(port))
}

const child = spawn(process.execPath, args, {
  stdio: 'inherit',
  env: process.env,
})

child.on('exit', (code) => {
  process.exit(code == null ? 1 : code)
})

child.on('error', (error) => {
  console.error('Failed to start Next.js:', error)
  process.exit(1)
})
