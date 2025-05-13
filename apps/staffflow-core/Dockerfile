# Dockerfile for production build
FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm install && npm run build

EXPOSE 5173

CMD ["npm", "run", "preview"]
