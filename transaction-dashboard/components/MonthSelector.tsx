
// components/MonthSelector.tsx
interface MonthSelectorProps {
    month: string;
    setMonth: (month: string) => void;
  }
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  
  export default function MonthSelector({ month, setMonth }: MonthSelectorProps) {
    return (
      <select
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="p-2 border rounded w-full sm:w-auto"
      >
        {months.map(m => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
    )
  }
  