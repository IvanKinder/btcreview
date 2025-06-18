FROM node:18

WORKDIR /app
COPY . .
RUN npm install
ENV DATABASE_URL=postgresql://postgres:postgres@postgres:5432/btc?schema=public

# RUN npm run build
RUN npx prisma generate

# CMD ["npm", "run", "dev"]
# CMD ["node", ".output/server/index.mjs"]