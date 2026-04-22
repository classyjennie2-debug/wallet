const urls = [
  'https://polygon-mainnet.g.alchemy.com/v2/iwMFBfjlBAu9TGz-Nb5NF',
  'https://base-mainnet.g.alchemy.com/v2/iwMFBfjlBAu9TGz-Nb5NF',
  'https://arb-mainnet.g.alchemy.com/v2/iwMFBfjlBAu9TGz-Nb5NF'
]

async function run() {
  for (const url of urls) {
    console.log('\nURL:', url)
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_getBalance', params: ['0x0000000000000000000000000000000000000000', 'latest'] }),
      })
      console.log('status', res.status, res.headers.get('content-type'))
      const text = await res.text()
      console.log('body:', text.slice(0, 400))
    } catch (err) {
      console.error('fetch err', err)
    }
  }
}

run().catch(console.error)
