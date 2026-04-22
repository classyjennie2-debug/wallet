const fs = require('fs')
const path = require('path')
const { createPublicClient, http } = require('viem')

const envPath = path.join(process.cwd(), '.env.local')
const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/)
const env = {}
for (const line of lines) {
  const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
  if (!match) continue
  let value = match[2].trim()
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1)
  }
  env[match[1]] = value
}

const urls = [
  env.NEXT_PUBLIC_ETHEREUM_RPC,
  env.NEXT_PUBLIC_POLYGON_RPC,
  env.NEXT_PUBLIC_ARBITRUM_RPC,
  env.NEXT_PUBLIC_BASE_RPC,
]
console.log('RPC urls:', urls)

async function run() {
  for (const url of urls) {
    if (!url) {
      console.log('missing url')
      continue
    }
    const client = createPublicClient({ transport: http(url) })
    try {
      const response = await client.getBalance({ address: '0x0000000000000000000000000000000000000000' })
      console.log(url, 'ok', response.toString().slice(0, 10))
    } catch (err) {
      console.error(url, 'ERR', err.message)
    }
  }
}
run().catch((err) => {
  console.error(err)
  process.exit(1)
})
