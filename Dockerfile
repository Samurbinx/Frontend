FROM node:18 AS builder

# Configuración de directorio de trabajo
WORKDIR /app

# Copiar archivos necesarios para instalar dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Compilar el proyecto en modo de producción
RUN npm run build

# Etapa 2: Servir la aplicación con Nginx
FROM nginx:alpine

# Copiar los archivos compilados al servidor Nginx
COPY --from=builder /app/dist/Frontend /usr/share/nginx/html

# Exponer el puerto 80 para el acceso al contenedor
EXPOSE 80

# Comando por defecto para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
