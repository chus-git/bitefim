#!/bin/bash

# Colors
BLUE="\033[1;34m"
NC="\033[0m" # No color

echo -e "${BLUE}Updating local repository...${NC}"
git pull

# Go to the ./frontend folder
cd ./frontend

echo -e "${BLUE}Updating dependencies...${NC}"
# Update dependencies with npm install
npm install

echo -e "${BLUE}Building...${NC}"
# Build with npm run build
npm run build

echo -e "${BLUE}Copying build files...${NC}"
# Create destination folder if it doesn't exist
mkdir -p /var/www/bitefim/frontend

# Copy build files to the destination folder
cp -r ./dist/* /var/www/bitefim/frontend

# Go to the ./backend folder
cd ..
cd ./backend

# Create destination folder if it doesn't exist
mkdir -p /var/www/bitefim/backend

# Copy files to the destination folder
cp -r ./ /var/www/bitefim/backend

# Check if Composer is installed
if ! [ -x "$(command -v composer)" ]; then
  echo -e "${BLUE}Installing Composer...${NC}"
  # Install Composer
  php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
  php composer-setup.php --install-dir=/usr/local/bin --filename=composer
  php -r "unlink('composer-setup.php');"
fi

echo -e "${BLUE}Installing Composer dependencies...${NC}"
# Run Composer to install dependencies
composer update --no-interaction

echo -e "${BLUE}Task completed successfully! 🌈 Keep living in multicolor!${NC}"
