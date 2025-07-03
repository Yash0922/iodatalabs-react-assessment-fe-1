import { useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import { DataTable } from './components/DataTable'
import { FiltersForm } from './components/FiltersForm'
import { useReportsData } from './hooks/useReportsData'
import { exportAsCSV, formatReportsForCSV, REPORTS_CSV_HEADERS } from '../src/lib/csvExport'
import './App.css'

function App() {
  const [exportLoading, setExportLoading] = useState(false)
  const [exportMessage, setExportMessage] = useState('')
  
  const {
    data,
    loading,
    error,
    pagination,
    sorting,
    filters,
    onPaginationChange,
    onSortingChange,
    applyFilters,
    refetch
  } = useReportsData()

  const columns = useMemo(() => [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('title')}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status')
        const statusColors = {
          draft: 'bg-gray-100 text-gray-800',
          pending: 'bg-yellow-100 text-yellow-800',
          approved: 'bg-green-100 text-green-800',
          published: 'bg-blue-100 text-blue-800',
          archived: 'bg-red-100 text-red-800',
        }
        return (
          <span className={`px-2 py-1 text-xs rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
          </span>
        )
      },
    },
    {
      accessorKey: 'department',
      header: 'Department',
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">{row.getValue('department')}</div>
      ),
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ row }) => {
        const priority = row.getValue('priority')
        const priorityColors = {
          low: 'bg-blue-100 text-blue-800',
          medium: 'bg-yellow-100 text-yellow-800',
          high: 'bg-red-100 text-red-800',
        }
        return (
          <span className={`px-2 py-1 text-xs rounded-full ${priorityColors[priority] || 'bg-gray-100 text-gray-800'}`}>
            {priority}
          </span>
        )
      },
    },
    {
      accessorKey: 'author',
      header: 'Author',
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue('author')}</div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          {new Date(row.getValue('createdAt')).toLocaleDateString()}
        </div>
      ),
    },
    {
      accessorKey: 'updatedAt',
      header: 'Updated',
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          {new Date(row.getValue('updatedAt')).toLocaleDateString()}
        </div>
      ),
    },
  ], [])

  const handleExportCSV = async () => {
    try {
      setExportLoading(true)
      setExportMessage('')
      
      if (!data || data.length === 0) {
        setExportMessage('No data to export')
        return
      }
      
      // Format the data for CSV export
      const formattedData = formatReportsForCSV(data)
      
      // Export as CSV with custom headers
      const result = await exportAsCSV(
        formattedData,
        'reports-export',
        REPORTS_CSV_HEADERS
      )
      
      if (result.success) {
        setExportMessage(`Successfully exported ${data.length} reports to ${result.filename}`)
        
        // Clear the message after 5 seconds
        setTimeout(() => setExportMessage(''), 5000)
      }
    } catch (error) {
      console.error('Export failed:', error)
      setExportMessage(`Export failed: ${error.message}`)
      
      // Clear error message after 5 seconds
      setTimeout(() => setExportMessage(''), 5000)
    } finally {
      setExportLoading(false)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Report Management</h1>
          <p className="text-gray-600">Filter and manage your reports with real-time search</p>
        </div>

        <div className="space-y-6">
          {/* Filters Form */}
          <FiltersForm onSubmit={applyFilters} initialFilters={filters} />

          {/* Data Table */}
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <h2 className="text-lg font-semibold">Reports</h2>
                  {loading && (
                    <div className="text-sm text-gray-500 flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      Loading...
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-3">
                  {/* Export Status Message */}
                  {exportMessage && (
                    <div className={`text-sm px-3 py-1 rounded-md ${
                      exportMessage.includes('failed') || exportMessage.includes('No data')
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {exportMessage}
                    </div>
                  )}
                  
                  {/* Export Button */}
                  <button
                    onClick={handleExportCSV}
                    disabled={exportLoading || !data || data.length === 0}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    {exportLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Exporting...</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        <span>Export CSV</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <DataTable
                data={data}
                columns={columns}
                pagination={pagination}
                onPaginationChange={onPaginationChange}
                sorting={sorting}
                onSortingChange={onSortingChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App