'use client'

import { useEffect, useState, useCallback } from 'react'
import { useWalletStore } from '@/store/walletStore'
import { initWalletKit, StellarWalletsKit } from '@/lib/walletKit'

export default function Navbar() {
  const { address, isConnected, setAddress, reset } = useWalletStore()
  const [mounted, setMounted] = useState(false)
  const [connecting, setConnecting] = useState(false)

  useEffect(() => {
    initWalletKit()
    useWalletStore.persist.rehydrate()
    setMounted(true)
  }, [])

  const connect = useCallback(async () => {
    try {
      setConnecting(true)
      const { address: addr } = await StellarWalletsKit.authModal()
      setAddress(addr)
    } catch {
      // user closed modal or cancelled
    } finally {
      setConnecting(false)
    }
  }, [setAddress])

  const disconnect = useCallback(async () => {
    try {
      await StellarWalletsKit.disconnect()
    } catch {
      // ignore disconnect errors
    }
    reset()
  }, [reset])

  return (
    <nav className="w-full border-b border-zinc-800 bg-zinc-950 px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-500 to-blue-500" />
          <span className="text-lg font-semibold text-white tracking-tight">
            Stellar App
          </span>
        </div>

        {/* Wallet area */}
        <div className="flex items-center gap-2">
          {!mounted ? null : isConnected && address ? (
            <>
              {/* Disconnect */}
              <button
                onClick={disconnect}
                className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-400 transition hover:border-red-500/50 hover:text-red-400"
              >
                Disconnect
              </button>
            </>
          ) : (
            <button
              onClick={connect}
              disabled={connecting}
              className="rounded-full bg-violet-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-violet-500 disabled:opacity-60"
            >
              {connecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
