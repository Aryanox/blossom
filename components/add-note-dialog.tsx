"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import type { Note } from "./period-tracker"

type AddNoteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  date?: Date
  onAddNote: (date: Date, note: Note) => void
  existingNote?: Note | null
}

const moodOptions = [
  { value: "happy", label: "😊 Happy", description: "Feeling good!" },
  { value: "neutral", label: "😐 Neutral", description: "Just okay" },
  { value: "tired", label: "😴 Tired", description: "Low energy" },
  { value: "sad", label: "😢 Sad", description: "Feeling down" },
  { value: "irritated", label: "😠 Irritated", description: "Easily annoyed" },
]

const symptomOptions = [
  { id: "cramps", label: "Cramps" },
  { id: "headache", label: "Headache" },
  { id: "bloating", label: "Bloating" },
  { id: "backache", label: "Backache" },
  { id: "tender", label: "Breast tenderness" },
  { id: "fatigue", label: "Fatigue" },
  { id: "acne", label: "Acne" },
  { id: "cravings", label: "Cravings" },
]

export function AddNoteDialog({ open, onOpenChange, date, onAddNote, existingNote }: AddNoteDialogProps) {
  const [mood, setMood] = useState<string>("neutral")
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [note, setNote] = useState<string>("")

  // Load existing note data if available
  useEffect(() => {
    if (existingNote) {
      setMood(existingNote.mood)
      setSymptoms(existingNote.symptoms)
      setNote(existingNote.note)
    } else {
      // Reset form when adding a new note
      setMood("neutral")
      setSymptoms([])
      setNote("")
    }
  }, [existingNote, open])

  const handleSubmit = () => {
    if (date) {
      onAddNote(date, {
        mood,
        symptoms,
        note,
      })
    }
  }

  const toggleSymptom = (symptomId: string) => {
    setSymptoms((prev) => (prev.includes(symptomId) ? prev.filter((id) => id !== symptomId) : [...prev, symptomId]))
  }

  if (!date) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white rounded-xl border-purple-200">
        <DialogHeader>
          <DialogTitle className="text-purple-600">
            ✨ {existingNote ? "Edit" : "Add"} Note for {format(date, "MMMM d, yyyy")}
          </DialogTitle>
          <DialogDescription>Track your mood, symptoms, and add notes for this day</DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <div className="space-y-2">
            <Label className="text-purple-600">How are you feeling today?</Label>
            <RadioGroup value={mood} onValueChange={setMood} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {moodOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`mood-${option.value}`} className="text-purple-600" />
                  <Label htmlFor={`mood-${option.value}`} className="flex flex-col">
                    <span>{option.label}</span>
                    <span className="text-xs text-gray-500">{option.description}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="text-purple-600">Any symptoms? (select all that apply)</Label>
            <div className="grid grid-cols-2 gap-2">
              {symptomOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`symptom-${option.id}`}
                    checked={symptoms.includes(option.id)}
                    onCheckedChange={() => toggleSymptom(option.id)}
                    className="text-pink-500 border-pink-300"
                  />
                  <Label htmlFor={`symptom-${option.id}`}>{option.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note" className="text-purple-600">
              Additional notes
            </Label>
            <Textarea
              id="note"
              placeholder="How are you feeling? Anything else to note?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[100px] border-purple-100 focus:border-purple-300"
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} className="bg-purple-500 hover:bg-purple-600">
            Save Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
