// types/index.ts
export interface Transaction {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    sold: boolean;
  }
  
  export interface TransactionData {
    transactions: {
      transactions: Transaction[];
      totalPages: number;
      currentPage: number;
      totalItems: number;
    };
    statistics: {
      totalSaleAmount: number;
      soldItems: number;
      notSoldItems: number;
    };
    barChart: Array<{
      range: string;
      count: number;
    }>;
    pieChart: Array<{
      category: string;
      count: number;
    }>;
  }