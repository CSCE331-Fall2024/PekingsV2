package com.pekings.pos.storage;

import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

public class QueryLoader {

    private static final String QUERY_FILE = "fetch_queries.sql";

    private final Map<String, String> queries = new HashMap<>();

    public void loadQueries() throws IOException, URISyntaxException {
        String content = new String(Files.readAllBytes(Paths.get(
                getClass().getResource("/sql/" + QUERY_FILE).toURI()
        )));
        String[] sections = content.split("-- ");

        for (String section : sections) {
            if (!section.trim().isEmpty()) {
                String[] lines = section.split("\n", 2);
                if (lines.length == 2) {
                    String queryName = lines[0].trim();
                    String query = lines[1].trim();
                    queries.put(queryName, query);
                }
            }
        }
    }

    public String getQuery(String queryName) {
        return queries.get(queryName);
    }

}
