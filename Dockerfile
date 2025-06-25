FROM node:18

WORKDIR /app

COPY server/package.json server/package-lock.json ./server/
COPY client/package.json client/package-lock.json ./client/

RUN cd server && npm install
RUN cd client && npm install && npm run build

COPY server ./server
COPY client/dist ./client/dist

EXPOSE 3001

# Use SQLite volume
VOLUME ["/data"]

CMD ["sh", "-c", "cd server && node server.js"]
