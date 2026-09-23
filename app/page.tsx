export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-20">
      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 opacity-80 blur-sm" />
      <h1 className="text-3xl font-bold text-white">Welcome to Stellar App</h1>
      <p className="max-w-md text-center text-zinc-400">
        Connect your Stellar wallet using the button in the top right corner.
        Your session is saved in localStorage so you stay connected on refresh.
      </p>
      <div className="mt-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
        Network: Testnet
      </div>
    </main>
  )
}
