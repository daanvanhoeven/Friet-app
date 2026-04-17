FROM node:22-alpine
WORKDIR /app
COPY build ./build
EXPOSE 3000
CMD ["node", "build"]