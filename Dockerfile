# Multi-stage Docker build: Frontend + Spring Boot Backend into a unified container
FROM node:20-alpine AS client-build
WORKDIR /client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

FROM maven:3.9.6-eclipse-temurin-21 AS server-build
WORKDIR /app
COPY server/pom.xml .
COPY server/src ./src
COPY --from=client-build /client/dist/. ./src/main/resources/static/
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=server-build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
