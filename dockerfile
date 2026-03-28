# ===============================================
# ETAPA 1: Construir el Frontend (React)
# ===============================================
FROM node:18-alpine AS frontend-build

WORKDIR /CEIBASOFTCARE/src

# Copiar archivos de dependencias y instalarlas
COPY src/package*.json ./
RUN npm install

# Copiar el resto del código y construir
COPY src/ ./
# Asegúrate de configurar variables de entorno si las necesitas durante el build
RUN npm run build

# ===============================================
# ETAPA 2: Configurar el Backend (PHP + Apache)
# ===============================================
FROM php:8.2-apache AS backend-runtime

# 1. Instalar extensiones de PHP necesarias (ej. PDO para MySQL)
RUN docker-php-ext-install pdo pdo_mysql

# 2. Habilitar mod_rewrite de Apache
RUN a2enmod rewrite

# 3. Configurar el directorio de trabajo de Apache
WORKDIR /var/www/html

# 4. Copiar las dependencias de Composer (si usas)
# Nota: Render suele tener composer instalado, pero aquí lo instalamos a mano
# para asegurar que corra dentro del contenedor.
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
COPY backend/composer*.json ./
RUN composer install --no-interaction --no-dev --optimize-autoloader

# 5. Copiar el código fuente de PHP
COPY backend/ ./

# 6. ¡LA MAGIA! Copiar el build de React a una subcarpeta de PHP
# Asumimos que React construye en 'dist' (Vite) o 'build' (CRA).
# Esto hará que tu React sea accesible en tu-url.onrender.com/
COPY --from=frontend-build /app/frontend/dist /var/www/html/dist

# 7. Configuración final: Ajustar permisos para Apache
RUN chown -R www-data:www-data /var/www/html

# 8. Exponer el puerto por defecto de Apache
EXPOSE 80

# 9. Comando para iniciar Apache al arrancar el contenedor
CMD ["apache2-foreground"]