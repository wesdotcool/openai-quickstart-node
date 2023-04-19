# syntax=docker/dockerfile:1

FROM node:19-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json .
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]
