FROM node:23

WORKDIR /odontology
COPY package.json .
RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "start"]