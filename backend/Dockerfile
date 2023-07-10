# Usar la imagen base de PHP con Apache
FROM php:8.0-fpm

# Establecer el directorio de trabajo en el contenedor
WORKDIR /var/www/html

# Instalar dependencias de sistema requeridas por Laravel
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip


# Instalar extensiones de PHP requeridas por Laravel
RUN docker-php-ext-install \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd

# Instalar Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copiar los archivos del proyecto Laravel al contenedor
COPY . .

# Instalar las dependencias de Composer
RUN composer install --no-dev --optimize-autoloader

# Generar la clave de la aplicación Laravel
#RUN php artisan key:generate

# Ejecutar las migraciones y los seeders si es necesario
#RUN php artisan migrate --seed

# Establecer los permisos adecuados en el directorio de almacenamiento
RUN chown -R www-data:www-data storage

# Ejecutar Apache en primer plano
CMD ["php-fpm"]