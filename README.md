# Sistema de Transporte Escolar

Sistema web completo para gerenciamento de transporte escolar, desenvolvido com Next.js, TypeScript e Mantine UI.

## 🚀 Tecnologias

- **Frontend**: Next.js 14, TypeScript, React
- **UI**: Mantine UI Components
- **Estado**: TanStack Query (React Query)
- **Estilização**: CSS Modules, Tailwind CSS
- **API**: RESTful API integration

## 📋 Funcionalidades

### Administração

- Dashboard com estatísticas gerais
- Gerenciamento de alunos
- Gerenciamento de motoristas
- Controle de ônibus e veículos
- Gerenciamento de rotas
- Sistema de pagamentos
- Controle de instituições
- Pontos de embarque
- Notificações

### Área do Aluno

- Visualização de rotas
- Histórico de pagamentos
- Perfil pessoal
- Notificações

### Área do Motorista

- Dashboard personalizado
- Controle de presenças
- Histórico de viagens

## 🛠️ Instalação

1. Clone o repositório:

```bash
git clone [url-do-repositorio]
cd sistema-transporte-escolar
```

2. Instale as dependências:

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. Configure as variáveis de ambiente:

```bash
cp .env.local.example .env.local
```

4. Execute o projeto:

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

5. Acesse http://localhost:3000

## 🏗️ Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js 13+)
│   ├── admin/             # Páginas administrativas
│   ├── aluno/             # Área do aluno
│   ├── motorista/         # Área do motorista
│   └── login/             # Autenticação
├── components/            # Componentes reutilizáveis
├── contexts/              # Contextos React
├── hooks/                 # Custom hooks
├── providers/             # Providers (Query, Theme, etc.)
└── services/              # Serviços de API
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Build para produção
- `npm run start` - Executa build de produção
- `npm run lint` - Executa linting
- `npm run type-check` - Verificação de tipos TypeScript

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:

- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🎨 Design System

Utiliza Mantine UI como base com customizações:

- Tema personalizado
- Componentes consistentes
- Paleta de cores padronizada
- Tipografia responsiva


## 📊 API Integration

Integração com API RESTful para:

- CRUD completo de todas as entidades
- Filtros e paginação
- Upload de arquivos
- Relatórios e estatísticas

## 🧪 Testes

Para executar os testes:

```bash
npm run test
```

## 📦 Build e Deploy

Para build de produção:

```bash
npm run build
npm run start
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Equipe

Desenvolvido como projeto acadêmico para gerenciamento de transporte escolar na matéria de Programação Orientada a Objetos.
