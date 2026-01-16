interface RecordEntry {
  date: string // DD/MM/YYYY
  dayTime: string
  regionSums: Record<string, number>
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function parseDate(date: string) {
  const [d, m, y] = date.split("/").map(Number)
  return new Date(y, m - 1, d)
}

/* ================= CURRENT WEEK (DAYS) ================= */
export function aggregateCurrentWeek(
  records: RecordEntry[],
  region: string
) {
  const now = new Date()

  const monday = new Date(now)
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7))
  monday.setHours(0, 0, 0, 0)

  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)

  const buckets = Array(7).fill(0)

  records.forEach((record) => {
    const value = record.regionSums?.[region]
    if (value == null) return

    const date = parseDate(record.date)

    if (date >= monday && date <= sunday) {
      const index = (date.getDay() + 6) % 7
      buckets[index] = Math.max(buckets[index], value)
    }
  })

  return DAYS.map((label, i) => ({
    label,
    value: buckets[i]
  }))
}

/* ================= MONTH (4 WEEKS) ================= */
export function aggregateMonthWeeks(
  records: RecordEntry[],
  region: string,
  month: number, // 0–11
  year: number
) {
  const buckets = [0, 0, 0, 0]

  records.forEach((record) => {
    const value = record.regionSums?.[region]
    if (value == null) return

    const date = parseDate(record.date)

    if (date.getMonth() === month && date.getFullYear() === year) {
      const weekIndex = Math.min(Math.floor((date.getDate() - 1) / 7), 3)
      buckets[weekIndex] = Math.max(buckets[weekIndex], value)
    }
  })

  return buckets.map((value, i) => ({
    label: `Week ${i + 1}`,
    value
  }))
}

/* ================= YEAR (12 MONTHS) ================= */
export function aggregateYearMonths(
  records: RecordEntry[],
  region: string,
  year: number
) {
  const buckets = Array(12).fill(0)

  records.forEach((record) => {
    const value = record.regionSums?.[region]
    if (value == null) return

    const date = parseDate(record.date)

    if (date.getFullYear() === year) {
      const monthIndex = date.getMonth()
      buckets[monthIndex] = Math.max(buckets[monthIndex], value)
    }
  })

  return MONTHS.map((label, i) => ({
    label,
    value: buckets[i]
  }))
}