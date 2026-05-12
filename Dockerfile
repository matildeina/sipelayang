FROM node:20-slim

WORKDIR /usr/src/app

# Copy package files dan install dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy semua file kodingan Mane
COPY . .

# Port yang dipakai Cloud Run
EXPOSE 8080

# Perintah buat jalanin aplikasi
CMD [ "node", "index.js" ]