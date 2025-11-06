import { Link } from "react-router-dom";
import { Package, Mail, Phone, MapPin } from "lucide-react";
export const Footer = () => {
  return <footer className="border-t bg-muted/40 mt-auto">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-primary">Powerhouse Shop</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Ferramentas e equipamentos profissionais das melhores marcas do mercado.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Links Úteis</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-smooth">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/produtos" className="text-muted-foreground hover:text-primary transition-smooth">
                  Produtos
                </Link>
              </li>
              <li>
                <Link to="/carrinho" className="text-muted-foreground hover:text-primary transition-smooth">
                  Carrinho
                </Link>
              </li>
            </ul>
          </div>

          {/* Marcas */}
          <div>
            <h3 className="font-semibold mb-4">Marcas</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Tssaper</li>
              <li>Buffalo</li>
              <li>Toyama</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>(51) 982222222</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>contato@powerhouse.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>São Leopoldo, RS</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Powerhouse Shop. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>;
};