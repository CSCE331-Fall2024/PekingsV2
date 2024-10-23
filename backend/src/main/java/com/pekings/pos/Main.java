package com.pekings.pos;

import com.pekings.pos.storage.PersistentRepository;
import com.pekings.pos.storage.Repository;

import java.sql.SQLException;

public class Main {

    private static Repository repository;

    /**
     * Initializes the database and calls the functions to open and launch the window.
     * Main method is also responsible for adding a shutdown hook that calls
     * {@link PersistentRepository#shutdown()}, responsible for safely closing the
     * DB connection through JDBC
     *
     * @param args Arguments received upon running the program
     */
    public static void main(String[] args) throws Exception {
        repository = new PersistentRepository();
        ((PersistentRepository) repository).initialize();

        POSApp posApp = new POSApp();
        posApp.initialize(args);

        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            try {
                ((PersistentRepository) repository).shutdown();
            } catch (SQLException ignored) {}
        }));
    }

    /**
     * returns the repository when called
     *
     * @return The repository created in the main
     */
    public static Repository getRepository() {
        return repository;
    }
}