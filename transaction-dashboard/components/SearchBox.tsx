
// components/SearchBox.tsx
interface SearchBoxProps {
    search: string;
    setSearch: (search: string) => void;
  }
  
  export default function SearchBox({ search, setSearch }: SearchBoxProps) {
    return (
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search transactions..."
        className="p-2 border rounded w-full"
      />
    )
  }
  