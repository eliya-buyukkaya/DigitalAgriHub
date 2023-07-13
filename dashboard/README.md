# DigitalAgriHub Dashboard 
The application **Dashboard**, https://digitalagrihub.org/web/guest/dashboardframe, monitors digital developments for agricultural transformation worldwide.

## Backend
The backend is implemented in **Java** by using **Spring framework**.  
The followings are used as dependency:
- spring-boot-starter-web
- lombok
- springdoc-openapi-ui

The folder _src/_ contains the backend related source code.

## Frontend
The frontend is implemented in Javascript by using **React**.  
The followings are used as dependency:
- @fortawesome/fontawesome-free
- bootstrap
- chart.js
- leaflet
- multiselect-react-dropdown
- object-hash
- react
- react-bootstrap
- react-chartjs-2
- react-dom
- react-helmet
- react-leaflet
- react-leaflet-choropleth
- react-leaflet-control
- react-router-dom
- react-scripts
- rest

The folder _frontend/_ contains the frontend related source code.

## Compile & run

In the **project** directory:
- `mvn clean package [-DskipTests]`
- `java -jar target/daghub-0.0.1.jar`

or 

- `docker build -t dashbooard .`
- `docker run --rm -p 8080:8080 dashbooard`

Then on the browser:
- `http://localhost:8080/dashbooard`

# Technologies
- Spring Boot & Framework
- Spring Data JPA
- PostgreSQL
- Lombok
- OpenAPI
- Java 17
- Maven: spring-boot-maven-plugin
- JavaScript
- React
- Docker
