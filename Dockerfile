# ── Stage 1: build ───────────────────────────────────────────────────────────
FROM node:22-alpine AS build

WORKDIR /app

# Aceita a URL da API como build-arg (usada pelo Vite em tempo de build)
ARG VITE_API_URL=http://localhost:8000/api
ENV VITE_API_URL=$VITE_API_URL

# Instala dependências primeiro (cache de camadas)
COPY package.json package-lock.json ./
RUN npm ci

# Copia o restante e faz o build
COPY . .
RUN npm run build-only

# ── Stage 2: runtime ────────────────────────────────────────────────────────
FROM nginx:1.27-alpine

# Copia a configuração customizada do nginx
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos estáticos gerados pelo Vite
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
