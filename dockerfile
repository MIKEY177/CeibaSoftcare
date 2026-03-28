# ===============================================
# ETAPA 1: Construir el Frontend (React en la Raíz)
# ===============================================
FROM node:18-alpine AS frontend-build

WORKDIR /app

# 1. Copiamos el package.json que está en la RAÍZ del repo
COPY package*.json ./
RUN npm install

# 2. Copiamos todo lo que NO sea la carpeta backend (usando .dockerignore)
# Esto incluye src/, public/, etc.
COPY . .
RUN npm run build

# ===============================================
# ETAPA 2: Configurar el Backend (Carpeta /backend)
# ===============================================
FROM php:8.2-apache AS backend-runtime

RUN docker-php-ext-install pdo pdo_mysql
RUN a2enmod rewrite

WORKDIR /var/www/html

# 3. Copiamos el contenido de tu carpeta 'backend' a la raíz de Apache
COPY backend/ .

# 4. Traemos la carpeta de construcción de React
# Si usas Vite es 'dist', si es Create React App es 'build'
COPY --from=frontend-build /app/dist ./dist

# 5. Ajustar permisos
RUN chown -R www-data:www-data /var/www/html

EXPOSE 80
CMD ["apache2-foreground"]