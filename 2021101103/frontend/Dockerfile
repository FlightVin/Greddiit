FROM node:16.19.1-alpine
WORKDIR /frontend

COPY --chown=node:node package*.json ./
RUN npm install

COPY --chown=node:node . .

EXPOSE 3000

ENTRYPOINT [ "npm", "run", "start" ]