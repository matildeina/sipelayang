FROM node:20-slim

WORKDIR /usr/src/app

# Copy package files dulu buat install dependency
COPY package*.json ./
RUN npm install --only=production

# COPY SEMUA file kodingan (Ini jangan sampe kelewat!)
COPY . .

# Beri tahu Cloud Run port yang dipakai
EXPOSE 8080

# Perintah menjalankan aplikasi (sesuaikan nama filenya)
CMD [ "node", "index.js" ]