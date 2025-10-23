# # backend/Dockerfile
# FROM node:18-alpine

# # Establecer el directorio de trabajo dentro del contenedor
# WORKDIR /app

# # Copiar los archivos de definición del proyecto
# COPY package.json ./
# COPY package-lock.json ./

# # Instalar dependencias
# RUN npm install

# # Copiar el resto del código del backend
# COPY .dockerignore ./
# COPY .gitignore ./
# COPY app.js ./
# COPY config.js ./
# COPY dockerfile ./
# COPY index.js ./
# COPY package-lock.json ./
# COPY package.json ./
# # COPY .env.template ./
# # COPY .env ./

# # Copy .env so Vite can pick it up

# # Copiar todos los directorios relevantes
# COPY connection ./connection
# COPY controller ./controller
# COPY init.sql ./init.sql
# COPY libs ./libs
# COPY routes ./routes

# # Exponer el puerto en el que la aplicación escuchará
# EXPOSE 4000

# # Comando para iniciar la aplicación
# CMD ["node", "index.js"]

# backend/Dockerfile
FROM node:18-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos necesarios para instalar dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el código del backend
COPY . .

# Exponer el puerto
EXPOSE 4000

# Iniciar la aplicación
CMD ["node", "index.js"]
