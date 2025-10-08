# Utilise une image OpenJDK
FROM openjdk:11-jdk-slim

WORKDIR /app

# Comme nous sommes déjà dans docker/languages, juste copier TestJava.java
COPY TestJava.java .

CMD ["sh", "-c", "javac TestJava.java && java -cp . TestJava"]

