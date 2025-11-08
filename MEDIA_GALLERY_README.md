# Galeria Multi-Mídia de Produtos - Estilo Mercado Livre

## 📋 Visão Geral

Sistema completo de galeria multi-mídia para produtos com suporte a múltiplas imagens e vídeos, incluindo painel administrativo para gerenciamento e galeria otimizada na página de detalhes do produto (PDP).

## 🎯 Funcionalidades Implementadas

### Backend (Supabase)

#### 1. Tabela `product_media`
- **Campos:**
  - `id`: UUID (PK)
  - `product_id`: UUID (FK → products)
  - `kind`: ENUM ('image', 'video')
  - `url`: TEXT (URL pública do Supabase Storage ou externa)
  - `alt`: TEXT (texto alternativo para acessibilidade)
  - `sort`: INTEGER (ordem de exibição)
  - `is_primary`: BOOLEAN (marca imagem principal/capa)
  - `meta`: JSONB (metadados: width, height, duration, provider, poster)
  - `created_at`: TIMESTAMP

#### 2. Storage Bucket `product-images`
- **Configuração:**
  - Público: ✅
  - MIME types aceitos: `image/png`, `image/jpeg`, `image/webp`, `video/mp4`, `video/webm`
  - Padrão de caminhos: `products/<product_id>/<sort>-<filename>.<ext>`

#### 3. RLS Policies
- **SELECT**: Público (todos podem visualizar)
- **INSERT/UPDATE/DELETE**: Apenas admins autenticados

#### 4. Migração Automática de Dados Legados
- Migra automaticamente `image_url` e `additional_images` da tabela `products` para `product_media`
- Define primeira imagem como `is_primary=true`

### Frontend

#### 1. Admin Panel (`AdminMediaManager`)
**Localização:** `src/modules/catalog/components/AdminMediaManager.tsx`

**Recursos:**
- ✅ Upload múltiplo de arquivos (drag & drop)
- ✅ Adicionar mídia por URL (imagens e vídeos do YouTube/Vimeo)
- ✅ Preview em grid com miniaturas
- ✅ Reordenar itens (drag & drop)
- ✅ Definir imagem principal (capa)
- ✅ Editar texto alternativo (ALT)
- ✅ Excluir itens
- ✅ Validação de limites: máx. 8 imagens + 1 vídeo

**Como usar:**
1. Edite um produto existente em `/admin/produtos`
2. Role até a seção "Galeria de Mídia"
3. Faça upload de arquivos ou adicione URLs
4. Arraste para reordenar
5. Clique na estrela para definir a capa
6. Clique no texto ALT para editar

#### 2. PDP Gallery (`ProductMediaGallery`)
**Localização:** `src/modules/catalog/components/ProductMediaGallery.tsx`

**Recursos:**
- ✅ Layout estilo Mercado Livre (thumbnails verticais + imagem principal)
- ✅ Zoom na imagem principal (react-medium-image-zoom)
- ✅ Suporte a vídeos:
  - Upload nativo: player HTML5 com controles
  - YouTube/Vimeo: embed com iframe no-cookie
- ✅ Navegação por teclado (setas)
- ✅ Navegação por clique nas thumbs
- ✅ Contador de mídia (1/5)
- ✅ Responsivo (mobile: thumbs horizontais abaixo)
- ✅ Acessibilidade completa (ARIA, roles, labels)

#### 3. Product Cards
**Localização:** `src/components/ProductCard.tsx`

**Atualização:**
- Usa automaticamente a imagem marcada como `is_primary`
- Fallback para primeira imagem se não houver primária
- Fallback para `image_url` legado se não houver mídia

## 🔧 Como Usar

### 1. Adicionar Mídia a um Produto

#### Por Upload (Admin):
```typescript
1. Navegue para /admin/produtos
2. Clique em "Editar" (ícone de lápis) em qualquer produto
3. Role até "Galeria de Mídia"
4. Clique em "Upload Arquivos" ou arraste arquivos
5. Aceitos: PNG, JPEG, WEBP, MP4, WEBM
```

