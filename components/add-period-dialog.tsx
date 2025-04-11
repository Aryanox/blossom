"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
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

type AddPeriodDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddPeriod: (startDate: Date, endDate: Date) => void
}

export function AddPeriodDialog({ open, onOpenChange, onAddPeriod }: AddPeriodDialogProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  const [step, setStep] = useState<"start" | "end">("start")

  const handleContinue = () => {
    if (step === "start" && startDate) {
      setStep("end")
      setEndDate(startDate) // Default end date to start date
    }
  }

  const handleSubmit = () => {
    if (startDate && endDate) {
      onAddPeriod(startDate, endDate)
      // Reset state
      setStartDate(new Date())
      setEndDate(new Date())
      setStep("start")
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset state when dialog closes
      setStep("start")
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-xl border-pink-200">
        <DialogHeader>
          <DialogTitle className="text-pink-600">
            {step === "start" ? "🌸 Add Period Start Date" : "🌸 Add Period End Date"}
          </DialogTitle>
          <DialogDescription>
            {step === "start" ? "Select the first day of your period" : "Select the last day of your period"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 flex flex-col items-center">
          {step === "start" ? (
            <>
              <Label className="mb-2 text-pink-600">When did your period start?</Label>
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                className="rounded-md border border-pink-100"
                disabled={(date) => date > new Date()}
              />
              {startDate && <p className="mt-2 text-sm text-pink-600">Selected: {format(startDate, "MMMM d, yyyy")}</p>}
            </>
          ) : (
            <>
              <Label className="mb-2 text-pink-600">When did your period end?</Label>
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                className="rounded-md border border-pink-100"
                disabled={(date) => (startDate && date < startDate) || date > new Date()}
              />
              {endDate && <p className="mt-2 text-sm text-pink-600">Selected: {format(endDate, "MMMM d, yyyy")}</p>}
            </>
          )}
        </div>

        <DialogFooter>
          {step === "end" && (
            <Button variant="outline" onClick={() => setStep("start")} className="border-pink-200 text-pink-600">
              Back
            </Button>
          )}

          {step === "start" ? (
            <Button onClick={handleContinue} disabled={!startDate} className="bg-pink-500 hover:bg-pink-600">
              Continue
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!endDate} className="bg-pink-500 hover:bg-pink-600">
              Save Period
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
