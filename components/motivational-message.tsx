"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Heart } from "lucide-react"

const messages = [
  "You're doing great! Self-care is important 💖",
  "Listen to your body and give it what it needs today 🌸",
  "You are strong, beautiful, and capable! 💪",
  "Take a moment to breathe deeply and relax 🧘‍♀️",
  "Treat yourself with kindness today 🍵",
  "Your feelings are valid. Be gentle with yourself 🌷",
  "Stay hydrated and take care of yourself 💧",
  "You've got this! One day at a time 🌈",
  "Remember to take breaks when you need them 🌿",
  "You are not alone in this journey 💕",
]

export function MotivationalMessage() {
  const [message, setMessage] = useState("")

  useEffect(() => {
    // Get a random message
    const randomIndex = Math.floor(Math.random() * messages.length)
    setMessage(messages[randomIndex])

    // Change message every day
    const interval = setInterval(() => {
      const newIndex = Math.floor(Math.random() * messages.length)
      setMessage(messages[newIndex])
    }, 86400000) // 24 hours

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="h-4 w-4 text-pink-500" fill="#ec4899" />
          <h3 className="font-medium text-pink-600">Daily Reminder</h3>
        </div>
        <p className="text-sm text-pink-700">{message}</p>
      </CardContent>
    </Card>
  )
}
