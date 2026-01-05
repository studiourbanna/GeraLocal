# 🛍️ GeraLocal: E-commerce Admin Panel

[![GitHub license](https://img.shields.io/github/license/studiourbanna/GeraLocal?style=for-the-badge)](https://github.com/studiourbanna/GeraLocal)
[![GitHub stars](https://img.shields.io/github/stars/studiourbanna/GeraLocal?style=for-the-badge)](https://github.com/studiourbanna/GeraLocal/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/studiourbanna/GeraLocal?style=for-the-badge)](https://github.com/studiourbanna/GeraLocal/network)
[![GitHub issues](https://img.shields.io/github/issues/studiourbanna/GeraLocal?style=for-the-badge)](https://github.com/studiourbanna/GeraLocal/issues)
[![GitHub donate](https://img.shields.io/github/sponsors/clcmo?color=pink&style=for-the-badge)](https://github.com/sponsors/clcmo)

# 🛍️ GeraLocal: E-commerce Admin Panel

[![GitHub license](https://img.shields.io/github/license/studiourbanna/GeraLocal?style=for-the-badge)](https://github.com/studiourbanna/GeraLocal)
[![GitHub stars](https://img.shields.io/github/stars/studiourbanna/GeraLocal?style=for-the-badge)](https://github.com/studiourbanna/GeraLocal/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/studiourbanna/GeraLocal?style=for-the-badge)](https://github.com/studiourbanna/GeraLocal/network)
[![GitHub issues](https://img.shields.io/github/issues/studiourbanna/GeraLocal?style=for-the-badge)](https://github.com/studiourbanna/GeraLocal/issues)
[![GitHub donate](https://img.shields.io/github/sponsors/clcmo?color=pink&style=for-the-badge)](https://github.com/sponsors/clcmo)

Sistema completo de e-commerce com painel administrativo, seguindo arquitetura MVVM modularizada, com suporte a temas, acessibilidade e SEO otimizado.

---

## 📋 Índice

- [Características](#-características)
- [Tecnologias](#️-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação e Execução](#-instalação-e-execução)
- [Configuração](#️-configuração)
- [Deploy](#-deploy)
- [Funcionalidades](#-funcionalidades)
- [SEO e Acessibilidade](#-seo-e-acessibilidade)
- [Licença e Contribuição](#-licença-e-contribuição)

---

## ✨ Características

Sistema robusto de e-commerce com arquitetura MVVM modularizada, oferecendo separação clara entre Model, View e ViewModel. Desenvolvido com TypeScript e React para garantir type safety e componentes reutilizáveis.

**Principais destaques:**

- Temas claro e escuro com persistência local
- Suporte completo a acessibilidade, incluindo modos para daltonismo (Protanopia, Deuteranopia, Tritanopia)
- Autenticação flexível com login tradicional e passwordless
- Painel administrativo completo para gerenciamento de produtos
- Landing page pública otimizada para conversão
- SEO otimizado com meta tags, Open Graph e Twitter Cards
- Design totalmente responsivo para mobile, tablet e desktop

---

## 🛠️ Tecnologias

- **Frontend:** React 18+, TypeScript
- **Estilização:** Tailwind CSS
- **Ícones:** Lucide React
- **Estado:** Context API
- **Persistência:** localStorage / API REST
- **Build:** Vite

---

## 📁 Estrutura do Projeto

```txt
GeraLocal/
├── src/
│   ├── contexts/          # Context API (Theme, Auth, Store)
│   ├── components/        # Componentes React organizados por funcionalidade
│   │   ├── auth/         # Componentes de autenticação
│   │   ├── admin/        # Painel administrativo
│   │   ├── public/       # Landing page pública
│   │   └── shared/       # Componentes compartilhados
│   ├── models/           # Definições de tipos e interfaces
│   ├── viewmodels/       # Lógica de negócio (MVVM)
│   ├── services/         # Serviços de API e storage
│   ├── styles/           # CSS global e temas
│   └── utils/            # Utilitários (SEO, validação, etc)
├── public/               # Arquivos estáticos
├── backend/              # Backend opcional (Node/Express)
└── db.json              # Mock de dados (JSON Server)
```

---

## 🚀 Instalação e Execução

### Pré-requisitos

- Node.js 18 ou superior
- npm ou yarn

### Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/studiourbanna/GeraLocal.git
cd GeraLocal
npm install
```

### Configuração de Ambiente

Crie um arquivo `.env` na raiz:

```env
VITE_APP_NAME=GeraLocal
VITE_API_URL=http://localhost:3000
VITE_STORAGE_KEY=geralocal_store
```

### Executando o Projeto

O projeto oferece duas opções de backend para desenvolvimento:

**Opção 1: JSON Server (Mock rápido)**

```bash
npm run dev:json
```

**Opção 2: Node/Express (Backend real)**

```bash
npm run dev:node
```

Acesse a aplicação em `http://localhost:5173`

**Credenciais de teste:**

- Email: `admin@loja.com`
- Senha: `admin123`

### Scripts Disponíveis

```json
{
  "dev:frontend": "vite",
  "dev:backend:json": "json-server --watch db.json --port 3000",
  "dev:backend:node": "node backend/server.js",
  "dev:json": "concurrently \"npm run dev:frontend\" \"npm run dev:backend:json\"",
  "dev:node": "concurrently \"npm run dev:frontend\" \"npm run dev:backend:node\"",
  "build": "tsc && vite build",
  "preview": "vite preview"
}
```

---

## ⚙️ Configuração

### Conexão com Banco de Dados

Para conectar a um banco de dados real, instale o cliente apropriado:

```bash
npm install axios
# PostgreSQL
npm install pg
# MongoDB
npm install mongodb
```

Configure a conexão em `src/services/api.ts`:

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' }
});

export default api;
```

### Personalização de Temas

Edite `tailwind.config.js` para customizar cores:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: { light: '#3b82f6', dark: '#1e40af' },
        secondary: { light: '#10b981', dark: '#059669' }
      }
    }
  }
}
```

### Filtros de Daltonismo

Ajuste os filtros em `src/contexts/ThemeContext.tsx`:

```typescript
const colorBlindFilters = {
  protanopia: 'grayscale(50%) sepia(50%)',
  deuteranopia: 'hue-rotate(180deg)',
  tritanopia: 'invert(100%) hue-rotate(180deg)'
};
```

---

## 🌐 Deploy

### Vercel (Recomendado)

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Netlify

```bash
npm run build
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

### Docker

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
docker build -t geralocal .
docker run -p 80:80 geralocal
```

### Servidor Apache/Nginx

Após o build (`npm run build`), configure o servidor:

**Apache (.htaccess):**

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

**Nginx:**

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

---

## 🎯 Funcionalidades

### Painel Administrativo

- Login tradicional e passwordless
- CRUD completo de produtos
- Gerenciamento de estoque
- Configurações da loja
- Suporte a temas e modos de acessibilidade

### Landing Page Pública

- Catálogo responsivo de produtos
- Sistema de busca e filtros
- Carrinho de compras
- Páginas de detalhe do produto

### Recursos de Acessibilidade

- Navegação completa por teclado
- Labels ARIA descritivos
- Contraste WCAG AA
- Suporte a leitores de tela
- Três modos de daltonismo

---

## 🔍 SEO e Acessibilidade

### Meta Tags

O projeto inclui meta tags completas para SEO, Open Graph e Twitter Cards. Configure em `public/index.html`:

```html
<!-- SEO Básico -->
<meta name="description" content="Sua loja online com os melhores produtos">
<meta name="keywords" content="ecommerce, loja, produtos">

<!-- Open Graph -->
<meta property="og:title" content="GeraLocal - E-commerce">
<meta property="og:description" content="Os melhores produtos você encontra aqui">
<meta property="og:image" content="https://seusite.com/og-image.jpg">

<!-- Twitter Cards -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="GeraLocal - E-commerce">
```

### Arquivos SEO

- `robots.txt`: Controla indexação de buscadores
- `sitemap.xml`: Mapa do site para crawlers
- Ambos incluídos em `public/`

### Atalhos de Teclado

- `Tab` - Navegação entre elementos
- `Enter` - Ativar botões/links
- `Esc` - Fechar modais
- `Arrow keys` - Navegação em listas

---

## 📊 Analytics (Opcional)

Para adicionar Google Analytics:

```bash
npm install react-ga4
```

Configure em `App.tsx`:

```typescript
import ReactGA from 'react-ga4';

ReactGA.initialize('G-XXXXXXXXXX');
ReactGA.send({ hitType: "pageview", page: window.location.pathname });
```

---

## 🧪 Testes

```bash
npm run test              # Testes unitários
npm run test:e2e          # Testes end-to-end
npm run test:coverage     # Cobertura de testes
```

---

## 📝 Licença e Contribuição

### Licença

Este projeto está sob a licença MIT. Veja [LICENSE](LICENSE) para mais detalhes.

### Como Contribuir

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

## 📞 Suporte

- **Email:** suporte@geralocal.com
- **Issues:** [GitHub Issues](https://github.com/studiourbanna/GeraLocal/issues)
- **Discord:** [Servidor da comunidade](#)

---

## 🎓 Recursos Úteis

- [Documentação React](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref)

---

**Desenvolvido com ❤️ por [Camila L. Oliveira](https://github.com/clcmo) e [StudioUrbanna](https://github.com/studiourbanna)**