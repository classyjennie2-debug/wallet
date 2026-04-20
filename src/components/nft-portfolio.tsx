'use client'

import { useState } from 'react'

interface NFT {
  id: string
  name: string
  collection: string
  image: string
  floorPrice: number
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary'
  chain: string
}

export const NFTPortfolio = () => {
  const [nfts] = useState<NFT[]>([
    {
      id: '1',
      name: 'Cosmic Voyager #042',
      collection: 'Space Collective',
      image: '🚀',
      floorPrice: 2.5,
      rarity: 'rare',
      chain: 'Ethereum'
    },
    {
      id: '2',
      name: 'Digital Dreams #128',
      collection: 'Art Masters',
      image: '🎨',
      floorPrice: 1.2,
      rarity: 'uncommon',
      chain: 'Polygon'
    },
    {
      id: '3',
      name: 'Ancient Dragon #007',
      collection: 'Mythical Beasts',
      image: '🐉',
      floorPrice: 5.8,
      rarity: 'legendary',
      chain: 'Ethereum'
    },
    {
      id: '4',
      name: 'Pixel Artist #256',
      collection: 'Retro Wave',
      image: '🎮',
      floorPrice: 0.8,
      rarity: 'common',
      chain: 'Base'
    },
  ])

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-500 to-orange-500 border-yellow-500/50'
      case 'rare': return 'from-purple-500 to-pink-500 border-purple-500/50'
      case 'uncommon': return 'from-cyan-500 to-blue-500 border-cyan-500/50'
      default: return 'from-gray-500 to-slate-500 border-gray-500/50'
    }
  }

  const totalValue = nfts.reduce((sum, nft) => sum + nft.floorPrice, 0)

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/30">
          <p className="text-xs text-cyan-300/70 uppercase font-semibold mb-1">Total NFTs</p>
          <p className="text-2xl font-bold text-white">{nfts.length}</p>
        </div>
        <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30">
          <p className="text-xs text-purple-300/70 uppercase font-semibold mb-1">Total Value</p>
          <p className="text-2xl font-bold text-white">{totalValue.toFixed(1)} ETH</p>
        </div>
        <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30">
          <p className="text-xs text-emerald-300/70 uppercase font-semibold mb-1">Collections</p>
          <p className="text-2xl font-bold text-white">{new Set(nfts.map(n => n.collection)).size}</p>
        </div>
        <div className="p-4 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/10 border border-orange-500/30">
          <p className="text-xs text-orange-300/70 uppercase font-semibold mb-1">Floor Price</p>
          <p className="text-2xl font-bold text-white">{Math.min(...nfts.map(n => n.floorPrice)).toFixed(2)} ETH</p>
        </div>
      </div>

      {/* NFTs Grid */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">Your NFTs</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {nfts.map((nft) => (
            <div
              key={nft.id}
              className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-white/5 to-white/3 hover:border-white/20 transition-all group cursor-pointer"
            >
              {/* Image */}
              <div className="aspect-square bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center overflow-hidden">
                <div className="text-8xl group-hover:scale-110 transition-transform">{nft.image}</div>
              </div>

              {/* Info */}
              <div className="p-4 space-y-3">
                {/* Rarity Badge */}
                <div className={`inline-flex px-2 py-1 rounded text-xs font-bold bg-gradient-to-r ${getRarityColor(nft.rarity)} text-white border`}>
                  {nft.rarity.charAt(0).toUpperCase() + nft.rarity.slice(1)}
                </div>

                {/* Name & Collection */}
                <div>
                  <p className="font-bold text-white text-sm line-clamp-2">{nft.name}</p>
                  <p className="text-xs text-gray-400 mt-1">{nft.collection}</p>
                </div>

                {/* Chain & Price */}
                <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                  <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded">{nft.chain}</span>
                  <span className="font-bold text-cyan-400 text-sm">{nft.floorPrice} ETH</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State Message */}
      {nfts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🖼️</div>
          <p className="text-gray-400">No NFTs found. Transfer NFTs to your wallet to see them here.</p>
        </div>
      )}
    </div>
  )
}
