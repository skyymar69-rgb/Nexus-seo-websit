export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* KPI cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-surface-200 dark:bg-surface-200 dark:bg-surface-700 rounded-lg border border-surface-200 dark:border-surface-700 p-6 space-y-3">
              <div className="h-3 w-20 bg-surface-200 dark:bg-surface-700 rounded" />
              <div className="h-8 w-16 bg-surface-200 dark:bg-surface-700 rounded" />
              <div className="h-3 w-24 bg-surface-200 dark:bg-surface-700 rounded" />
            </div>
          ))}
        </div>

        {/* Chart skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-surface-200 dark:bg-surface-200 dark:bg-surface-700 rounded-lg border border-surface-200 dark:border-surface-700 p-8">
            <div className="h-4 w-20 bg-surface-200 dark:bg-surface-700 rounded mb-6" />
            <div className="w-40 h-40 rounded-full border-8 border-surface-200 dark:border-surface-700 mx-auto" />
          </div>
          <div className="lg:col-span-2 bg-surface-200 dark:bg-surface-200 dark:bg-surface-700 rounded-lg border border-surface-200 dark:border-surface-700 p-6">
            <div className="h-4 w-32 bg-surface-200 dark:bg-surface-700 rounded mb-6" />
            <div className="h-[250px] bg-surface-100 dark:bg-surface-800 rounded" />
          </div>
        </div>

        {/* Table skeleton */}
        <div className="bg-surface-200 dark:bg-surface-200 dark:bg-surface-700 rounded-lg border border-surface-200 dark:border-surface-700 p-6">
          <div className="h-4 w-32 bg-surface-200 dark:bg-surface-700 rounded mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="h-4 w-24 bg-surface-200 dark:bg-surface-700 rounded" />
                <div className="h-4 w-12 bg-surface-200 dark:bg-surface-700 rounded" />
                <div className="h-4 w-16 bg-surface-200 dark:bg-surface-700 rounded" />
                <div className="h-4 flex-1 bg-surface-200 dark:bg-surface-700 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
