# 🛍️ GeraLocal: E-commerce Admin Panel

[![GitHub license](https://img.shields.io/github/license/studiourbanna/GeraLocal?style=for-the-badge)](https://github.com/studiourbanna/GeraLocal)
[![GitHub stars](https://img.shields.io/github/stars/studiourbanna/GeraLocal?style=for-the-badge)](https://github.com/studiourbanna/GeraLocal/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/studiourbanna/GeraLocal?style=for-the-badge)](https://github.com/studiourbanna/GeraLocal/network)
[![GitHub issues](https://img.shields.io/github/issues/studiourbanna/GeraLocal?style=for-the-badge)](https://github.com/studiourbanna/GeraLocal/issues)
[![GitHub donate](https://img.shields.io/github/sponsors/clcmo?color=pink&style=for-the-badge)](https://github.com/sponsors/clcmo)

Sistema completo de e-commerce com painel administrativo, seguindo arquitetura MVVM modularizada, com suporte a temas, acessibilidade e SEO otimizado.

## 📋 Índice

- [Características](#características)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação Local](#instalação-local)
- [Configuração](#configuração)
- [Deploy em Servidor](#deploy-em-servidor)
- [Funcionalidades](#funcionalidades)
- [SEO e Meta Tags](#seo-e-meta-tags)
- [Acessibilidade](#acessibilidade)

## ✨ Características

- **Arquitetura MVVM Modularizada**: Separação clara entre Model, View e ViewModel
- **TypeScript + React**: Type safety e componentes reutilizáveis
- **Temas**: Claro e Escuro com persistência local
- **Acessibilidade**: Suporte a daltonismo (Protanopia, Deuteranopia, Tritanopia)
- **Autenticação**: Login tradicional e login sem senha (passwordless)
- **Painel Admin**: Gerenciamento completo de produtos e configurações
- **Landing Page**: Vitrine pública dos produtos
- **SEO Otimizado**: Meta tags, Open Graph, Twitter Cards
- **Responsivo**: Design adaptável para mobile, tablet e desktop

## 🛠️ Tecnologias

- React 18+
- TypeScript
- Tailwind CSS
- Lucide React (ícones)
- localStorage (persistência)
- Context API (gerenciamento de estado)

## 📁 Estrutura do Projeto

```
GeraLocal/
├── src/
│   ├── contexts/
│   │   ├── ThemeContext.tsx
│   │   ├── AuthContext.tsx
│   │   └── StoreContext.tsx
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   └── PasswordlessLogin.tsx
│   │   ├── admin/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── ProductsTab.tsx
│   │   │   └── SettingsTab.tsx
│   │   ├── public/
│   │   │   ├── LandingPage.tsx
│   │   │   └── ProductCard.tsx
│   │   └── shared/
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── ThemeToggle.tsx
│   ├── models/
│   │   ├── User.ts
│   │   ├── Product.ts
│   │   └── StoreConfig.ts
│   ├── viewmodels/
│   │   ├── AuthViewModel.ts
│   │   ├── ProductViewModel.ts
│   │   └── StoreViewModel.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── storage.ts
│   ├── styles/
│   │   ├── globals.css
│   │   ├── themes.css
│   │   └── accessibility.css
│   ├── utils/
│   │   ├── seo.ts
│   │   └── validators.ts
│   ├── App.tsx
│   └── main.tsx
├── public/
│   ├── index.html
│   ├── robots.txt
│   ├── sitemap.xml
│   └── favicon.ico
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## 🚀 Instalação Local

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn

### Passo a Passo

1. **Clone o repositório**

```bash
git clone https://github.com/seu-usuario/ecommerce-admin.git
cd ecommerce-admin
```

1. **Instale as dependências**

```bash
npm install
# ou
yarn install
```

2. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_APP_NAME=Minha Loja
VITE_API_URL=http://localhost:3000/api
VITE_STORAGE_KEY=ecommerce_store
```

3. **Inicie o servidor de desenvolvimento**

```bash
npm run dev
# ou
yarn dev
```

4. **Acesse no navegador**

Abra `http://localhost:5173`

### Credenciais de Teste

- **Email**: `admin@loja.com`
- **Senha**: `admin123`

## ⚙️ Configuração

### Configuração do Banco de Dados

O projeto utiliza localStorage por padrão. Para conectar a um banco de dados real:

1. **Instale o cliente do banco**

```bash
npm install axios
# Para PostgreSQL
npm install pg
# Para MongoDB
npm install mongodb
```

2. **Configure a conexão**

Edite `src/services/api.ts`:

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
```

3. **Atualize os ViewModels**

Substitua chamadas ao localStorage por chamadas à API:

```typescript
// Antes
const products = JSON.parse(localStorage.getItem('products') || '[]');

// Depois
const { data: products } = await api.get('/products');
```

### Personalização de Temas

Edite `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#3b82f6',
          dark: '#1e40af'
        },
        secondary: {
          light: '#10b981',
          dark: '#059669'
        }
      }
    }
  }
}
```

### Configuração de Acessibilidade

Em `src/contexts/ThemeContext.tsx`, ajuste os modos de daltonismo:

```typescript
const colorBlindFilters = {
  protanopia: 'grayscale(50%) sepia(50%)',
  deuteranopia: 'hue-rotate(180deg)',
  tritanopia: 'invert(100%) hue-rotate(180deg)'
};
```

## 🌐 Deploy em Servidor

### Opção 1: Vercel (Recomendado)

1. **Instale o Vercel CLI**

```bash
npm install -g vercel
```

2. **Faça login**

```bash
vercel login
```

3. **Deploy**

```bash
vercel --prod
```

### Opção 2: Netlify

1. **Build do projeto**

```bash
npm run build
```

2. **Deploy via Netlify CLI**

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

### Opção 3: Servidor Apache/Nginx

1. **Build do projeto**

```bash
npm run build
```

2. **Copie a pasta `dist` para o servidor**

```bash
scp -r dist/* usuario@servidor:/var/www/html/
```

3. **Configure o Apache** (`.htaccess`)

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

4. **Configure o Nginx**

```nginx
server {
    listen 80;
    server_name seudominio.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Opção 4: Docker

1. **Crie o `Dockerfile`**

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. **Build e run**

```bash
docker build -t ecommerce-admin .
docker run -p 80:80 ecommerce-admin
```

## 🎯 Funcionalidades

### Painel Administrativo

- ✅ Login com senha
- ✅ Login sem senha (passwordless)
- ✅ Gerenciamento de produtos (CRUD)
- ✅ Configurações da loja
- ✅ Controle de estoque
- ✅ Temas claro/escuro
- ✅ Modos de daltonismo

### Landing Page Pública

- ✅ Catálogo de produtos
- ✅ Filtros e busca
- ✅ Carrinho de compras
- ✅ Detalhes do produto
- ✅ Responsivo

### Acessibilidade

- ✅ Navegação por teclado
- ✅ ARIA labels
- ✅ Contraste adequado (WCAG AA)
- ✅ Suporte a leitores de tela
- ✅ Modos de daltonismo

## 🔍 SEO e Meta Tags

### Meta Tags Básicas

No `index.html`:

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Sua loja online com os melhores produtos">
<meta name="keywords" content="ecommerce, loja, produtos">
<meta name="author" content="Seu Nome">
```

### Open Graph (Facebook)

```html
<meta property="og:title" content="Minha Loja - E-commerce">
<meta property="og:description" content="Os melhores produtos você encontra aqui">
<meta property="og:image" content="https://seusite.com/og-image.jpg">
<meta property="og:url" content="https://seusite.com">
<meta property="og:type" content="website">
```

### Twitter Cards

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Minha Loja - E-commerce">
<meta name="twitter:description" content="Os melhores produtos você encontra aqui">
<meta name="twitter:image" content="https://seusite.com/twitter-image.jpg">
```

### Sitemap.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://seusite.com/</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://seusite.com/products</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

### Robots.txt

```txt
User-agent: *
Allow: /
Disallow: /admin/

Sitemap: https://seusite.com/sitemap.xml
```

## ♿ Acessibilidade

### Teclado

- `Tab`: Navegação entre elementos
- `Enter`: Ativar botões/links
- `Esc`: Fechar modais
- `Arrow keys`: Navegação em listas

### Leitores de Tela

Todos os elementos interativos possuem labels descritivos:

```tsx
<button aria-label="Adicionar produto ao carrinho">
  Adicionar
</button>
```

### Contraste

Todos os textos seguem WCAG AA:

- Texto normal: 4.5:1
- Texto grande: 3:1

## 📊 Tagueamento (Google Analytics)

1. **Instale o Google Analytics**

```bash
npm install react-ga4
```

1. **Configure no `App.tsx`**

```typescript
import ReactGA from 'react-ga4';

ReactGA.initialize('G-XXXXXXXXXX');

// Rastreie pageviews
ReactGA.send({ hitType: "pageview", page: window.location.pathname });

// Rastreie eventos
const trackEvent = (category: string, action: string) => {
  ReactGA.event({
    category,
    action,
    label: 'user_action'
  });
};
```

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📝 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

## 👥 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📞 Suporte

- Email: suporte@minhaloja.com
- Discord: [Link do servidor]
- Issues: [GitHub Issues](https://github.com/seu-usuario/ecommerce-admin/issues)

## 🎓 Recursos Adicionais

- [Documentação React](https://react.dev)
- [Documentação TypeScript](https://www.typescriptlang.org/docs)
- [Documentação Tailwind CSS](https://tailwindcss.com/docs)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref)

---

Desenvolvido com ❤️ por Camila L. Oliveira e [StdUrb](https://github.com/studiourbanna)