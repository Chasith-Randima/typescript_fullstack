FROM node:20-alpine

WORKDIR /app/backend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001
# RUN npm install --os=linuxmusl --cpu=x64 sharp
RUN npm install --include=optional sharp

CMD ["npm","run","dev"]