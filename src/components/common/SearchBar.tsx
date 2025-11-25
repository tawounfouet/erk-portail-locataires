import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";

interface ISearchBarProps<T> 
{
    data: T[];
    searchFields?: keyof T | (keyof T)[];
    onFilteredResults: (filteredData: T[]) => void;
    placeholder?: string;
    className?: string;
    debounceMs?: number;
    caseSensitive?: boolean;
}

export default function SearchBar<T>({ 
    data,
    searchFields,
    onFilteredResults,
    placeholder = "Rechercher...",
    className = "",
    debounceMs = 300,
    caseSensitive = false
}: ISearchBarProps<T>): JSX.Element {
    const [searchValue, setSearchValue] = useState<string>('');
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

    const filterData = (value: string): void => {
        if (!value.trim()) 
        {
            onFilteredResults(data);
            return;
        }

        const searchTerm = caseSensitive ? value : value.toLowerCase();

        const filtered = data.filter((item) => {
            // If it is an array of primitives (string, number, etc.)
            if (typeof item !== 'object' || item === null) {
                const itemValue = caseSensitive ? String(item) : String(item).toLowerCase();
                return itemValue.includes(searchTerm);
            }

            // If it is an array of objects
            const fieldsToSearch = searchFields 
            ? (Array.isArray(searchFields) ? searchFields : [searchFields])
            : (Object.keys(item) as (keyof T)[]);

            return fieldsToSearch.some((field) => {
                const fieldValue = item[field];
                if (fieldValue === null || fieldValue === undefined) return false;
                
                const valueStr = caseSensitive 
                    ? String(fieldValue) 
                    : String(fieldValue).toLowerCase();
                
                return valueStr.includes(searchTerm);
            });
        });

        onFilteredResults(filtered);
    };

    const handleSearch = (value: string): void => {
        setSearchValue(value);

        // Debounce to avoid too many calls
        if (debounceTimer) 
        {
            clearTimeout(debounceTimer);
        }

        const timer = setTimeout(() => {
            filterData(value);
        }, debounceMs);

            setDebounceTimer(timer);
        };

        const clearSearch = (): void => {
            setSearchValue('');
            onFilteredResults(data);
        };

        useEffect(() => {
            onFilteredResults(data);
        }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="relative flex items-center">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
          className="w-full h-12 bg-[#2f2014] border border-white/10 rounded-full py-4 px-12 text-white placeholder:text-white-600 placeholder:text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
        />
        {searchValue && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4 text-gray-400" />
          </Button>
        )}
      </div>
    </div>
  );
}