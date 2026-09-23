'use client'

import { useEffect, useState, useCallback } from 'react'
import { useWalletStore } from '@/store/walletStore'
import { initWalletKit, StellarWalletsKit } from '@/lib/walletKit'

function truncateAddress(address: string): string {
  return `${address.slice(0, 4)}...${address.slice(-4)}`
}

export default function Navbar() {
  const { address, isConnected, setAddress, reset } = useWalletStore()
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)
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

  const copyAddress = useCallback(async () => {
    if (!address) return
    await navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [address])

  return (
    <nav className="w-full border-b border-zinc-800 bg-zinc-950 px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-500 to-blue-500" />
          <span className="text-lg font-semibold text-white tracking-tight">
            Stellar App
          </span>
          <span className="ml-1 rounded-full bg-violet-500/20 px-2 py-0.5 text-xs font-medium text-violet-300">
            Testnet
          </span>
        </div>

        {/* Wallet area */}
        <div className="flex items-center gap-2">
          {!mounted ? null : isConnected && address ? (
            <>
              {/* Address pill */}
              <div className="flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1.5">
                <span className="font-mono text-sm text-zinc-200">
                  {truncateAddress(address)}
                </span>
                {/* Copy button */}
                <button
                  onClick={copyAddress}
                  title="Copy address"
                  className="ml-1 rounded p-0.5 text-zinc-400 transition hover:text-white"
                >
                  {copied ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
              {copied && (
                <span className="text-xs text-green-400 transition-opacity">Copied!</span>
              )}
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
