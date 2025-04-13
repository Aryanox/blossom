"use client"

import { useEffect, useState } from "react"
import { format, addDays, differenceInDays, parseISO, isWithinInterval } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddPeriodDialog } from "./add-period-dialog"
import { AddNoteDialog } from "./add-note-dialog"
import { PeriodStats } from "./period-stats"
import { DailyNote } from "./daily-note"
import { MotivationalMessage } from "./motivational-message"
import { CalendarIcon, PlusCircle } from "lucide-react"

// Types
export type Period = {
  id: string
  startDate: string
  endDate: string
}

export type Note = {
  mood: string
  symptoms: string[]
  note: string
}

export type PeriodData = {
  periods: Period[]
  notes: Record<string, Note>
  settings: {
    averageCycleLength: number
  }
}

// Default data
const defaultData: PeriodData = {
  periods: [],
  notes: {},
  settings: {
    averageCycleLength: 28,
  },
}

export function PeriodTracker() {
  const [data, setData] = useState<PeriodData>(defaultData)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [addPeriodOpen, setAddPeriodOpen] = useState(false)
  const [addNoteOpen, setAddNoteOpen] = useState(false)

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("periodTrackerData")
    if (savedData) {
      setData(JSON.parse(savedData))
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("periodTrackerData", JSON.stringify(data))
  }, [data])

  // Calculate next period prediction
  const getNextPeriod = () => {
    if (data.periods.length === 0) return null

    // Sort periods by start date
    const sortedPeriods = [...data.periods].sort(
      (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
    )

    const lastPeriod = sortedPeriods[0]
    const lastStartDate = parseISO(lastPeriod.startDate)
    const predictedNextDate = addDays(lastStartDate, data.settings.averageCycleLength)

    return {
      predictedDate: predictedNextDate,
      daysUntil: differenceInDays(predictedNextDate, new Date()),
    }
  }

  // Add a new period
  const addPeriod = (startDate: Date, endDate: Date) => {
    const newPeriod = {
      id: Date.now().toString(),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    }

    setData((prev) => {
      // Calculate average cycle length if we have more than one period
      const settings = { ...prev.settings }

      if (prev.periods.length > 0) {
        const sortedPeriods = [...prev.periods, newPeriod].sort(
          (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
        )

        let totalDays = 0
        let count = 0

        for (let i = 1; i < sortedPeriods.length; i++) {
          const current = parseISO(sortedPeriods[i].startDate)
          const previous = parseISO(sortedPeriods[i - 1].startDate)
          const diff = differenceInDays(current, previous)

          if (diff > 0 && diff < 60) {
            // Ignore outliers
            totalDays += diff
            count++
          }
        }

        if (count > 0) {
          settings.averageCycleLength = Math.round(totalDays / count)
        }
      }

      return {
        ...prev,
        periods: [...prev.periods, newPeriod],
        settings,
      }
    })

    setAddPeriodOpen(false)
  }

  // Add a note for a specific date
  const addNote = (date: Date, note: Note) => {
    const dateStr = format(date, "yyyy-MM-dd")

    setData((prev) => ({
      ...prev,
      notes: {
        ...prev.notes,
        [dateStr]: note,
      },
    }))

    setAddNoteOpen(false)
  }

  // Check if a date has a period
  const isInPeriod = (date: Date) => {
    // Check if date is valid before processing
    if (!date || isNaN(date.getTime())) return false

    return data.periods.some((period) => {
      const start = parseISO(period.startDate)
      const end = parseISO(period.endDate)
      return isWithinInterval(date, { start, end })
    })
  }

  // Check if a date has a note
  const hasNote = (date: Date) => {
    // Check if date is valid before processing
    if (!date || isNaN(date.getTime())) return false

    const dateStr = format(date, "yyyy-MM-dd")
    return !!data.notes[dateStr]
  }

  // Get note for selected date
  const getSelectedDateNote = () => {
    if (!selectedDate) return null
    const dateStr = format(selectedDate, "yyyy-MM-dd")
    return data.notes[dateStr]
  }

  const nextPeriod = getNextPeriod()
  const selectedDateNote = getSelectedDateNote()
  const isSelectedDateInPeriod = selectedDate ? isInPeriod(selectedDate) : false

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-pink-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-pink-600 flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Calendar
            </CardTitle>
            <CardDescription>Track your cycle and notes</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="w-full max-w-sm">
              <style jsx global>{`
                .rdp-cell {
                  text-align: center;
                  padding: 0;
                  height: 36px;
                }
                .rdp-day {
                  width: 36px;
                  height: 36px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  margin: 0 auto;
                }
                .rdp-day_today {
                  font-weight: bold;
                  border: 1px solid #ec4899;
                }
                .rdp-day_selected {
                  background-color: #ec4899 !important;
                  color: white !important;
                }
                .period-day {
                  background-color: #fbcfe8;
                  border-radius: 9999px;
                }
                .note-indicator {
                  position: absolute;
                  bottom: 2px;
                  right: 2px;
                  width: 4px;
                  height: 4px;
                  background-color: #c084fc;
                  border-radius: 9999px;
                }
              `}</style>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border border-pink-100"
                classNames={{
                  day_selected: "bg-pink-500 text-white hover:bg-pink-600",
                  day_today: "border border-pink-500 font-bold",
                  day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                  cell: "relative h-9 w-9 p-0 text-center text-sm focus-within:relative focus-within:z-20",
                  head_cell: "text-pink-600 font-medium text-sm",
                  nav_button: "text-pink-600 hover:bg-pink-100",
                  caption: "text-pink-700 font-medium",
                }}
                components={{
                  Day: ({ date, ...props }) => {
                    const isPeriodDay = isInPeriod(date)
                    const hasNoteForDay = hasNote(date)

                    return (
                      <div
                        {...props}
                        className={`relative flex items-center justify-center h-9 w-9 p-0 font-normal text-sm ${
                          isPeriodDay ? "period-day" : ""
                        } ${props.className || ""}`}
                      >
                        {date.getDate()}
                        {hasNoteForDay && <div className="note-indicator" />}
                      </div>
                    )
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <PeriodStats
            periodsCount={data.periods.length}
            averageCycleLength={data.settings.averageCycleLength}
            nextPeriod={nextPeriod}
          />

          <MotivationalMessage />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <Button onClick={() => setAddPeriodOpen(true)} className="bg-pink-500 hover:bg-pink-600">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Period
        </Button>

        <Button
          onClick={() => setAddNoteOpen(true)}
          variant="outline"
          className="border-pink-200 text-pink-700 hover:bg-pink-50"
          disabled={!selectedDate}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Note for {selectedDate ? format(selectedDate, "MMM d") : ""}
        </Button>
      </div>

      {selectedDate && selectedDateNote && (
        <DailyNote date={selectedDate} note={selectedDateNote} isInPeriod={isSelectedDateInPeriod} />
      )}

      <Tabs defaultValue="periods" className="mt-6">
        <TabsList className="grid w-full grid-cols-2 bg-pink-50">
          <TabsTrigger value="periods" className="data-[state=active]:bg-pink-200">
            Period History
          </TabsTrigger>
          <TabsTrigger value="notes" className="data-[state=active]:bg-pink-200">
            Notes History
          </TabsTrigger>
        </TabsList>
        <TabsContent value="periods" className="p-4 bg-white rounded-md border border-pink-100">
          {data.periods.length > 0 ? (
            <div className="space-y-2">
              {[...data.periods]
                .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                .map((period) => (
                  <div key={period.id} className="p-3 bg-pink-50 rounded-md flex justify-between">
                    <div>
                      <span className="font-medium">{format(parseISO(period.startDate), "MMM d, yyyy")}</span>
                      {" to "}
                      <span className="font-medium">{format(parseISO(period.endDate), "MMM d, yyyy")}</span>
                    </div>
                    <div className="text-pink-600">
                      {differenceInDays(parseISO(period.endDate), parseISO(period.startDate)) + 1} days
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">No periods recorded yet</p>
          )}
        </TabsContent>
        <TabsContent value="notes" className="p-4 bg-white rounded-md border border-pink-100">
          {Object.keys(data.notes).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(data.notes)
                .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
                .map(([dateStr, note]) => (
                  <div key={dateStr} className="p-3 bg-purple-50 rounded-md">
                    <div className="font-medium text-purple-700 mb-1">{format(parseISO(dateStr), "MMMM d, yyyy")}</div>
                    <div className="flex gap-2 mb-1">
                      <span className="text-sm bg-purple-100 px-2 py-0.5 rounded-full">Mood: {note.mood}</span>
                      {note.symptoms.map((symptom) => (
                        <span key={symptom} className="text-sm bg-pink-100 px-2 py-0.5 rounded-full">
                          {symptom}
                        </span>
                      ))}
                    </div>
                    {note.note && <p className="text-sm text-gray-700">{note.note}</p>}
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">No notes recorded yet</p>
          )}
        </TabsContent>
      </Tabs>

      <AddPeriodDialog open={addPeriodOpen} onOpenChange={setAddPeriodOpen} onAddPeriod={addPeriod} />

      <AddNoteDialog
        open={addNoteOpen}
        onOpenChange={setAddNoteOpen}
        date={selectedDate}
        onAddNote={addNote}
        existingNote={selectedDateNote}
      />
    </div>
  )
}
