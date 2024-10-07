// app/page.tsx
'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import TransactionTable from '@/components/TransactionTable'
import Statistics from '@/components/Statistics'
import Charts from '@/components/Charts'
import MonthSelector from '@/components/MonthSelector'
import SearchBox from '@/components/SearchBox'
import { TransactionData } from '@/types'

const API_BASE_URL = 'http://localhost:5000/api'

export default function Home() {
  const [month, setMonth] = useState<string>('March')
  const [search, setSearch] = useState<string>('')
  const [page, setPage] = useState<number>(1)
  const [data, setData] = useState<TransactionData>({
    transactions: { transactions: [], totalPages: 0, currentPage: 1, totalItems: 0 },
    statistics: { totalSaleAmount: 0, soldItems: 0, notSoldItems: 0 },
    barChart: [],
    pieChart: []
  })
  const [loading, setLoading] = useState<boolean>(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${API_BASE_URL}/combined-data`, {
        params: { month, search, page }
      })
      setData(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [month, search, page])

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Transaction Dashboard</h1>
      
      <div className="mb-6 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <MonthSelector month={month} setMonth={setMonth} />
        <SearchBox search={search} setSearch={setSearch} />
      </div>

      <Statistics statistics={data.statistics} />
      
      <TransactionTable 
        transactions={data.transactions.transactions}
        currentPage={data.transactions.currentPage}
        totalPages={data.transactions.totalPages}
        setPage={setPage}
      />

      <Charts barChartData={data.barChart} pieChartData={data.pieChart} />
    </main>
  )
}


