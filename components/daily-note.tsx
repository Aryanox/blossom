import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Note } from "./period-tracker"

type DailyNoteProps = {
  date: Date
  note: Note
  isInPeriod: boolean
}

// Map mood to emoji
const moodEmojis: Record<string, string> = {
  happy: "😊",
  neutral: "😐",
  tired: "😴",
  sad: "😢",
  irritated: "😠",
}

export function DailyNote({ date, note, isInPeriod }: DailyNoteProps) {
  return (
    <Card className={`border-${isInPeriod ? "pink" : "purple"}-200 shadow-sm`}>
      <CardHeader className={`pb-2 bg-${isInPeriod ? "pink" : "purple"}-50 rounded-t-lg`}>
        <CardTitle className={`text-${isInPeriod ? "pink" : "purple"}-600 flex items-center gap-2`}>
          {format(date, "MMMM d, yyyy")}
          {isInPeriod && <span className="text-xs bg-pink-200 px-2 py-0.5 rounded-full">Period day</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="text-2xl">{moodEmojis[note.mood] || "😐"}</div>
            <div className="font-medium capitalize">{note.mood}</div>
          </div>

          {note.symptoms.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-1 text-gray-600">Symptoms:</h4>
              <div className="flex flex-wrap gap-1">
                {note.symptoms.map((symptom) => (
                  <span
                    key={symptom}
                    className={`text-xs ${isInPeriod ? "bg-pink-100" : "bg-purple-100"} px-2 py-0.5 rounded-full`}
                  >
                    {symptom}
                  </span>
                ))}
              </div>
            </div>
          )}

          {note.note && (
            <div>
              <h4 className="text-sm font-medium mb-1 text-gray-600">Notes:</h4>
              <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded-md">{note.note}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
