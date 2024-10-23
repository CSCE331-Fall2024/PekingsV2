package com.pekings.pos;

import javafx.application.Application;
import javafx.stage.Stage;

public class POSApp extends Application {

    /**
     * Automatically launches the login scene
     *
     * @param PrimaryStage The stage all scenes will be displayed on
     */
    @Override
    public void start(Stage PrimaryStage) throws Exception {
        new Login(PrimaryStage);
    }

    /**
     * Launches all arguments passed into the function from the function run
     */
    public void initialize(String[] args) {
        launch(args);
    }
}