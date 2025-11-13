import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NavLink } from "@/components/NavLink";
import { SearchBar } from "@/components/SearchBar";
import { useCart } from "@/contexts/CartContext";
import { useTheme } from "next-themes";
import logoDark from "@/assets/logo-dark.svg";
import logoLight from "@/assets/logo-light.svg";

export const Header = () => {
  const { totalItems } = useCart();
  const { theme } = useTheme();
  const location = useLocation();
  const logo = theme === "dark" ? logoDark : logoLight;
  
  // Don't show search bar on products page (it has its own)
  const showSearchBar = !location.pathname.startsWith('/produtos');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 gap-4">
        <Link to="/" className="flex items-center gap-2 mr-6 shrink-0">
          <img src={logo} alt="Powerhouse Shop" className="h-8" />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/produtos">Produtos</NavLink>
          <NavLink to="/admin">Admin</NavLink>
        </nav>

        {showSearchBar && (
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <SearchBar placeholder="Buscar produtos..." />
          </div>
        )}

        <div className="flex items-center gap-2 ml-auto">
          <Link to="/carrinho">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Mobile search bar */}
      {showSearchBar && (
        <div className="md:hidden border-t">
          <div className="container px-4 py-3">
            <SearchBar placeholder="Buscar produtos..." />
          </div>
        </div>
      )}
    </header>
  );
};
