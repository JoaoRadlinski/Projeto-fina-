# Documentação Técnica — InstaClone Frontend

Clone do Instagram construído com **Vue 3 + Pinia + Vue Router**, servido por Nginx via Docker e consumindo uma API REST Laravel no backend.

---

## Sumário

1. [Visão Geral da Stack](#1-visão-geral-da-stack)
2. [Estrutura de Pastas](#2-estrutura-de-pastas)
3. [Configuração e Build](#3-configuração-e-build)
4. [Docker e Deploy](#4-docker-e-deploy)
5. [Entry Point — main.ts e App.vue](#5-entry-point--maints-e-appvue)
6. [Roteamento — router/index.js](#6-roteamento--routerindexjs)
7. [HTTP Client — services/api.js](#7-http-client--servicesapijs)
8. [State Management — Pinia Stores](#8-state-management--pinia-stores)
9. [Composables](#9-composables)
10. [Layouts](#10-layouts)
11. [Views (Páginas)](#11-views-páginas)
12. [Componentes](#12-componentes)
13. [Estilos e Tema](#13-estilos-e-tema)
14. [Fluxos Principais](#14-fluxos-principais)
15. [Tratamento de Erros](#15-tratamento-de-erros)
16. [Responsividade](#16-responsividade)
17. [Referência Rápida](#17-referência-rápida)

---

## 1. Visão Geral da Stack

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Framework UI | Vue 3 (Composition API + `<script setup>`) | 3.5.32 |
| Build tool | Vite | 6.x |
| Tipagem | TypeScript | 6.0 |
| State management | Pinia | 2.x |
| Roteamento | Vue Router | 4.x |
| HTTP | Axios | 1.x |
| CSS base | Bootstrap | 5.3.8 |
| Servidor estático | Nginx | 1.27-alpine |
| Containerização | Docker + Compose | — |

A comunicação com o backend se dá exclusivamente via Axios para uma API REST. Toda autenticação usa **JWT** armazenado no `localStorage`.

---

## 2. Estrutura de Pastas

```
ProjetoFinal/
├── docker/
│   └── nginx.conf              # Configuração do servidor Nginx
├── src/
│   ├── assets/
│   │   └── styles/
│   │       └── theme.css       # Variáveis CSS globais e reset
│   ├── components/
│   │   ├── discover/
│   │   │   └── UserCard.vue    # Card de usuário na tela de descobrir
│   │   ├── feed/
│   │   │   ├── CommentInput.vue  # Input reutilizável de comentário
│   │   │   └── PostCard.vue      # Card de post no feed
│   │   ├── profile/
│   │   │   ├── ConnectionList.vue  # Lista de seguidores/seguindo
│   │   │   ├── PostGrid.vue        # Grade de posts do perfil
│   │   │   └── ProfileHeader.vue   # Cabeçalho do perfil
│   │   └── shared/
│   │       ├── AppAvatar.vue   # Avatar com fallback de iniciais
│   │       └── FollowButton.vue  # Botão seguir/deixar de seguir
│   ├── composable/
│   │   ├── useImagePreview.js  # Preview local de imagem + cleanup
│   │   └── useRelativeTime.js  # Timestamps relativos em pt-BR
│   ├── layouts/
│   │   ├── AppLayout.vue       # Layout autenticado (sidebar + bottom nav)
│   │   └── AuthLayout.vue      # Layout de login/cadastro
│   ├── router/
│   │   └── index.js            # Definição de rotas e guards globais
│   ├── services/
│   │   └── api.js              # Instância Axios + interceptores
│   ├── stores/
│   │   ├── auth.js             # Store de autenticação e usuário
│   │   └── feed.js             # Store de posts e feed
│   ├── views/
│   │   ├── auth/
│   │   │   ├── LoginView.vue
│   │   │   └── RegisterView.vue
│   │   ├── ConnectionListView.vue
│   │   ├── CreatePostView.vue
│   │   ├── DiscoverView.vue
│   │   ├── EditProfileView.vue
│   │   ├── FeedView.vue
│   │   ├── NotFoundView.vue
│   │   ├── NotificationsView.vue
│   │   ├── PostDetailView.vue
│   │   └── ProfileView.vue
│   ├── App.vue                 # Componente raiz (só <RouterView />)
│   └── main.ts                 # Entry point da aplicação
├── .env                        # Variáveis de ambiente locais
├── .env.example                # Template de variáveis
├── compose.yaml                # Definição do serviço Docker
├── Dockerfile                  # Build multi-estágio
├── package.json
└── vite.config.ts
```

---

## 3. Configuração e Build

### vite.config.ts

```
Plugins:    vue() + vueDevTools()
Porta dev:  5173 (strictPort — não tenta porta alternativa)
Alias:      @ → ./src  (ex: @/stores/auth → src/stores/auth)
```

Sem proxy configurado: todas as chamadas à API vão diretamente para `VITE_API_URL`, resolvido pelo browser na máquina do usuário.

### .env

```
VITE_API_URL=http://localhost:8000/api
```

O Vite **substitui** `import.meta.env.VITE_API_URL` em tempo de build. Para produção, esse valor deve ser passado como build argument no Docker (ver seção 4).

### Scripts disponíveis

| Comando | O que faz |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento em localhost:5173 |
| `npm run build` | Type-check + build de produção (paralelo) |
| `npm run build-only` | Só build, sem type-check |
| `npm run type-check` | Valida tipos com vue-tsc |
| `npm run preview` | Serve o build local para inspeção |

---

## 4. Docker e Deploy

### Dockerfile — Build em dois estágios

**Estágio 1: build** (`node:22-alpine`)

1. Copia `package.json` e `package-lock.json`, executa `npm ci` — camada cacheada enquanto os arquivos não mudarem.
2. Copia o restante do código.
3. Executa `npm run build-only` gerando `/app/dist`.
4. Recebe `VITE_API_URL` via `ARG`/`ENV`, embutido no bundle pelo Vite.

**Estágio 2: runtime** (`nginx:1.27-alpine`)

1. Copia `docker/nginx.conf` → `/etc/nginx/conf.d/default.conf`.
2. Copia `/app/dist` → `/usr/share/nginx/html`.
3. Expõe porta 80.

### compose.yaml

```yaml
services:
  frontend:
    build:
      args:
        VITE_API_URL: ${VITE_API_URL:-http://localhost:8000/api}
    ports:
      - "3000:80"   # host:container
    restart: unless-stopped
```

Para trocar a URL da API sem rebuildar a imagem inteiramente, passe a variável antes do comando:

```bash
VITE_API_URL=https://api.meuservidor.com/api docker compose up --build
```

### docker/nginx.conf — O que cada bloco faz

```nginx
# Suporte ao Vue Router history mode
location / {
    try_files $uri $uri/ /index.html;
}
```
Rotas como `/feed` ou `/perfil` não existem como arquivos no disco. Sem essa linha o Nginx retornaria 404. Com ela, qualquer rota que não seja um arquivo existente cai no `index.html`, e o Vue Router cuida da navegação.

```nginx
# Cache longo para assets com hash
location ~* \.(?:css|js|woff2?|...)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```
O Vite gera nomes como `index-Bp7-PSNw.js` — o hash muda sempre que o conteúdo muda. Logo é seguro cachear por 1 ano.

```nginx
# Sem cache para index.html
location = /index.html {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```
O `index.html` aponta para os assets com hash correto. Se ficar cacheado, o usuário pode carregar arquivos JS de uma versão antiga.

---

## 5. Entry Point — main.ts e App.vue

### main.ts

```
1. Importa Bootstrap CSS (grid, utilities)
2. Importa theme.css (variáveis e reset)
3. createApp(App) → cria instância Vue
4. app.use(createPinia()) → Pinia DEVE vir antes do router
                            (guards usam stores)
5. app.use(router)
6. app.mount('#app') → injeta no <div id="app"> do index.html
```

A ordem de `use()` importa: o Pinia precisa estar registrado antes do router porque os guards globais chamam `useAuthStore()`.

### App.vue

```vue
<template>
  <RouterView />
</template>
```

Componente raiz intencional e mínimo. Toda lógica de layout fica nos layouts (`AppLayout`, `AuthLayout`) injetados pelo router.

---

## 6. Roteamento — router/index.js

### Mapa de rotas

```
/  →  redirect /feed

/  (AuthLayout, requiresGuest)
├── login     → LoginView
└── cadastro  → RegisterView

/  (AppLayout, requiresAuth)
├── feed                    → FeedView
├── descobrir               → DiscoverView
├── criar                   → CreatePostView
├── perfil                  → ProfileView
├── perfil/editar           → EditProfileView
├── perfil/lista/:type      → ConnectionListView
└── posts/:postId           → PostDetailView

/:pathMatch(.*)* → NotFoundView
```

Todas as views são carregadas com **lazy loading** (`() => import(...)`) — o bundle inicial é menor e cada view só é baixada quando acessada.

### Guards globais (`router.beforeEach`)

O guard executa antes de cada navegação e segue esta lógica:

```
1. Verifica token em localStorage

2. Se rota tem requiresAuth E não tem token:
   → redireciona para /login

3. Se rota tem requiresGuest E tem token:
   → redireciona para /feed

4. Se tem token E user ainda não foi hidratado na store:
   → chama auth.fetchMe() para recuperar dados após refresh de página
   → se der erro (token expirado/inválido): redireciona para /login
```

O passo 4 é crucial: ao recarregar a página, o estado Pinia é zerado (é memória volátil), mas o token continua no `localStorage`. O guard re-hidrata o usuário antes de renderizar qualquer tela autenticada.

---

## 7. HTTP Client — services/api.js

### Configuração base

```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,  // embutido no build
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})
```

### Request Interceptor

Antes de cada requisição, lê o token do `localStorage` e injeta no header:

```
Authorization: Bearer <token>
```

Se não houver token, o header não é adicionado (requisições públicas).

### Response Interceptor

Quando o servidor responde com **401 Unauthorized**:

1. Remove o token do `localStorage` (sessão inválida).
2. Importa o router **dinamicamente** para evitar dependência circular.
3. Se a rota atual não for `/login`, navega para lá.

A importação dinâmica (`import('@/router')`) é necessária porque `api.js` é importado pelo router — se importasse o router diretamente no topo do arquivo, criaria um ciclo de dependências que quebraria o bundle.

### Exportações

```javascript
export { TOKEN_KEY }   // 'instaclone.token' — chave no localStorage
export default api     // instância Axios para usar nos stores/views
```

---

## 8. State Management — Pinia Stores

### stores/auth.js

Gerencia toda a sessão do usuário autenticado.

**Estado reativo**

```javascript
user  = ref(null)       // objeto do usuário (null se não autenticado)
token = ref(localStorage.getItem(TOKEN_KEY) ?? null)
```

O token é inicializado direto do `localStorage` — se o usuário recarregar a página, o token persiste e o guard do router chama `fetchMe()` para popular `user`.

**Computed**

```javascript
isAuthenticated = computed(() => !!token.value)
```

**Ações**

| Ação | Endpoint | O que faz |
|------|----------|-----------|
| `login(credentials)` | POST /auth/login | Autentica e chama `setSession` |
| `register(payload)` | POST /auth/register | Cadastra e chama `setSession` |
| `logout()` | POST /auth/logout | Sempre chama `clearSession` (ignora erro) |
| `fetchMe()` | GET /auth/me | Atualiza `user` (usado após refresh) |

`setSession(token, user)` → salva no estado + `localStorage`
`clearSession()` → zera estado + remove do `localStorage`

---

### stores/feed.js

Gerencia os posts do feed com paginação por cursor.

**Por que dicionário em vez de array?**

```javascript
posts      = ref({})   // { [id]: post } — acesso O(1) por ID
orderedIds = ref([])   // mantém a ordem de chegada
```

Com array, para atualizar um post (like, comentário) seria necessário percorrer tudo. Com dicionário, `posts.value[id].is_liked = true` é instantâneo.

**Paginação por cursor**

```javascript
nextCursor = ref(null)
```

Em vez de página numérica (que pode pular ou duplicar posts em feeds dinâmicos), o backend retorna um cursor opaco para a próxima página.

**Getter**

```javascript
orderedPosts = computed(() => orderedIds.value.map(id => posts.value[id]))
hasMore      = computed(() => !!nextCursor.value)
```

**Ações**

| Ação | Endpoint | Detalhe |
|------|----------|---------|
| `fetchFeed()` | GET /feed | Reseta estado, carrega primeira página |
| `loadMoreFeed()` | GET /feed?cursor=... | Append sem duplicar (verifica ids existentes) |
| `toggleLike(postId)` | POST/DELETE /posts/{id}/like | **Otimista**: toggle imediato, reverte em erro |
| `addComment(postId, body)` | POST /posts/{id}/comments | Incrementa `comments_count` na store |
| `createPost(formData)` | POST /posts | multipart/form-data (imagem + caption) |

**Like otimista**

```
1. Inverte is_liked e ajusta likes_count localmente (imediato)
2. Faz a requisição à API
3. Se erro: desfaz a inversão (reverte)
```

O usuário vê a resposta instantânea e só percebe algo errado se a rede falhar.

---

## 9. Composables

### useRelativeTime.js

Converte um timestamp ISO em texto relativo em português:

```
agora         → diferença < 60 segundos
há 5m         → minutos
há 2h         → horas
há 3d         → dias
há 2se        → semanas
há 1me        → meses
há 1a         → anos
```

Datas futuras retornam `"agora"`. Aceita string ISO ou objeto `Date`.

---

### useImagePreview.js

Gerencia o ciclo de vida de um preview local de imagem.

**O problema que resolve**

`URL.createObjectURL()` cria uma URL temporária para um arquivo local. Essa URL consome memória e **deve ser revogada** quando não mais necessária. Sem isso, cada troca de imagem vazaria memória.

**Interface**

```javascript
const { file, previewUrl, setFile, clear } = useImagePreview()
```

| Item | Tipo | Descrição |
|------|------|-----------|
| `file` | `Ref<File\|null>` | O arquivo selecionado |
| `previewUrl` | `Ref<string\|null>` | URL de blob para usar em `<img :src>` |
| `setFile(newFile)` | função | Revoga URL anterior, cria nova |
| `clear()` | função | Remove arquivo e revoga URL |

A revogação também ocorre automaticamente em `onUnmounted` — se o componente for desmontado antes do usuário limpar, não há vazamento.

---

## 10. Layouts

### AuthLayout.vue

Layout simples para as telas de login e cadastro: envolve o conteúdo em um container de altura total e renderiza `<RouterView />`. Sem navbar, sem sidebar.

---

### AppLayout.vue

Layout principal de todas as telas autenticadas.

**Estrutura**

```
Desktop (≥768px):
┌─────────────┬──────────────────────────┐
│  Sidebar    │                          │
│  (244px)    │    <RouterView />        │
│  fixed      │    conteúdo da página    │
│  esquerda   │                          │
└─────────────┴──────────────────────────┘

Mobile (<768px):
┌──────────────────────────┐
│    <RouterView />        │
│    conteúdo da página    │
│                          │
├──────────────────────────┤
│  Bottom Nav (fixed)      │
└──────────────────────────┘
```

**Sidebar (desktop)**

Itens de navegação com ícones SVG inline:
- Home → `/feed`
- Descobrir → `/descobrir`
- Criar → `/criar`
- Notificações → `/notificacoes` (badge com contagem não lida)
- Perfil → `/perfil`
- Botão Logout (fundo da sidebar)

**Bottom Nav (mobile)**

Mesmos itens reduzidos a ícones (sem texto), fixos na parte inferior.

**Polling de notificações**

`onMounted` inicia um `setInterval` de 30 segundos que chama `GET /notifications/unread-count`. O contador é exibido como badge na nav. O interval é limpo em `onUnmounted` para evitar chamadas após sair da sessão.

**Logout**

```
auth.logout() → POST /auth/logout (ignora falha)
             → clearSession()
             → router.push('/login')
```

---

## 11. Views (Páginas)

### LoginView.vue

Layout split-screen:
- **Painel esquerdo** (desktop): mockup animado de um celular mostrando stories e posts — puramente decorativo, feito com CSS e gradientes animados.
- **Painel direito**: formulário de login.

**Formulário**
- Campo: email ou username
- Campo: senha com toggle mostrar/ocultar
- Botão submit com estado de loading
- Exibição de erro vindo do backend
- Link para cadastro

**Fluxo de submit**
```
handleLogin() → auth.login({ email, password })
             → sucesso: router.push('/feed')
             → erro: exibe error.response.data.message
```

---

### RegisterView.vue

Mesma estrutura split-screen do Login, com painel esquerdo diferente (mini galeria 3×3 com gradientes animados).

**Campos do formulário**
- Nome completo
- Username (prefixo `@` visual, sem o `@` no valor)
- Email
- Senha
- Confirmação de senha com toggle

**Fluxo de submit**
```
handleRegister() → auth.register({ name, username, email, password, password_confirmation })
                → sucesso: router.push('/feed')
                → erro: exibe mensagem
```

---

### FeedView.vue

Exibe o feed de posts com paginação.

**Estados possíveis**

| Situação | O que aparece |
|----------|---------------|
| Carregando | Spinner centralizado |
| Feed vazio | Mensagem + botões "Descobrir pessoas" e "Criar post" |
| Com posts | Lista de `PostCard` |
| Tem mais posts | Botão "Carregar mais" |

`onMounted` chama `feedStore.fetchFeed()`. O botão "Carregar mais" chama `feedStore.loadMoreFeed()` e fica desabilitado durante o loading.

---

### CreatePostView.vue

Tela de criação de post.

**Upload de imagem**

Área clicável (dropzone) que abre o seletor de arquivos. Valida no cliente:
- Tipos aceitos: `image/jpeg`, `image/png`, `image/webp`
- Tamanho máximo: 5 MB

Após seleção, exibe preview local via `useImagePreview`. Um botão `×` no canto do preview remove a imagem.

**Caption**

Textarea com limite de 2200 caracteres. Contador inline muda para vermelho ao passar de 2000.

**Submit**

O botão fica desabilitado se não houver imagem ou caption vazia. O submit monta um `FormData` com os campos `image` e `caption` e chama `feedStore.createPost()`. Em caso de sucesso, navega para `/feed`.

---

### PostDetailView.vue

Exibe um post completo com todos os comentários.

**Dados carregados**
- `GET /posts/{postId}` — dados do post
- `GET /posts/{postId}/comments?page=1` — comentários paginados

**Funcionalidades**
- Like com toggle otimista (mesmo comportamento do feed)
- Delete do post (só para o dono): exibe `confirm()` → `DELETE /posts/{id}` → `/feed`
- Delete de comentário (só para o dono): exibe `confirm()` → `DELETE /posts/{id}/comments/{commentId}`
- Adicionar comentário via `CommentInput` → append local + incrementa contador

---

### DiscoverView.vue

Grade de `UserCard` com sugestões de usuários para seguir.

**Dados**: `GET /users/suggestions?page=...`

Mantém um `Set` local (`followingSet`) com os IDs que o usuário segue. Quando `FollowButton` emite `follow-toggled`, o Set é atualizado para sincronizar todos os botões na mesma página.

Paginação numérica com botões Anterior/Próxima e indicador "X / Y".

---

### ProfileView.vue

Exibe o perfil de qualquer usuário.

**Resolução de quem ver**
- Se há `?user=username` na query string: perfil do usuário indicado.
- Se não há: perfil do usuário logado (via `auth.user.username`).

**Dados carregados em paralelo** (Promise.all)
- `GET /users/{username}` — dados do perfil
- `GET /users/{username}/posts` — posts do perfil
- `GET /users/{username}/followers/count`
- `GET /users/{username}/following/count`
- `GET /users/{username}/is-following` (só para perfis de terceiros)

**Componentes filhos**
- `ProfileHeader` — avatar, nome, stats, botão ação
- `PostGrid` — grade 3 colunas com overlays de likes/comentários

Um `watch` em `route.query.user` recarrega o perfil se o usuário navegar entre perfis diferentes sem sair da rota.

---

### EditProfileView.vue

Formulário de edição do próprio perfil.

**Campos**
- Avatar: clique na imagem atual abre seletor de arquivo, preview local com `useImagePreview`
- Nome (máx 255)
- Username (máx 30, só letras, números, `.` e `_`)
- Bio (máx 500, textarea)

**Validação de username** (cliente)
```javascript
/^[A-Za-z0-9._]+$/
```

**Submit** (duas requisições separadas)
```
1. Se arquivo de avatar selecionado:
   POST /users/me/avatar  (multipart/form-data)

2. Sempre:
   PUT /users/me  { name, username, bio }

3. auth.fetchMe() para sincronizar a store com os novos dados
4. Exibe mensagem de sucesso
```

Erros de validação do Laravel (`{ errors: { campo: ["mensagem"] } }`) são exibidos por campo.

---

### ConnectionListView.vue

Lista seguidores ou seguindo de um usuário.

**Resolução da rota**
- Parâmetro `:type` → `seguidores` ou `seguindo`
- Query `?user=username` → lista de terceiro; sem ela → lista do próprio usuário

**Endpoints**
- Seguidores: `GET /users/{id}/followers?page=...`
- Seguindo: `GET /users/{id}/following?page=...`

Antes de buscar a lista, resolve o username para ID via `GET /users/{username}`. Também carrega os IDs seguidos pelo usuário logado para inicializar o `FollowButton` corretamente.

---

### NotificationsView.vue

Central de notificações com paginação.

**Endpoint**: `GET /notifications?page=...`

**Tipos detectados pelo `type` da notificação**

| Tipo | Mensagem exibida |
|------|-----------------|
| `like` | "username curtiu seu post" |
| `comment` | "username comentou no seu post" |
| `follow` | "username começou a seguir você" |

Notificações não lidas têm fundo levemente colorido. Clicar numa notificação navega para o post ou perfil relacionado.

Botão "Marcar tudo como lido" → `PUT /notifications/read` → atualiza `read_at` localmente sem rebuscar.

---

### NotFoundView.vue

Página 404 exibida para qualquer rota não reconhecida.

Botão de retorno condicional:
- Autenticado → "Voltar ao feed" → `/feed`
- Visitante → "Ir para login" → `/login`

---

## 12. Componentes

### AppAvatar.vue

Avatar circular reutilizável em todo o app.

**Props**

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `src` | String | — | URL da imagem |
| `name` | String | — | Nome para gerar iniciais no fallback |
| `size` | String | `'md'` | `'sm'` (32px) / `'md'` (40px) / `'lg'` (56px) / `'xl'` (86px) |
| `showGradient` | Boolean | `false` | Adiciona borda gradiente estilo Instagram |

**Fallback**: sem `src`, exibe as iniciais das duas primeiras palavras do nome em maiúsculo sobre fundo gradiente. Se sem nome também, exibe `?`.

---

### FollowButton.vue

Botão de seguir/deixar de seguir com feedback otimista.

**Props**: `userId` (obrigatório), `isFollowing` (Boolean)

**Emits**: `toggled(isNowFollowing)` — para o pai atualizar seu estado

**Fluxo**

```
1. Toggle visual imediato (estado local)
2. POST /users/{id}/follow  OU  DELETE /users/{id}/unfollow
3. Se erro: reverte o toggle
```

**Aparência**

- "Seguir": gradiente azul-arroxeado
- "Seguindo": branco com borda, hover muda para hint de "Deixar de seguir"
- Loading: spinner substitui texto, botão desabilitado

---

### PostCard.vue

Card de post exibido no feed.

**Props**: objeto `post` com os campos:
```
id, user { id, name, username, avatar_url },
image_url, caption, likes_count, is_liked,
comments_count, created_at
```

**Estrutura visual**

```
┌─────────────────────────────────┐
│ [Avatar] username  • 2h         │
├─────────────────────────────────┤
│         imagem do post          │
├─────────────────────────────────┤
│ ♥ [like]   💬 [link ao post]   │
│ 42 curtidas                     │
│ username caption do post...     │
│ Ver 5 comentários               │
│ [CommentInput]                  │
└─────────────────────────────────┘
```

O like usa `feedStore.toggleLike()` (otimista). O link de comentários navega para `/posts/{id}`. O `CommentInput` inline chama `feedStore.addComment()`.

---

### CommentInput.vue

Input reutilizável para comentários, usado no `PostCard` e no `PostDetailView`.

**Props**: `placeholder` (String, opcional)

**Emits**: `submitted(text)` — o pai decide o que fazer com o texto

O componente só gerencia o estado local do input e emite o texto ao submeter. Limpa o campo após o emit. O botão "Publicar" fica desabilitado se o campo estiver vazio ou durante loading.

---

### UserCard.vue

Card de usuário na tela de Descobrir.

**Props**: `user` (Object), `isFollowing` (Boolean)

**Emits**: `follow-toggled(userId, isNowFollowing)`

Clicar no card navega para o perfil do usuário. O `FollowButton` é ocultado se o card representa o próprio usuário logado.

---

### ProfileHeader.vue

Cabeçalho completo do perfil.

**Props**

| Prop | Tipo | Descrição |
|------|------|-----------|
| `user` | Object | Dados do usuário |
| `postsCount` | Number | Total de posts |
| `followersCount` | Number | Total de seguidores |
| `followingCount` | Number | Total de seguindo |
| `isOwn` | Boolean | Se é o próprio perfil |
| `isFollowing` | Boolean | Se o usuário logado segue este perfil |

**Emits**: `follow-toggled(isNowFollowing)`

Os links de "Seguidores" e "Seguindo" navegam para `ConnectionListView` com o parâmetro `?user=username` quando exibindo perfil de terceiros.

---

### PostGrid.vue

Grade 3×N de posts de um perfil.

**Props**: `posts` (Array), `loading` (Boolean)

Cada célula é quadrada (`aspect-ratio: 1`). Ao passar o mouse, um overlay escuro aparece com os ícones e contagens de likes e comentários, e a imagem faz um leve zoom (`scale(1.04)`).

---

### ConnectionList.vue

Lista de usuários com nome, username, avatar e `FollowButton`.

**Props**: `users` (Array), `followingIds` (Set), `loading` (Boolean)

**Emits**: `follow-toggled(userId, isNowFollowing)` — para o pai atualizar o Set

O botão follow é ocultado para o próprio usuário logado (`isSelf(user)` compara com `auth.user.id`).

---

## 13. Estilos e Tema

### theme.css — Variáveis CSS globais

O arquivo define variáveis no seletor `:root` que ficam disponíveis em todos os componentes:

**Cores**

| Variável | Valor | Uso |
|----------|-------|-----|
| `--color-bg` | `#fafafa` | Fundo da página |
| `--color-surface` | `#ffffff` | Fundo de cards |
| `--color-surface-alt` | `#f0f0f0` | Fundo alternativo |
| `--color-border` | `#dbdbdb` | Bordas |
| `--color-text` | `#262626` | Texto principal |
| `--color-text-muted` | `#8e8e8e` | Texto secundário |
| `--color-link` | `#00376b` | Links |
| `--color-accent` | `#e1306c` | Rosa Instagram |
| `--color-accent-start` | `#f09433` | Gradiente laranja |
| `--color-accent-end` | `#dc2743` | Gradiente vermelho |
| `--color-error` | `#ed4956` | Mensagens de erro |
| `--color-success` | `#2ecc71` | Mensagens de sucesso |

**Tipografia**

```
--font-body: system-ui stack (sans-serif nativa do SO)
--font-size-xs:   11px
--font-size-sm:   12px
--font-size-base: 14px  ← tamanho padrão do html
--font-size-md:   16px
--font-size-lg:   20px
--font-size-xl:   24px
```

**Espaçamentos**

```
--space-1: 4px   --space-2: 8px   --space-3: 12px
--space-4: 16px  --space-5: 20px  --space-6: 24px
```

**Layout**

```
--navbar-height-mobile:  49px   ← altura da bottom nav
--sidebar-width-desktop: 244px  ← largura da sidebar
```

**Bordas e sombras**

```
--radius-sm: 4px  --radius-md: 8px  --radius-lg: 12px  --radius-full: 9999px
--shadow-sm: 0 1px 3px rgba(0,0,0,0.08)
--shadow-md: 0 4px 12px rgba(0,0,0,0.12)
--transition-fast: 0.15s ease
--transition-base: 0.25s ease
```

**Reset global** (aplicado logo abaixo das variáveis)

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #app       { height: 100%; width: 100%; }
```

### Bootstrap 5

Importado em `main.ts` antes de `theme.css`. Provê grid system (`.container`, `.row`, `.col-*`), utilities (`.d-flex`, `.gap-*`, `.text-*`) e componentes base. O `theme.css` sobrescreve variáveis onde necessário.

---

## 14. Fluxos Principais

### Autenticação completa

```
Primeira visita:
  /  →  redirect /feed  →  guard: sem token  →  /login

Login:
  form submit  →  auth.login()  →  POST /auth/login
  sucesso: setSession(token, user) + localStorage  →  /feed
  erro: exibe message do backend

Refresh de página (estando logado):
  token no localStorage  →  guard  →  auth.fetchMe()
  sucesso: user hidratado na store  →  renderiza página
  401: clearSession + /login

Logout:
  handleLogout()  →  auth.logout()  →  POST /auth/logout
  always: clearSession()  →  /login
```

### Criar e ver posts

```
Criar:
  CreatePostView  →  seleção arquivo + caption
  submit: FormData { image, caption }
  feedStore.createPost()  →  POST /posts
  sucesso: router /feed

Ver feed:
  FeedView.onMounted  →  feedStore.fetchFeed()  →  GET /feed
  renderiza PostCard para cada post
  "Carregar mais"  →  feedStore.loadMoreFeed()  →  GET /feed?cursor=...

Curtir (otimista):
  click ♥  →  toggle local imediato
  POST /posts/{id}/like  ou  DELETE /posts/{id}/unlike
  erro: reverte toggle
```

### Follow/Unfollow

```
FollowButton.toggle()
  →  toggle visual local
  →  POST /users/{id}/follow  OU  DELETE /users/{id}/unfollow
  →  emit 'toggled' para o pai atualizar seu Set/estado
  →  erro: reverte visual
```

---

## 15. Tratamento de Erros

**Erros de validação do backend (Laravel)**

O backend retorna `{ errors: { campo: ["mensagem1"] } }`. O `EditProfileView` itera esse objeto e exibe a mensagem por campo.

**Erro genérico de API**

```javascript
error.response?.data?.message ?? 'Ocorreu um erro. Tente novamente.'
```

**401 Unauthorized**

Tratado globalmente no interceptor do Axios: remove token + redireciona para `/login`. Os componentes individuais não precisam tratar esse caso.

**Validação de arquivo (cliente)**

`CreatePostView` e `EditProfileView` verificam tipo MIME e tamanho antes de enviar, exibindo mensagem imediata sem fazer requisição.

---

## 16. Responsividade

**Breakpoints**

| Nome | Largura |
|------|---------|
| Mobile pequeno | < 480px |
| Mobile | < 768px |
| Desktop | ≥ 768px |

**Adaptações por breakpoint**

`AppLayout`: Sidebar visível no desktop; Bottom Nav visível no mobile. O conteúdo principal adiciona `padding-bottom: var(--navbar-height-mobile)` no mobile para não ficar atrás da nav.

`LoginView` / `RegisterView`: Painel decorativo esquerdo some no mobile (apenas formulário).

`ProfileHeader`: Stats ficam em linha no desktop, reduzem gap no mobile.

`PostGrid`: Grade 3×N em qualquer tamanho de tela (comportamento do Instagram).

---

## 17. Referência Rápida

### Endpoints consumidos

| Método | Caminho | Usado em |
|--------|---------|---------|
| POST | /auth/login | auth.login() |
| POST | /auth/register | auth.register() |
| POST | /auth/logout | auth.logout() |
| GET | /auth/me | auth.fetchMe() |
| GET | /feed | feedStore.fetchFeed() |
| POST | /posts | feedStore.createPost() |
| GET | /posts/{id} | PostDetailView |
| DELETE | /posts/{id} | PostDetailView |
| POST | /posts/{id}/like | feedStore.toggleLike() |
| DELETE | /posts/{id}/unlike | feedStore.toggleLike() |
| GET | /posts/{id}/comments | PostDetailView |
| POST | /posts/{id}/comments | feedStore.addComment() |
| DELETE | /posts/{id}/comments/{cid} | PostDetailView |
| GET | /users/suggestions | DiscoverView |
| GET | /users/{username} | ProfileView |
| GET | /users/{username}/posts | ProfileView |
| GET | /users/{username}/followers | ConnectionListView |
| GET | /users/{username}/following | ConnectionListView |
| POST | /users/{id}/follow | FollowButton |
| DELETE | /users/{id}/unfollow | FollowButton |
| GET | /users/me | EditProfileView |
| PUT | /users/me | EditProfileView |
| POST | /users/me/avatar | EditProfileView |
| GET | /notifications | NotificationsView |
| GET | /notifications/unread-count | AppLayout |
| PUT | /notifications/read | NotificationsView |

### Valores fixos importantes

| Dado | Valor |
|------|-------|
| Chave JWT no localStorage | `instaclone.token` |
| URL da API (dev) | `http://localhost:8000/api` |
| Porta do Vite dev server | `5173` |
| Porta exposta pelo Docker | `3000` |
| Versão mínima do Node | `^20.19.0 \|\| >=22.12.0` |