#### Por URL (Admin):
```typescript
1. No mesmo painel, clique "Adicionar URL"
2. Selecione o tipo (Imagem ou Vídeo)
3. Cole a URL (Unsplash, YouTube, Vimeo, etc.)
4. Clique "Adicionar"
```

### 2. Visualizar na PDP
```typescript
// A galeria é carregada automaticamente em /produtos/<id>
// Sem código adicional necessário
```

### 3. Programaticamente (React)

#### Buscar mídia de um produto:
```typescript
import { useProductMediaQuery } from "@/modules/catalog/hooks/useProductMediaQuery";

function MyComponent() {
  const { data: media = [], isLoading } = useProductMediaQuery(productId);
  
  const primaryImage = media.find(m => m.is_primary && m.kind === 'image');
  // ...
}
```

#### Fazer upload de mídia:
```typescript
import { useProductMediaMutations } from "@/modules/catalog/hooks/useProductMediaMutations";

function MyComponent() {
  const { uploadMedia } = useProductMediaMutations(productId);
  
  const handleUpload = async (files: File[]) => {
    const inputs = files.map((file, index) => ({
      file,
      kind: file.type.startsWith('video/') ? 'video' : 'image',
      sort: index,
      is_primary: index === 0,
    }));
    
    uploadMedia.mutate(inputs);
  };
}
```

## 📦 Dependências Instaladas

- `react-medium-image-zoom@latest` - Zoom nas imagens

## 🎨 Design System

A galeria utiliza tokens do design system:
- `--accent`: Borda da imagem/thumb selecionada
- `--muted`: Background de placeholders
- `--shadow-glow`: Sombra na thumb selecionada

## ♿ Acessibilidade

- ✅ Navegação completa por teclado
- ✅ ARIA labels e roles apropriados
- ✅ Foco visível em todos os elementos interativos
- ✅ Alt text editável para todas as imagens
- ✅ Controles de vídeo nativos

## 🚀 Performance

- ✅ `loading="lazy"` em todas as imagens não-primárias
- ✅ `decoding="async"` para non-blocking
- ✅ Query cache de 60s (TanStack Query)
- ✅ Upload paralelo de múltiplos arquivos
- ✅ Suporte a srcset/sizes (preparado para responsive images)

## 📊 Limites e Validação

- **Máximo por produto:**
  - 8 imagens
  - 1 vídeo
- **Mínimo:** 1 imagem (obrigatório)
- **Validação no frontend e backend**

## 🔐 Segurança

- RLS policies aplicadas (somente admins podem modificar)
- URLs públicas geradas pelo Supabase (assinadas)
- Validação de MIME types no bucket
- Sanitização de inputs

## 📈 Próximas Melhorias (Opcional)

- [ ] Transformações de imagem do Supabase (resize automático)
- [ ] Compressão de imagens no upload
- [ ] Geração automática de poster para vídeos
- [ ] Galeria fullscreen/lightbox
- [ ] Suporte a mais formatos de vídeo
- [ ] Preview antes do upload

## 🐛 Troubleshooting

### Imagens não aparecem
1. Verifique se o bucket `product-images` está público
2. Confirme que as URLs estão corretas no banco
3. Verifique as políticas RLS

### Upload falha
1. Confirme que o usuário está autenticado como admin
2. Verifique os limites de arquivo do Supabase
3. Confirme que o MIME type é aceito

### Vídeos não reproduzem
1. Para YouTube/Vimeo: use URLs completas
2. Para uploads: apenas MP4/WEBM são suportados
3. Verifique o console para erros CORS

## 📞 Suporte

Para problemas ou dúvidas, consulte:
- [Documentação Supabase Storage](https://supabase.com/docs/guides/storage)
- [React Medium Image Zoom](https://github.com/rpearce/react-medium-image-zoom)
- [Guia de Acessibilidade ARIA](https://www.w3.org/WAI/ARIA/apg/)
