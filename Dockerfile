# ESTÁGIO 1: Build da aplicação React/Vite
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ESTÁGIO 2: Servir os arquivos estáticos com Nginx
FROM nginx:alpine

# Copia os arquivos gerados no estágio de build para a pasta pública do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expõe a porta 80 (padrão web)
EXPOSE 80

# Inicia o Nginx
CMD ["nginx", "-g", "daemon off;"]