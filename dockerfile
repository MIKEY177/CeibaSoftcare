# ===============================================
# ETAPA 1: Construir React (Desde la Raíz)
# ===============================================
FROM node:18-alpine AS frontend-build

WORKDIR /app

# 1. Copiamos los archivos de dependencias de la raíz
COPY package*.json ./
RUN npm install

# 2. Copiamos TODO el contenido de la raíz al contenedor
# (Usaremos el .dockerignore para que no meta basura)
COPY . .

# 3. Generamos el build de React
RUN npm run build

# ===============================================
# ETAPA 2: Configurar PHP + Apache (Carpeta /backend)
# ===============================================
FROM php:8.2-apache AS backend-runtime

# Instalar extensiones para MySQL (PDO)
RUN docker-php-ext-install pdo pdo_mysql
RUN a2enmod rewrite

WORKDIR /var/www/html

# 4. Copiamos el contenido de TU carpeta backend a la raíz de Apache
# IMPORTANTE: Asegúrate de que en GitHub se escriba 'backend' en minúsculas
COPY backend/ ./

# 5. Traemos la carpeta 'dist' generada en la Etapa 1
# Nota: Si usas Create React App en lugar de Vite, cambia 'dist' por 'build'
COPY --from=frontend-build /app/dist ./dist

# 6. Permisos de Apache
RUN chown -R www-data:www-data /var/www/html

EXPOSE 80

CMD ["apache2-foreground"]