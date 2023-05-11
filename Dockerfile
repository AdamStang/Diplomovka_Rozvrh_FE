FROM node:18-alpine AS build
WORKDIR /frontend
COPY package.json .
RUN npm install
COPY . .
# EXPOSE 4200
RUN npm run build
# CMD ["npm", "start"]

FROM nginx:latest AS prod 
COPY --from=build /frontend/dist/frontend /usr/share/nginx/html
EXPOSE 4200