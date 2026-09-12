FROM php:8.2-apache

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    libpng-dev \
    libxml2-dev \
    libzip-dev \
    libpq-dev \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libwebp-dev \
    unzip \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Configure and install PHP extensions (including pgsql for PostgreSQL)
RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install pdo_pgsql pdo_mysql gd mbstring zip xml bcmath opcache

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Enable Apache rewrite module
RUN a2enmod rewrite

# Set working directory
WORKDIR /var/www/html

# Copy composer files first (for caching)
COPY composer.json composer.lock ./

# Install PHP dependencies
RUN composer install --no-dev --no-scripts --no-interaction

# Copy application files
COPY . .

# Create .env file from .env.example
RUN cp .env.example .env

# Generate APP_KEY
RUN php artisan key:generate --force --no-interaction

# Run Laravel post-install scripts
RUN composer dump-autoload --optimize \
    && php artisan package:discover --ansi \
    && php artisan vendor:publish --tag=laravel-assets --ansi --force

# Install frontend dependencies and build assets
RUN npm install && npm run build

# Remove .env file (Render will provide env vars)
RUN rm .env

# Cache configuration, routes, and views for production
RUN php artisan config:cache && php artisan route:cache && php artisan view:cache

# Set proper permissions
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 755 storage bootstrap/cache

# Expose port 8080 (Render requirement)
EXPOSE 8080

# Update Apache to listen on port 8080
RUN sed -i 's/Listen 80/Listen 8080/' /etc/apache2/ports.conf \
    && sed -i 's/:80/:8080/' /etc/apache2/sites-enabled/000-default.conf

# Start Apache in foreground
CMD ["apache2-foreground"]
