FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn -q -DskipTests package

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/shop-backend-0.0.1-SNAPSHOT.jar app.jar
ENV SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/shopdb
ENV SPRING_DATASOURCE_USERNAME=postgres
ENV SPRING_DATASOURCE_PASSWORD=postgres
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]