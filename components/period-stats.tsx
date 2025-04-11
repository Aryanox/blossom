import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Clock } from "lucide-react"

type PeriodStatsProps = {
  periodsCount: number
  averageCycleLength: number
  nextPeriod: {
    predictedDate: Date
    daysUntil: number
  } | null
}

export function PeriodStats({ periodsCount, averageCycleLength, nextPeriod }: PeriodStatsProps) {
  return (
    <Card className="border-pink-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-pink-600">Your Cycle Stats</CardTitle>
        <CardDescription>Based on your tracked periods</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-pink-700">
            <CalendarDays className="h-4 w-4" />
            <span>Periods tracked:</span>
          </div>
          <span className="font-medium">{periodsCount}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-pink-700">
            <Clock className="h-4 w-4" />
            <span>Average cycle:</span>
          </div>
          <span className="font-medium">{averageCycleLength} days</span>
        </div>

        {nextPeriod && (
          <div className="mt-4 p-3 bg-pink-50 rounded-lg">
            <h4 className="text-sm font-medium text-pink-700 mb-1">Next period prediction</h4>
            <p className="text-pink-600 font-bold">{format(nextPeriod.predictedDate, "MMMM d, yyyy")}</p>
            <p className="text-sm text-pink-500 mt-1">
              {nextPeriod.daysUntil > 0
                ? `${nextPeriod.daysUntil} days from now`
                : nextPeriod.daysUntil === 0
                  ? "Today!"
                  : "Overdue"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
