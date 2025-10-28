FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM caddy:2.8-alpine
WORKDIR /srv
COPY --from=build /app/dist /srv
EXPOSE 80
