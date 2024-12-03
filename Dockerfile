# Stage 1: Build Angular app
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build   # Esto genera los archivos estáticos en /app/dist/frontend

# Stage 2: Serve Angular app with Nginx
FROM nginx:alpine

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos generados por Angular a la ubicación de Nginx
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

