FROM node:alpine
RUN apk add g++ make py3-pip
WORKDIR /usr/src/app
COPY package*.json .
RUN npm install
COPY . .
CMD ["npm", "start"]