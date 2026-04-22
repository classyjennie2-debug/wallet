const fs = require('fs')
const path = require('path')
const { parse } = require('dotenv')
const { createPublicClient, http } = require('viem')

const envPath = path.join(process.cwd(), '.env.local')
const env = parse(fs.readFileSync(envPath, 'utf-8'))
Object.assign(process.env, env)

const urls = [
  process.env.NEXT_PUBLIC_ETHEREUM_RPC,
  process.env.NEXT_PUBLIC_POLYGON_RPC,
  process.env.NEXT_PUBLIC_ARBITRUM_RPC,
  process.env.NEXT_PUBLIC_BASE_RPC,
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
