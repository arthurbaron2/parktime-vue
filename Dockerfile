# -------- Build stage --------
    FROM node:20-alpine AS build
    WORKDIR /app
    COPY package*.json ./
    RUN npm ci
    COPY . .
    RUN npm run build
    
    FROM caddy:2.8-alpine
    COPY --from=build /app/dist /usr/share/caddy
    COPY <<'CADDYFILE' /etc/caddy/Caddyfile
    :80 {
      root * /usr/share/caddy
      encode zstd gzip
      file_server
      try_files {path} /index.html
    }
    CADDYFILE
    