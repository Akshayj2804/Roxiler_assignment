
// components/TransactionTable.tsx
interface Transaction {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    sold: boolean;
  }
  
  interface TransactionTableProps {
    transactions: Transaction[];
    currentPage: number;
    totalPages: number;
    setPage: (page: number) => void;
  }
  
  export default function TransactionTable({ 
    transactions, 
    currentPage, 
    totalPages, 
    setPage 
  }: TransactionTableProps) {
    return (
      <div className="mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="border p-2">ID</th>
                <th className="border p-2">Title</th>
                <th className="border p-2">Description</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Sold</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td className="border p-2">{transaction.id}</td>
                  <td className="border p-2">{transaction.title}</td>
                  <td className="border p-2">{transaction.description}</td>
                  <td className="border p-2">${transaction.price}</td>
                  <td className="border p-2">{transaction.category}</td>
                  <td className="border p-2">{transaction.sold ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        <div className="mt-4 flex justify-center space-x-2">
          <button
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Previous
          </button>
          <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>
    )
  }
  