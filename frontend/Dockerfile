# Etapa 1: Construir la aplicación Angular
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build -- --configuration=production # Asegúrate de que este es el comando correcto para tu build de producción

# Etapa 2: Servir la aplicación con Nginx
FROM nginx:alpine

# Copia los archivos de build desde la etapa anterior
COPY --from=build /app/dist/your-angular-app-name /usr/share/nginx/html
# Reemplaza 'your-angular-app-name' con el nombre de tu proyecto Angular, que es el subdirectorio que crea `ng build` dentro de `dist`.

# Expone el puerto 80 (puerto por defecto de Nginx)
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]