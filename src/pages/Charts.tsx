import * as React from "react"
import { useEffect } from "react"
import Layout from "@/components/Layout"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import {
  aggregateCurrentWeek,
  aggregateMonthWeeks,
  aggregateYearMonths
} from "@/lib/timeAggregations"

import { RegionBarChart } from "@/components/RegionBarChart"
import { invoke } from "@tauri-apps/api/core"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

type Store = {
  records: {
    date: string
    dayTime: string
    regionSums: Record<string, number>
  }[]
}

export function Charts() {
  const now = new Date()
  const [month, setMonth] = React.useState(now.getMonth())
  const [year, setYear] = React.useState(now.getFullYear())
  const [store, setStore] = React.useState<Store>({ records: [] })
  const [region, setRegion] = React.useState<string>("")

  const getAllRecords = async () => {
    const storeJson: string = await invoke("load_store")
    setStore(JSON.parse(storeJson))
  }

  useEffect(() => {
    getAllRecords()
  }, [])

  // Auto-select first available region
  useEffect(() => {
    if (!region && store.records.length > 0) {
      const firstRegion = Object.keys(store.records[0].regionSums)[0]
      setRegion(firstRegion)
    }
  }, [store, region])

  const availableRegions = React.useMemo(() => {
    if (store.records.length === 0) return []
    return Object.keys(store.records[0].regionSums)
  }, [store])

  if (!region) {
    return <Layout>Loading…</Layout>
  }

  return (
    <Layout>
        <div className="flex flex-col gap-10 items-center justify-center min-h-[calc(100vh-4rem)]">
      <Card className="w-[90vw] h-[calc(100vh-5rem)] flex flex-col overflow-hidden">
        <CardHeader className="flex flex-col gap-3">
          {/* <CardTitle>{region} trend</CardTitle> */}

          {/* REGION SELECTOR */}
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              {availableRegions.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>

       <CardContent className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <Tabs defaultValue="days" className="flex flex-col flex-1 min-h-0">

            <TabsList className="grid grid-cols-3 w-full mb-4">
              <TabsTrigger value="days">Days</TabsTrigger>
              <TabsTrigger value="weeks">Weeks</TabsTrigger>
              <TabsTrigger value="months">Months</TabsTrigger>
            </TabsList>

            {/* DAYS — CURRENT WEEK */}
           <TabsContent value="days" className="flex-1 min-h-0 overflow-hidden">
              <RegionBarChart
                data={aggregateCurrentWeek(store.records, region)}
              />
            </TabsContent>

            {/* WEEKS — SELECT MONTH */}
            <TabsContent value="weeks" className="flex flex-col min-h-0 overflow-hidden">
              <div className="flex justify-end mb-3">
                <Select
                  value={String(month)}
                  onValueChange={(v) => setMonth(Number(v))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((m, i) => (
                      <SelectItem key={m} value={String(i)}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              <RegionBarChart
                data={aggregateMonthWeeks(store.records, region, month, year)}
              />
              </div>
            </TabsContent>

            {/* MONTHS — SELECT YEAR */}
             <TabsContent value="months" className="flex flex-col min-h-0 overflow-hidden">
              <div className="flex justify-end mb-3">
                <Select
                  value={String(year)}
                  onValueChange={(v) => setYear(Number(v))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[2024, 2025, 2026].map((y) => (
                      <SelectItem key={y} value={String(y)}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
                <div className="flex-1 min-h-0 overflow-hidden">
              <RegionBarChart
                data={aggregateYearMonths(store.records, region, year)}
              />
              </div>
            </TabsContent>

          </Tabs>
        </CardContent>
      </Card>
      </div>
    </Layout>
  )
}