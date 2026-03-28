# ETAPA 1: Construir React
FROM node:18-alpine AS frontend-build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . . 
RUN npm run build

# ETAPA 2: PHP + Apache
FROM php:8.2-apache AS backend-runtime
RUN docker-php-ext-install pdo pdo_mysql
RUN a2enmod rewrite

WORKDIR /var/www/html

# 1. Copiamos el contenido de tu carpeta backend (tus .php)
COPY backend/ ./

# 2. Copiamos el CONTENIDO del build de React a la raíz
# Esto pondrá el index.html de React en /var/www/html/index.html
COPY --from=frontend-build /app/dist/ ./

# 3. Permisos
RUN chown -R www-data:www-data /var/www/html

EXPOSE 80
CMD ["apache2-foreground"]