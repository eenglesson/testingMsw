# Steg 1: Byggbild med Node.js
FROM node:18 AS build

# Skapa och sätt arbetskatalogen i containern
WORKDIR /app

# Kopiera package.json och package-lock.json till arbetskatalogen
COPY package*.json ./

# Installera alla projektberoenden med npm
RUN npm install

# Kopiera alla filer i projektet till containern
COPY . .

# Bygg applikationen för produktion
RUN npm run build

# Steg 2: Använd Nginx för att servera byggda filer
FROM nginx:alpine

# Kopiera byggda filer från steg 1 till Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exponera port 80 (den port som nginx använder)
EXPOSE 80

# Starta Nginx
CMD ["nginx", "-g", "daemon off;"]
