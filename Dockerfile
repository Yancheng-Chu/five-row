FROM node:16-slim
WORKDIR /Users/sf.com/Downloads/Server
COPY package*.json ./
RUN npm install --only=production
COPY . ./
CMD [ "node", "index.js" ]
