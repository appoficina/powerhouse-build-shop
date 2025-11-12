import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  initialValue?: string;
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
}

export const SearchBar = ({ 
  initialValue = "", 
  placeholder = "Buscar produtos...",
  className = "",
  onSearch 
}: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    
    if (onSearch) {
      onSearch(query);
    } else {
      // Default behavior: navigate to products page with search query
      if (query) {
        navigate(`/produtos?search=${encodeURIComponent(query)}`);
      } else {
        navigate('/produtos');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <Input
        type="search"
        placeholder={placeholder}
        className="pl-10 pr-20"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        aria-label="Buscar produtos"
      />
      <Button 
        type="submit" 
        size="sm" 
        className="absolute right-1 top-1/2 -translate-y-1/2 h-7"
        aria-label="Executar busca"
      >
        Buscar
      </Button>
    </form>
  );
};
