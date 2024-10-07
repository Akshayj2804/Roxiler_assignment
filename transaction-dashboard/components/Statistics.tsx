
// components/Statistics.tsx
interface StatisticsProps {
    statistics: {
      totalSaleAmount: number;
      soldItems: number;
      notSoldItems: number;
    }
  }
  
  export default function Statistics({ statistics }: StatisticsProps) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded">
          <h3 className="font-semibold">Total Sale</h3>
          <p>${statistics.totalSaleAmount.toFixed(2)}</p>
        </div>
        <div className="bg-green-100 p-4 rounded">
          <h3 className="font-semibold">Sold Items</h3>
          <p>{statistics.soldItems}</p>
        </div>
        <div className="bg-red-100 p-4 rounded">
          <h3 className="font-semibold">Not Sold Items</h3>
          <p>{statistics.notSoldItems}</p>
        </div>
      </div>
    )
  }