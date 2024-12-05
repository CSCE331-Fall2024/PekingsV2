package com.pekings.pos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the Spring Boot application.
 * Configures and starts the application context and embedded server.
 */
@SpringBootApplication
public class Main {

    /**
     * The main method, which serves as the entry point for the application.
     *
     * - This method initializes the Spring Application Context.
     * - It bootstraps the application by scanning for Spring components, configurations, and beans.
     * - Starts the embedded server to listen for incoming requests.
     *
     * @param args Command-line arguments passed to the application at startup.
     */
    public static void main(String[] args) {
        SpringApplication.run(Main.class, args);
    }
}
