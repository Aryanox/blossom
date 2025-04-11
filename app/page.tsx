import { PeriodTracker } from "@/components/period-tracker"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-pink-600 mb-2">🌸 Blossom Tracker 🌸</h1>
        <p className="text-center text-pink-500 mb-8">Your cute period companion</p>
        <PeriodTracker />
      </div>
    </main>
  )
}
