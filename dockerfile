# ETAPA 1: Construir React (Actualizado a Node 20 para evitar EBADENGINE)
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . . 
RUN npm run build

# ETAPA 2: PHP + Apache
FROM php:8.2-apache AS backend-runtime

# Instalamos las extensiones necesarias (mysqli es vital para tu error anterior)
RUN docker-php-ext-install pdo pdo_mysql mysqli
RUN a2enmod rewrite

WORKDIR /var/www/html

# 1. Copiamos el backend (.php)
COPY backend/ ./

# 2. Copiamos el build de React (.html, .js, .css)
COPY --from=frontend-build /app/dist/ ./

# 3. Copiamos el certificado de Aiven para la conexión segura
# Asegúrate de que este archivo exista en tu carpeta local backend/config/
COPY backend/config/ca.pem /var/www/html/config/ca.pem

# 4. Ajustamos permisos para Apache
RUN chown -R www-data:www-data /var/www/html

EXPOSE 80
CMD ["apache2-foreground"]