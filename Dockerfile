FROM node:14.15.4-alpine
ENV NODE_ENV=production
ENV PORT=80

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY ./dist .
EXPOSE 80
CMD ["node", "--require", "dotenv/config", "--require", "source-map-support/register", "index.js"]
