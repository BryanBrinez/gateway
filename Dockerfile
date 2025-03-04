# Usa la imagen oficial de Node.js
FROM node:18-alpine

# Crea el directorio de la app
WORKDIR /app

# Copia los archivos necesarios
COPY package.json package-lock.json ./

# Instala dependencias
RUN npm install --omit=dev

# Copia el código fuente
COPY . .


# Expone el puerto del gateway
EXPOSE 3000

# Comando para correr la app
CMD ["npm", "run", "start"]
