FROM node:20-slim
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
# Ini bagian penting: menyalin index.html dan index.js
COPY . .
EXPOSE 8080
CMD [ "node", "index.js" ]