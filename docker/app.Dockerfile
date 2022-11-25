FROM node:16

WORKDIR /app

RUN npm install -g pnpm

CMD ["npm", "run", "dev"]
