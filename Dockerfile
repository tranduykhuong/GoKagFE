FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install react-scripts -g

COPY . .

ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
