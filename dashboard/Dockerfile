FROM maven:3.8.5-openjdk-17-slim AS build
ARG FRONTEND=frontend
COPY ${FRONTEND}/src /app/frontend/src
COPY ${FRONTEND}/public /app/frontend/public
COPY ${FRONTEND}/package.json /app/frontend/package.json
COPY ${FRONTEND}/.npmrc /app/${FRONTEND}/.npmrc
COPY ${FRONTEND}/craco.config.js /app/frontend/craco.config.js
COPY src /app/src
COPY pom.xml /app/pom.xml
COPY settings.xml /app/settings.xml
WORKDIR /app
ARG CI_PACKAGES_PASSWORD
ENV CI_PACKAGES_PASSWORD=${CI_PACKAGES_PASSWORD}
RUN mvn --settings settings.xml clean package -DskipTests
RUN mkdir -p target/dependency
WORKDIR /app/target/dependency
RUN jar -xf ../*.jar

FROM openjdk:17-slim
ARG DEPENDENCY=/app/target/dependency
COPY --from=build ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY --from=build ${DEPENDENCY}/META-INF /app/META-INF
COPY --from=build ${DEPENDENCY}/BOOT-INF/classes /app
# RUN rm -f /app/lib/log4j-api-2.14.1.jar /app/lib/log4j-to-slf4j-2.14.1.jar
# COPY lib /app/lib
ENTRYPOINT ["java","-Xms1g","-Xmx2g","-cp","app:app/lib/*","nl.wur.daghub.DaghubApplication"]