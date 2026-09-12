# Multi-stage Docker build for 666-camp-fire Spring Boot Backend
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY server/pom.xml .
COPY server/src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
