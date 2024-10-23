package com.pekings.pos;

import com.pekings.pos.object.Employee;
import com.pekings.pos.object.Ingredient;
import com.pekings.pos.object.MenuItem;
import com.pekings.pos.storage.Repository;
import com.pekings.pos.util.DateUtil;
import com.pekings.pos.util.SaleHistoryItem;
import javafx.collections.FXCollections;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.chart.*;
import javafx.scene.control.*;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.scene.layout.Pane;
import javafx.scene.layout.Region;
import javafx.scene.shape.Rectangle;
import javafx.scene.Scene;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import javafx.scene.paint.Color;
import javafx.scene.text.Font;
import javafx.collections.ObservableList;
import javafx.scene.text.Text;

import javafx.stage.Popup;
import javafx.stage.Stage;

import java.sql.Time;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.sql.Date;
import java.util.Calendar;
import java.util.List;
import java.util.stream.Collectors;

public class Manager {
    Stage PrimaryStage;
    Scene loginScreen, managerScene;
    long managerID;

    List<MenuItem> menuItemList;
    List<Employee> employeeList;

    private Repository repo;
    private Pane rootManager;
    ScrollPane centerScroll = new ScrollPane();
    Rectangle r = new Rectangle();
    Text text = new Text("Manager");

    Button logOut = new Button();

    Button menuItems = createButton(30, 160, "_Menu\nItems", "-fx-background-color: #36919E");
    Button inventory = createButton(30, 255, "_Inventory", "-fx-background-color: #36919E");
    Button employees = createButton(30, 350, "_Employees", "-fx-background-color: #36919E");
    Button stats = createButton(30, 445, " _Stats \nReport", "-fx-background-color: #36919E");
    LocalDate beginningOfMonth = LocalDate.now().withDayOfMonth(1);
    LocalDate date30DaysAhead = LocalDate.now().plusDays(30);
    Date beginning = Date.valueOf(beginningOfMonth);
    Date daysAhead = Date.valueOf(date30DaysAhead);

    public final Map<Ingredient, Boolean> checkBoxStates = new HashMap<>();

    /**
     * Assigns all passed values to permanent variables in the class.
     *
     * @param PrimaryStage The window which all scenes will be displayed on.
     * @param id The manager ID, used for opening the cashier screen from the manager screen.
     * @param repo Contains the repository, used for accessing database data.
     * @param loginScreen Used in functions to return to the original login screen.
     */
    public Manager(Stage PrimaryStage, Scene loginScreen, Repository repo, long id) {
        this.PrimaryStage = PrimaryStage;
        this.loginScreen = loginScreen;
        this.repo = repo;
        this.managerID = id;
        rootManager = new Pane();
    }

    /**
     * Sets the basic scene for the manager screen with the different scene buttons.
     * Each of those buttons changes the scene to show the specified data.
     * Opens Menu Items panel automatically.
     *
     * @param stage The Primary window which all scenes will be displayed on
     */
    public Scene createManagerScene(Stage stage) {
        // Setup Manager Scene

        managerScene = new Scene(rootManager, 1000, 700);
        repo = Main.getRepository();

        employeeList = repo.getEmployees().stream().sorted(Comparator.comparingInt(value -> (int) value.getId())).toList();
        // Text for Manager Screen
        List<Ingredient> ingredientList = repo.getAllIngredients();
        // Set date for last 30 days. Runs once
        Map<MenuItem, Double> revenueData = repo.getTopMenuItemsRevenue(beginning, daysAhead);


        text.setX(50);
        text.setY(660);
        text.setFill(Color.BLACK);

        // Style left rectangle
        r.setX(0);
        r.setY(0);
        r.setWidth(150);
        r.setHeight(700);
        r.setFill(Color.web("#D9D9D9"));

        // logOut Btn Initialization
        logOut = createLogOutButton(stage);
        // Button actions

        menuItems.setOnAction(_ -> openMenuItems(stage));
        PieChart initialChart = createTopMenuItemsRevenueChart();


        stats.setOnAction(_ -> displayStatsReport(initialChart, revenueData));

        //List<Ingredient> ingredientList;
        // Same thing with different values for Inventory
        inventory.setOnAction(_ -> {
            //inventoryButton(rootManager);
            repo.getAllIngredients();
            rootManager.getChildren().clear();
            rootManager.getChildren().addAll(r, text, logOut, menuItems, inventory, employees, stats);


            // Create main container for menu items
            VBox inventoryItemsContainer = new VBox(10); //  is the spacing between items
            inventoryItemsContainer.setPadding(new Insets(15, 15, 15, 15));

            HBox Header = new HBox(10);
            Label nameColumn = new Label("Ingredient Name");
            Label idColumn = new Label("IDs");
            Label quantityColumn = new Label("Quantity");
            nameColumn.setStyle("-fx-font-weight: bold");
            idColumn.setStyle("-fx-font-weight: bold");
            quantityColumn.setStyle("-fx-font-weight: bold");
            nameColumn.setPrefWidth(200);
            idColumn.setPrefWidth(100);
            quantityColumn.setPrefWidth(100);
            Header.getChildren().addAll(nameColumn, idColumn, quantityColumn);
            inventoryItemsContainer.getChildren().add(Header);



            // Add menu items to the list and display them
            for (Ingredient ingredient : repo.getAllIngredients()) {
                HBox itemRow = new HBox(10);
                TextField nameField = new TextField(ingredient.getName());
                TextField idField = new TextField(String.valueOf(ingredient.getId()));
                TextField quantityField = new TextField(String.valueOf(ingredient.getAmount()));
                nameField.setPrefWidth(200);
                idField.setPrefWidth(100);
                quantityField.setPrefWidth(200);

                Button editButton = new Button("_Edit");
                Button saveButton = new Button("_Save Changes");
                Button deleteButton = new Button("_Delete");

                saveButton.setVisible(false);
                nameField.setEditable(false);
                idField.setEditable(false);
                quantityField.setEditable(false);

                editButton.setOnAction(_ -> {
                    saveButton.setVisible(true);
                    nameField.setEditable(true);
                    quantityField.setEditable(true);
                    editButton.setVisible(false);

                });

                saveButton.setOnAction(_ -> {
                    String newName = nameField.getText();
                    float newQuantity = Integer.parseInt(quantityField.getText());


                    Ingredient newIngredient = new Ingredient(ingredient.getId(),newName, ingredient.getPrice(), (int)newQuantity, (ingredient.getPrice() * newQuantity));
                    repo.updateIngredientInventory(newIngredient);
                    saveButton.setVisible(false);
                    editButton.setVisible(true);
                    nameField.setEditable(false);
                    quantityField.setEditable(false);
                });
                deleteButton.setOnAction(_ -> {
                    // Remove from database here
                    Popup dltIngredient = createDeletePopupIngredient(inventoryItemsContainer,itemRow,ingredient);
                    dltIngredient.show(stage);

                });
                itemRow.getChildren().addAll(nameField, idField, quantityField, editButton, saveButton, deleteButton);
                inventoryItemsContainer.getChildren().add(itemRow);

            }

            HBox newItemRow = new HBox(10);
            TextField newNameField = new TextField();
            TextField newPriceField = new TextField();

            TextField newquantityField = new TextField();
            Button addButton = new Button("Add Item");

            newNameField.setPromptText("New item name");
            newquantityField.setPromptText("quantity");
            newNameField.setPrefWidth(200);
            newquantityField.setPrefWidth(200);
            newPriceField.setPromptText("Set Price");
            newPriceField.setPrefWidth(100);

            addButton.setOnAction(_ -> {
                String newName = newNameField.getText();
                int newPrice = Integer.valueOf(newPriceField.getText());
                int newQuantity = Integer.parseInt(newquantityField.getText());
                addIngredient(newName,newPrice, newQuantity);

                inventory.fire(); // This will refresh the entire list
            });

            newItemRow.getChildren().addAll(newNameField, newquantityField, newPriceField, addButton);
            inventoryItemsContainer.getChildren().add(newItemRow);

            Region extraSpace = new Region();
            extraSpace.setPrefHeight(50);
            VBox.setVgrow(extraSpace, javafx.scene.layout.Priority.ALWAYS);
            inventoryItemsContainer.getChildren().add(extraSpace);

            ScrollPane scrollPane = new ScrollPane(inventoryItemsContainer);
            scrollPane.setPrefWidth(810);
            scrollPane.setPrefHeight(645);
            scrollPane.setLayoutX(160);
            scrollPane.setLayoutY(0);

            rootManager.getChildren().add(scrollPane);
        });

        employees.setOnAction(_ -> {
            rootManager.getChildren().clear();
            rootManager.getChildren().addAll(r, text, logOut, menuItems, inventory, employees, stats);
            //public List<Employee> getEmployees() {
            // public List<Employee> getActiveEmployees() {
            // Pull all the data. In each iteration, check if the id of employee matches active employee.
            // If it does, display Green Text, or Green Oval with "Active" in it to the right of the employee name
            // Create main container for employees
            VBox employeeContainer = new VBox(10); // 10 is the spacing between items
            employeeContainer.setPadding(new Insets(15, 15, 15, 15));

            HBox Header = new HBox(10);
            Label nameColumn = new Label("Employee User");
            Label passwordColumn = new Label("Password");
            Label employeeIDColumn = new Label("ID");
            Label employeePosColumn = new Label("Position");
            Label statusColumn = new Label("Active Status");
            nameColumn.setStyle("-fx-font-weight: bold");
            passwordColumn.setStyle("-fx-font-weight: bold");
            employeeIDColumn.setStyle("-fx-font-weight: bold");
            employeePosColumn.setStyle("-fx-font-weight: bold");
            statusColumn.setStyle("-fx-font-weight: bold");
            nameColumn.setPrefWidth(250);
            passwordColumn.setPrefWidth(250);
            employeeIDColumn.setPrefWidth(100);
            employeePosColumn.setPrefWidth(250);
            statusColumn.setPrefWidth(100);
            Header.getChildren().addAll(nameColumn, passwordColumn, employeeIDColumn, employeePosColumn, statusColumn);
            employeeContainer.getChildren().add(Header);
            // Add menu items to the list and display them
            //if edit is clicked. Go back through all employees and set save, and delete to visible
            for (Employee employee : repo.getEmployees().stream().sorted(Comparator.comparingInt(value -> (int) value.getId())).toList()) {
                HBox itemRow = new HBox(10);
                TextField usernameField = new TextField(employee.getUsername());
                TextField passwordField = new TextField(employee.getPassword());
                TextField employeeIDField = new TextField(String.valueOf(employee.getId()));
                TextField positionField = new TextField(employee.getPosition());
                TextField activeStatusField = new TextField("N/A");
                if (employee.isClockedIn()) {
                    activeStatusField = new TextField("Clocked In");
                } else {
                    activeStatusField = new TextField("Not Clocked In");
                }

                usernameField.setPrefWidth(250);
                passwordField.setPrefWidth(250);
                employeeIDField.setPrefWidth(100);
                positionField.setPrefWidth(250);
                activeStatusField.setPrefWidth(100);


                Button saveButton = new Button("_Save Changes");
                Button deleteButton = new Button("_Remove Employee");
                Button clockedInOut = new Button("_Clock In/Out");
                Button editButton = new Button("_Edit");

                saveButton.setVisible(false);
                usernameField.setEditable(false);
                passwordField.setEditable(false);
                clockedInOut.setVisible(false);
                employeeIDField.setEditable(false);
                activeStatusField.setEditable(false);

                editButton.setOnAction(_ -> {
                    saveButton.setVisible(true);
                    usernameField.setEditable(true);
                    passwordField.setEditable(true);
                    clockedInOut.setVisible(true);

                });

                saveButton.setOnAction(_ -> {
                    String newName = usernameField.getText();
                    String newPass = passwordField.getText();
                    String newPos = positionField.getText();

                    saveButton.setVisible(false);
                    clockedInOut.setVisible(false);
                    editButton.setVisible(true);
                    updateEmployee(employee.getId(), newName, newPass, newPos, employee.getLastClockIn(), employee.isClockedIn());
                });

                deleteButton.setOnAction(_ -> {
                    // Remove from database here
                    Popup employeePopup = createDeletePopupEmployee(employeeContainer, itemRow, employee);
                    employeePopup.show(stage);

                    //removeMenuItem((int) item.getId());
                });
                clockedInOut.setOnAction(_ -> {
                    if(!employee.isClockedIn()){
                        repo.clockIn((int) employee.getId());
                    }else {
                        repo.clockOut((int)employee.getId());
                    }
                    employees.fire();
                });


                itemRow.getChildren().addAll(usernameField, passwordField, employeeIDField, positionField, activeStatusField, editButton, clockedInOut, saveButton, deleteButton);
                itemRow.setPadding(new Insets(0, 30, 0, 0));
                employeeContainer.getChildren().add(itemRow);

            }


            HBox newItemRow = new HBox(10);
            TextField newUsernameField = new TextField();
            TextField newPasswordField = new TextField();
            TextField newEmployeeIDField = new TextField();
            TextField newPositionField = new TextField();
            TextField newActiveStatusField = new TextField("Not Clocked In");
            Button addButton = new Button("Add Item");

            newUsernameField.setPromptText("Set New Username");
            newPasswordField.setPromptText("Set New Password");
            newPositionField.setPromptText("Employee Position");
            newEmployeeIDField.setPrefWidth(100);
            newPositionField.setPrefWidth(250);
            newActiveStatusField.setPrefWidth(100);

            addButton.setOnAction(_ -> {
                String newUser = newUsernameField.getText();
                String newPass = newPasswordField.getText();
                String newPos = newPositionField.getText();
                // Add to database here user, pass, pos, lastClockIn, clockedIn = false
                Time lstIn = new Time(0,0,0);

                Employee newGuy = new Employee((employeeList.getLast().getId()+1),newUser,newPass,newPos,lstIn, false);
                repo.addEmployee(newGuy);
                // Refresh the list (you might want to just add the new item instead of refreshing everything)
                employees.fire(); // This will refresh the entire list
            });


            newItemRow.getChildren().addAll(newUsernameField,newPasswordField,newPositionField,newActiveStatusField, addButton);
            employeeContainer.getChildren().add(newItemRow);

            ScrollPane scrollPane = new ScrollPane(employeeContainer);
            scrollPane.setPrefWidth(810);
            scrollPane.setPrefHeight(645);
            scrollPane.setLayoutX(160);
            scrollPane.setLayoutY(15);

            rootManager.getChildren().add(scrollPane);
        });

        //Menu section
        centerScroll.setLayoutX(160);
        centerScroll.setLayoutY(0);
        centerScroll.setPrefWidth(550);
        centerScroll.setPrefHeight(700);

        rootManager.getChildren().addAll(r, text, logOut, menuItems, inventory, employees, stats);
        openMenuItems(stage);

        return managerScene;
    }

    /**
     * Function call for statsReport button
     * Displays the initial scene of stats report for topMenuItems
     * Displays different buttons that will change the statsReport scene
     * Buttons are Top Menu Items (Total Revenue), Top Menu Items (# of Orders), Daily Income, Product Usage Chart, Z Report, and X Report
     *
     * @param initChart The initial Chart that will be displays (e.g. Top Menu Items (Total Revenue) graph)
     * @param revenueData A Map containing the revenue data for the daily revenue button
     */
    private void displayStatsReport(PieChart initChart, Map<MenuItem, Double> revenueData) {
        rootManager.getChildren().clear();
        rootManager.getChildren().addAll(r, text, logOut, menuItems, inventory, employees, stats);

        ScrollPane mainScrollPane = new ScrollPane();
        mainScrollPane.setLayoutX(150);
        mainScrollPane.setLayoutY(0);
        mainScrollPane.setPrefWidth(850);
        mainScrollPane.setPrefHeight(660);

        VBox contentBox = new VBox(10);
        Label hoverLabel = new Label();
        for (PieChart.Data data : initChart.getData()) {
            data.getNode().setOnMouseEntered(_ -> {
                hoverLabel.setText(data.getName() + ": " + (int) data.getPieValue());
            });

            data.getNode().setOnMouseExited(_ -> {
                hoverLabel.setText(""); // Clear label when mouse exits
            });
        }
        contentBox.getChildren().addAll(initChart,hoverLabel);

        HBox buttonBox = new HBox(10);
        buttonBox.setPrefWidth(845);
        buttonBox.setLayoutX(100);
        buttonBox.setLayoutY(15);

        HBox pucBox = new HBox(10);
        pucBox.setPrefWidth(845);
        pucBox.setLayoutX(100);
        pucBox.setLayoutY(30);

        pucBox.setVisible(false);

        HBox zReportBox = new HBox();
        zReportBox.setPrefWidth(845);
        zReportBox.setLayoutX(100);
        zReportBox.setLayoutY(30);

        HBox xReportBox = new HBox();
        xReportBox.setPrefWidth(845);
        xReportBox.setLayoutX(100);
        xReportBox.setLayoutY(30);

        HBox totHBox = new HBox();
        totHBox.setAlignment(Pos.CENTER);


        zReportBox.setVisible(false);

        Button topMenuItemsRevenueBtn = new Button("Top Menu Items (Total Revenue)");
        Button topMenuItemsOrdersBtn = new Button("Top Menu Items (# of Orders)");
        Button dailyIncomeBtn = new Button("Daily Income");
        Button pucBtn = new Button("Product Usage Chart");
        Button submitTimeBtn = new Button("Submit Time");
        Button zReport = new Button("Z Report");
        Button xReport = new Button("X Report");


        TextField from = new TextField();
        TextField to = new TextField();
        from.setPromptText("From: YYYY-MM-DD");
        to.setPromptText("To: YYYY-MM-DD");

        topMenuItemsRevenueBtn.setOnAction(_ -> {
            updateChart(createTopMenuItemsRevenueChart());
            pucBox.setVisible(false);
            zReportBox.setVisible(false);
            totHBox.setVisible(false);
        });
        topMenuItemsOrdersBtn.setOnAction(_ -> {
            updateChart(createTopMenuItemsOrdersChart());
            pucBox.setVisible(false);
            zReportBox.setVisible(false);
            totHBox.setVisible(false);
        });
        dailyIncomeBtn.setOnAction(_ -> {

            pucBox.setVisible(false);
            zReportBox.setVisible(false);
            totHBox.setVisible(false);
        });

        pucBtn.setOnAction(_ -> {

            pucBox.setVisible(true);
            zReportBox.setVisible(false);
            totHBox.setVisible(false);
        });

        zReport.setOnAction(_ -> {
            pucBox.setVisible(false);
            zReportBox.setVisible(true);
        });
        xReport.setOnAction(_ -> {
            pucBox.setVisible(false);
            zReportBox.setVisible(false);
            xReportBox.setVisible(true);
            totHBox.setVisible(false);
            VBox vb = (VBox) ((ScrollPane) rootManager.getChildren().get(rootManager.getChildren().size() - 1)).getContent();
            vb.getChildren().set(0, createXReport(Date.valueOf(LocalDate.now())));
        });

        topMenuItemsRevenueBtn.setOnAction(_ -> {
            updateChart(createTopMenuItemsRevenueChart());
            pucBox.setVisible(false);
            zReportBox.setVisible(false);
            totHBox.setVisible(false);
        });
        topMenuItemsOrdersBtn.setOnAction(_ -> {
            updateChart(createTopMenuItemsOrdersChart());
            pucBox.setVisible(false);
            zReportBox.setVisible(false);
            totHBox.setVisible(false);
        });
        dailyIncomeBtn.setOnAction(_ -> {
            updateChart(createDailyIncomeChart(revenueData));
            pucBox.setVisible(false);
            zReportBox.setVisible(false);
            totHBox.setVisible(false);
        });
        TextField zReportDay = new TextField();
        zReportDay.setPromptText("Format: YYYY-MM-DD");
        Button submitZReportDay = new Button("Submit");
        TextField totalRev = new TextField();
        TextField totalOrder = new TextField();
        Label rev = new Label("Total Revenue");
        Label ord = new Label("Total Orders");


        VBox zRevBox = new VBox();
        VBox zOrdBox = new VBox();
        zRevBox.getChildren().addAll(rev, totalRev);
        zOrdBox.getChildren().addAll(ord, totalOrder);

        totHBox.getChildren().addAll(zOrdBox,zRevBox);

        totHBox.setVisible(false);

        submitTimeBtn.setOnAction(_ -> {
            updateChart(createPUCChart(from, to));
        });

        submitZReportDay.setOnAction(actionEvent -> {
            VBox vb = (VBox) ((ScrollPane) rootManager.getChildren().get(rootManager.getChildren().size() - 1)).getContent();
            vb.getChildren().set(0, createZReport(DateUtil.fromString(zReportDay.getText()), totalRev, totalOrder));
            totHBox.setVisible(true);
            pucBox.setVisible(false);
        });

        buttonBox.getChildren().addAll(topMenuItemsRevenueBtn, topMenuItemsOrdersBtn, dailyIncomeBtn, pucBtn, zReport,xReport);
        buttonBox.setAlignment(Pos.CENTER);

        pucBox.getChildren().addAll(from,submitTimeBtn,to);
        pucBox.setAlignment(Pos.CENTER);

        zReportBox.getChildren().addAll(zReportDay, submitZReportDay);
        zReportBox.setAlignment(Pos.CENTER);

        contentBox.getChildren().addAll(buttonBox, pucBox, zReportBox, totHBox);

        mainScrollPane.setContent(contentBox);
        rootManager.getChildren().add(mainScrollPane);
    }

    /**
     * The graph functions return their type of chart.
     * update Chart takes in newChart and replaces the graph in the Stats Report scene with the new graph and displays it
     *
     * @param newChart newChart is the return from each graph function that returns a type of chart
     */
    private void updateChart(Chart newChart) {
        // This is to hold whatever chart was last in the order

        VBox contentBox = (VBox) ((ScrollPane) rootManager.getChildren().get(rootManager.getChildren().size() - 1)).getContent();
        contentBox.getChildren().set(0, newChart);
    }

    /**
     * createTopMenuItemsRevenueChart creates a new Pie Chart, and uses the top menu items function
     * to set the data of the pie chart with our database's top menu items.
     *
     * @return returns that chart to be used as the parameter in updateChart
     */
    private PieChart createTopMenuItemsRevenueChart() {
        PieChart chart = new PieChart();
        Map<MenuItem, Double> topItems = repo.getTopMenuItemsRevenue(5);
        ObservableList<PieChart.Data> pieChartData = FXCollections.observableArrayList(
                topItems.entrySet().stream()
                        .map(entry -> new PieChart.Data(entry.getKey().getName(), entry.getValue()))
                        .collect(Collectors.toList())
        );

        chart.setData(pieChartData);
        chart.setTitle("Top 5 Menu Items by Revenue");
        return chart;
    }

    private TableView<SaleHistoryItem> createZReport(Date day, TextField totalRev, TextField totalOrder) {
        TableView<SaleHistoryItem> tableView = new TableView<>();
        TableColumn<SaleHistoryItem, String> order_hour = new TableColumn<>("Hour");
        TableColumn<SaleHistoryItem, String> totalOrderColumns = new TableColumn<>("Total Orders");
        TableColumn<SaleHistoryItem, String> totalRevenueColumns = new TableColumn<>("Total Revenue");


        order_hour.setCellValueFactory(new PropertyValueFactory<>("time"));
        totalOrderColumns.setCellValueFactory(new PropertyValueFactory<>("totalOrders"));
        totalRevenueColumns.setCellValueFactory(new PropertyValueFactory<>("totalRevenue"));

        tableView.getColumns().add(order_hour);
        tableView.getColumns().add(totalOrderColumns);
        tableView.getColumns().add(totalRevenueColumns);

        List<SaleHistoryItem> saleHistoryItems = repo.getSalesHistory(day, DateUtil.addDay(day));
        saleHistoryItems.reversed(); // we get this from midnight next day to midnight requested day, so reverse

        tableView.getItems().addAll(saleHistoryItems);


        double totalRevSum = saleHistoryItems.stream().mapToDouble(SaleHistoryItem::getTotalRevenue).sum();
        int totOrderSum = saleHistoryItems.stream().mapToInt(SaleHistoryItem::getTotalOrders).sum();

        totalRev.setText("$" + totalRevSum);
        totalOrder.setText(Integer.toString(totOrderSum));

        return tableView;
    }

    /**
     * Creates a new scene display for stats report. When xReport button is pressed, it calls this function.
     * Makes a table with Hour, Orders, and Revenue.
     * In each row displayed the data from order sales
     *
     * @param day takes in the current day's date that will be used in determining which data to show
     * @return returns a tableView of this x report
     */
    private TableView<SaleHistoryItem> createXReport(Date day) {
        TableView<SaleHistoryItem> tableView = new TableView<>();

        TableColumn<SaleHistoryItem, String> orderHourColumn = new TableColumn<>("Hour");
        TableColumn<SaleHistoryItem, String> totalOrderColumn = new TableColumn<>("Orders");
        TableColumn<SaleHistoryItem, String> totalRevenueColumn = new TableColumn<>("Revenue");

        orderHourColumn.setCellValueFactory(new PropertyValueFactory<>("time"));
        totalOrderColumn.setCellValueFactory(new PropertyValueFactory<>("totalOrders"));
        totalRevenueColumn.setCellValueFactory(new PropertyValueFactory<>("totalRevenue"));

        tableView.getColumns().add(orderHourColumn);
        tableView.getColumns().add(totalOrderColumn);
        tableView.getColumns().add(totalRevenueColumn);
        // make each row hold 2 time stamps. Then add each revenue/orders/ up to that hour.

        List<SaleHistoryItem> saleHistoryItems = repo.getSalesHistory(day, DateUtil.addDay(day));

        saleHistoryItems.reversed(); // we get this from midnight next day to midnight requested day, so reverse

        // Get the current time and round down to the nearest hour using truncatedTo. Sets the time from ex: 1:02 to 1:00
        LocalDateTime now = LocalDateTime.now().truncatedTo(ChronoUnit.HOURS);
        Timestamp currentHour = Timestamp.valueOf(now);

        // Compare the timestamp of specific sale to local hour. Then only add up to the previous hour
        for (SaleHistoryItem item : saleHistoryItems) {
            Timestamp saleTime = item.getTime();
            if (saleTime.before(currentHour) || saleTime.equals(currentHour)) {
                tableView.getItems().addAll(item);
            }
        }

        return tableView;
    }

    /**
     * Returns a line chart with number of orders history
     * This function sets up a line chart that displays current order data
     * for current top ordered menu items. This will be used for the manager to analyze popular orders.
     *
     * @return returns a line chart that displays the highest number of orders between the menu items
     */
    private LineChart<String, Number> createTopMenuItemsOrdersChart() {
        // Create the axes for the LineChart
        CategoryAxis xAxis = new CategoryAxis();  // Menu items on X-axis
        NumberAxis yAxis = new NumberAxis();      // Number of orders on Y-axis
        xAxis.setLabel("Menu Item");
        yAxis.setLabel("Number of Orders");

        // Create the LineChart
        LineChart<String, Number> lineChart = new LineChart<>(xAxis, yAxis);
        lineChart.setTitle("Top 5 Menu Items by Number of Orders");

        Map<MenuItem, Integer> topItems = repo.getTopMenuItemsOrders(5).entrySet()
                .stream()
                .sorted((entry1, entry2) -> entry2.getValue().compareTo(entry1.getValue())) // Sorting in descending order
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (e1, e2) -> e1, // If there are duplicate keys, keep the first one (though duplicates shouldn't happen here)
                        LinkedHashMap::new // Collecting into a LinkedHashMap to preserve order
                ));

        // Create a data series for the chart
        XYChart.Series<String, Number> series = new XYChart.Series<>();
        series.setName("Number of Orders");

        // Populate the series with the data from the map
        topItems.forEach((item, orders) ->
                series.getData().add(new XYChart.Data<>(item.getName(), orders))
        );

        // Add the series to the chart
        lineChart.getData().add(series);

        return lineChart;
    }

    /**
     * Returns a line chart with revenue history
     * This function takes in a map of revenue data and sets up a line chart that displays correct revenue data
     * for the daily income chart. This will be used for the manager to analyze relevant data covering the last 30 days
     *
     * @param revenueData a map of the revenue data for all the orders of menu items sold over the last 30 days
     * @return returns the line chart that displays this data
     */
    private LineChart<String, Double> createDailyIncomeChart(Map<MenuItem, Double> revenueData) {
        CategoryAxis xAxis = new CategoryAxis();
        ValueAxis yAxis = new NumberAxis();

        xAxis.setLabel("MenuItems");
        yAxis.setLabel("Revenue");
        xAxis.setMaxWidth(550);

        // Create a LineChart
        LineChart<String, Double> lineChart = new LineChart<>(xAxis, yAxis);
        lineChart.setTitle("Revenue for Last 30 Days");

        // Create data series
        XYChart.Series<String, Double> series = new XYChart.Series<>();
        series.setName("Daily Revenue");


        for (Map.Entry<MenuItem, Double> entry : revenueData.entrySet()) {

            Double revenue = entry.getValue();
            series.getData().add(new XYChart.Data<>(entry.getKey().getName(), revenue));
        }
        lineChart.getData().add(series);
        lineChart.setLegendVisible(false);

        return lineChart;
    }

    /**
     * Returns a bar chart/histogram with ingredient history
     * This function takes in two TextFields and sets up a histogram that accurately displays correct data
     * for the Product Usage Chart (PUC). This PUC will be used for the manager to analyze relevant data regarding
     * inventory given a time period.
     *
     * @param from  the beginning of the time period
     * @param to  the end of the time period
     * @return a histogram/bar graph of the ingredients used during a given time period
     */
    private BarChart<String, Number> createPUCChart(TextField from, TextField to) {
        CategoryAxis xAxis = new CategoryAxis();
        NumberAxis yAxis = new NumberAxis();

        xAxis.setLabel("Ingredients");
        yAxis.setLabel("Usage Count");

        String fromInput = from.getText();
        String toInput = to.getText();

        if (fromInput.isEmpty()) {
            showErrorPopup("From date is required.");
        }

        if (toInput.isEmpty()) {
            showErrorPopup("To date is required.");
        }

        Date fromDate = DateUtil.fromString(fromInput);
        Date toDate = DateUtil.fromString(toInput);

        // Create a histogram/barchart
        BarChart<String, Number> barChart = new BarChart<>(xAxis, yAxis);
        barChart.setTitle("Product Usage Chart");

        // Data series
        XYChart.Series<String, Number> series = new XYChart.Series<>();
        series.setName("Amount of Ingredients Used");

        // Getting top ingredients and amount of top ingredients
        int maxIngredients = repo.getAllIngredients().size();

        Map<Ingredient, Integer> ingredientsInPeriod = repo.getTopIngredients(fromDate, toDate, maxIngredients);

        // Populating series with the data from the map
        for (Map.Entry<Ingredient, Integer> entry : ingredientsInPeriod.entrySet()) {
            series.getData().add(new XYChart.Data<>(entry.getKey().getName(), entry.getValue()));
        }

        // Add the series to the histogram
        barChart.getData().add(series);

        // Adjust the y-axis
        yAxis.setAutoRanging(false);
        yAxis.setLowerBound(0);
        int maxUsage = ingredientsInPeriod.values().stream().mapToInt(Integer::intValue).max().orElse(100);
        yAxis.setUpperBound(maxUsage * 1.1);
        yAxis.setTickUnit(maxUsage / 10);

        return barChart;
    }


    private String formatDate(Date date) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        return String.format("%02d/%02d", cal.get(Calendar.MONTH) + 1, cal.get(Calendar.DAY_OF_MONTH));
    }

    /**
     * Adds an ingredient to the database
     * This function takes in a user defined name, price, and quantity that is used as the parameter for another function call
     * to initialize a new ingredient type. This will be used when a manager needs to add a new ingredient to the database
     *
     * @param name a string received from a textfield that is user inputted
     * @param price a float received from a textfield that is cast into float and is user inputted
     * @param quantity an int received from a textfield that is cast into an int and is user inputted
     */
    private void addIngredient(String name, float price, int quantity) {
        Ingredient ingredient = new Ingredient(-1, name, price, quantity, (price * quantity));
        repo.addNewIngredientInventory(ingredient);
    }

    /**
     * Function updates a current Employee entry in the employee entity
     * This function takes in textfields for an id, username, password, position, a time for lastClockIn, and a boolean.
     * These will be used to initialize a new employee type and that new object will replace the employee entity selected
     *
     * @param id the id of the selected employee
     * @param username the current/updated username changed from a textbox in the employee entries
     * @param password the current/updated password changed from a textbox in the employee entries
     * @param position the current/updated position changed from a textbox in the employee entries
     * @param lastClockIn the last time the selected employee was clocked in
     * @param clockedIn the boolean for the employee that is currently clocked in or not
     */
    private void updateEmployee(long id, String username, String password, String position, Time lastClockIn, boolean clockedIn) {
        Employee newguy = new Employee(id, username, password, position, lastClockIn, clockedIn);
        repo.updateEmployee(newguy);
    }

    /**
     * Returns a button that when clicked opens a popup that prompts the user if they want to log out, or close the popup.
     * If on manager screen, it will offer to switch to cashier side as well as the previous choices.
     * This function takes in the current Primary Stage and adds the button to the Primary Stage.
     *
     * @param stage The primary stage of the manager scene
     * @return a button called logOut
     */
    private Button createLogOutButton(Stage stage) {
        Button logOut = new Button("_Log\nOut");
        logOut.setStyle("-fx-background-color: red;");
        logOut.setPrefHeight(80);
        logOut.setPrefWidth(80);
        logOut.setLayoutX(30);
        logOut.setLayoutY(30);
        logOut.setTextFill(Color.BLACK);

        logOut.setOnMouseEntered(_ -> {
            logOut.setStyle("-fx-background-color: darkgray;");
        });
        logOut.setOnMouseExited(_ -> {
            logOut.setStyle("-fx-background-color: RED");
        });

        Popup logOutPopup = createLogOutPopup();
        logOut.setOnAction(_ -> {
            logOutPopup.show(stage);
        });

        return logOut;
    }

    /**
     * Returns a popup that prompts the manager to enter "DELETE" in the textbox provided if they wish to delete the selected data entry
     * This function takes in the current Vbox, itemRow (in order to delete it), and the specific item so the correct database entry can be deleted
     * with the correct private function repo.deleteMenuItem(...)
     *
     * @param container This variable passes the VBox container for the table of menu items
     * @param itemRow passes the current item row entry selected
     * @param item passes the specific menu item's id so the item can be deleted from the database
     * @return returns a popup that prompts the manager to either delete the item or cancel
     */
    private Popup createDeletePopup(VBox container, HBox itemRow, MenuItem item){
        Popup popup = new Popup();

        // Create VBox for popup
        VBox popupContent = new VBox(10);
        popupContent.setPadding(new Insets(10));
        popupContent.setStyle("-fx-background-color: white; -fx-border-color: black; -fx-border-width: 2px;");


        Label confirmationLabel = new Label("Completely delete this entry?");
        Label typeDelete = new Label("Type DELETE");
        confirmationLabel.setFont(Font.font(14));


        TextField deleteMsg = new TextField();
        deleteMsg.setPromptText("Type DELETE");
        Button noBtn = new Button("Cancel");
        Button done = new Button("Done");

        done.setOnAction(_ -> {
            if (Objects.equals(deleteMsg.getText(), "DELETE")) {
                repo.deleteMenuItem((int) item.getId());
                container.getChildren().remove(itemRow);
                openMenuItems(PrimaryStage);
                popup.hide();
            }
            else{
                deleteMsg.clear();
                confirmationLabel.setText("Incorrect Input");
            }
        });

        noBtn.setOnAction(_ -> popup.hide());


        HBox box = new HBox(10,done, noBtn);
        box.setAlignment(Pos.CENTER);

        VBox buttonBox = new VBox(10, deleteMsg, box);
        buttonBox.setAlignment(Pos.CENTER);

        popupContent.getChildren().addAll(confirmationLabel,typeDelete, buttonBox, box);
        popupContent.setAlignment(Pos.CENTER);

        popup.getContent().add(popupContent);

        return popup;
    }

    /**
     * Returns a popup that prompts the manager to enter "DELETE" in the textbox provided if they wish to delete the selected data entry
     * This function takes in the current Vbox, itemRow (in order to delete it), and the specific ingredient so the correct database entry can be deleted
     * with the correct private function repo.deleteIngredientInventory(...)
     *
     * @param container This variable passes the VBox container for the table of ingredients
     * @param itemRow passes the current item row entry selected
     * @param ingredient passes the specific ingredient's id so the item can be deleted from the database
     * @return returns a popup that prompts the manager to either delete the item or cancel
     */
    private Popup createDeletePopupIngredient(VBox container, HBox itemRow, Ingredient ingredient){
        Popup popup = new Popup();

        // Create VBox for popup
        VBox popupContent = new VBox(10);
        popupContent.setPadding(new Insets(10));
        popupContent.setStyle("-fx-background-color: white; -fx-border-color: black; -fx-border-width: 2px;");


        Label confirmationLabel = new Label("Completely delete this entry?");
        Label typeDelete = new Label("Type DELETE");
        confirmationLabel.setFont(Font.font(14));


        TextField deleteMsg = new TextField();
        deleteMsg.setPromptText("Type DELETE");
        Button noBtn = new Button("Cancel");
        Button done = new Button("Done");

        done.setOnAction(_ -> {
            if (Objects.equals(deleteMsg.getText(), "DELETE")) {
                repo.deleteIngredientInventory((int)ingredient.getId());
                container.getChildren().remove(itemRow);
                popup.hide();
            }
            else{
                deleteMsg.clear();
                confirmationLabel.setText("Incorrect Input");
            }
        });

        noBtn.setOnAction(_ -> popup.hide());


        HBox box = new HBox(10,done, noBtn);
        box.setAlignment(Pos.CENTER);

        VBox buttonBox = new VBox(10, deleteMsg, box);
        buttonBox.setAlignment(Pos.CENTER);

        popupContent.getChildren().addAll(confirmationLabel,typeDelete, buttonBox, box);
        popupContent.setAlignment(Pos.CENTER);

        popup.getContent().add(popupContent);

        return popup;
    }

    /**
     * Returns a popup that prompts the manager to enter "DELETE" in the textbox provided if they wish to delete the selected data entry
     * This function takes in the current Vbox, itemRow (in order to delete it), and the specific employee so the correct database entry can be deleted
     * with the correct private function repo.removeEmployee(...)
     *
     * @param container This variable passes the VBox container for the table of ingredients
     * @param itemRow passes the current item row entry selected
     * @param item passes the specific employee's id so the item can be deleted from the database
     * @return returns a popup that prompts the manager to either delete the item or cancel
     */
    private Popup createDeletePopupEmployee(VBox container, HBox itemRow, Employee item){
        Popup popup = new Popup();

        // Create VBox for popup
        VBox popupContent = new VBox(10);
        popupContent.setPadding(new Insets(10));
        popupContent.setStyle("-fx-background-color: white; -fx-border-color: black; -fx-border-width: 2px;");


        Label confirmationLabel = new Label("Completely delete this entry?");
        Label typeDelete = new Label("Type DELETE");
        confirmationLabel.setFont(Font.font(14));


        TextField deleteMsg = new TextField();
        deleteMsg.setPromptText("Type DELETE");
        Button noBtn = new Button("Cancel");
        Button done = new Button("Done");

        done.setOnAction(_ -> {
            if (Objects.equals(deleteMsg.getText(), "DELETE")) {
                repo.removeEmployee((int) item.getId());
                container.getChildren().remove(itemRow);
                popup.hide();
            }
            else{
                deleteMsg.clear();
                confirmationLabel.setText("Incorrect Input");
            }
        });

        noBtn.setOnAction(_ -> popup.hide());

        HBox box = new HBox(10,done, noBtn);
        box.setAlignment(Pos.CENTER);

        VBox buttonBox = new VBox(10, deleteMsg, box);
        buttonBox.setAlignment(Pos.CENTER);

        popupContent.getChildren().addAll(confirmationLabel,typeDelete, buttonBox, box);
        popupContent.setAlignment(Pos.CENTER);

        popup.getContent().add(popupContent);

        return popup;
    }

    /**
     * Returns the popup that the createLogOutButton function calls
     * This functions creates the window popup for the logout button to display when clicked.
     * It prompts the user if they want to log out, or cancel. If the user is a manager, then it also prompts the user
     * on the manager screen if they want to switch to the cashier scene, else if in cashier side, it will prompt the user
     * if they want to return to the manager screen or log out.
     *
     * @return a popup that prompts the cashier or manager to either log out, cancel, or if manager to switch to cashier or manager screen
     */
    private Popup createLogOutPopup() {
        Popup popup = new Popup();

        // Create VBox for popup
        VBox popupContent = new VBox(10);
        popupContent.setPadding(new Insets(10));
        popupContent.setStyle("-fx-background-color: white; -fx-border-color: black; -fx-border-width: 2px;");


        Label confirmationLabel = new Label("Return to log in screen?");
        confirmationLabel.setFont(Font.font(14));


        Button yesBtn = new Button("Log Out");
        Button noBtn = new Button("Cancel");
        Button cashierBtn = new Button("Cashier");

        yesBtn.setOnAction(_ -> {
            PrimaryStage.setScene(loginScreen);
            popup.hide();  // Hide the popup
        });

        noBtn.setOnAction(_ -> popup.hide());

        cashierBtn.setOnAction(_ -> {
            Button btn = new Button("Log\nOut");
            btn.setOnAction(_ -> {
                Popup popupExtention = new Popup();

                // Create VBox for popup
                VBox popupContentExtention = new VBox(10);
                popupContentExtention.setPadding(new Insets(10));
                popupContentExtention.setStyle("-fx-background-color: white; -fx-border-color: black; -fx-border-width: 2px;");


                Label confirmationLabelExtention = new Label("Return to log in screen?");
                confirmationLabelExtention.setFont(Font.font(14));


                Button yesBtnExtention = new Button("Log Out");
                Button noBtnExtention = new Button("Cancel");
                Button managerBtn = new Button("Manager");

                yesBtnExtention.setOnAction(_ -> {
                    System.out.println("Yes");
                    PrimaryStage.setScene(loginScreen);
                    popupExtention.hide();  // Hide the popup
                });

                noBtnExtention.setOnAction(_ -> {
                    System.out.println("No");
                    popupExtention.hide();
                });

                managerBtn.setOnAction(_ -> {
                    System.out.println("Manager");
                    PrimaryStage.setScene(managerScene);
                    popupExtention.hide();
                });

                HBox buttonBoxExtention = new HBox(10, yesBtnExtention, noBtnExtention);
                buttonBoxExtention.setAlignment(Pos.CENTER);

                HBox alternateBoxExtention = new HBox(10, managerBtn);
                alternateBoxExtention.setAlignment(Pos.CENTER);

                popupContentExtention.getChildren().addAll(confirmationLabelExtention, buttonBoxExtention, alternateBoxExtention);
                popupContentExtention.setAlignment(Pos.CENTER);

                popupExtention.getContent().add(popupContentExtention);
                popupExtention.show(PrimaryStage);
            });

            Cashier cash = new Cashier(PrimaryStage, btn, managerID);
            Scene cashier = cash.getScene();
            PrimaryStage.setScene(cashier);

            popup.hide();
        });

        HBox buttonBox = new HBox(10, yesBtn, noBtn);
        buttonBox.setAlignment(Pos.CENTER);

        HBox alternateBox = new HBox(10, cashierBtn);
        alternateBox.setAlignment(Pos.CENTER);

        popupContent.getChildren().addAll(confirmationLabel, buttonBox, alternateBox);
        popupContent.setAlignment(Pos.CENTER);

        popup.getContent().add(popupContent);

        return popup;
    }

    /**
     * Returns a button with the specified x, y, label, and color for easy button creation
     * This template is used to create the basic buttons on the left in the manager screen
     *
     * @param x the x layout variable for the button
     * @param y the y layout variable for the button
     * @param label the string variable that has the string content in the button
     * @param color the background color of the button
     * @return returns the button created from the template with the specified x, y, label, and color
     */
    private Button createButton(int x, int y, String label, String color) {
        Button Btn = new Button(label);
        Btn.setStyle(color);
        Btn.setTextFill(Color.BLACK);
        Btn.setLayoutX(x);
        Btn.setLayoutY(y);
        Btn.setPrefWidth(80);
        Btn.setPrefHeight(80);
        Btn.setOnMouseEntered(_ -> {
            Btn.setStyle("-fx-background-color: darkgray;");
        });
        Btn.setOnMouseExited(_ -> {
            Btn.setStyle(color);
        });

        return Btn;
    }

    /**
     * This function opens the Menu Items tab for the manager.
     * Displays all menu items, active or inactive.
     * Allows full editing of the menu items except for ingredients.
     * Allows for addition of new menu items such as seasonal items.
     * Menu items may be set to be inactive or active for the cashiers.
     *
     * @param stage Used for an argument to recall this function and for displaying popups
     */
    private void openMenuItems(Stage stage){
        menuItemList = repo.getMenuItems().stream().sorted(Comparator.comparingInt(value -> (int) value.getId())).toList();
        rootManager.getChildren().clear();
        rootManager.getChildren().addAll(r, text, logOut, menuItems, inventory, employees, stats);

        // Create main container for menu items
        VBox menuItemsContainer = new VBox(10); // 10 is the spacing between items
        menuItemsContainer.setPadding(new Insets(15, 15, 15, 15));

        HBox Header = new HBox(10);
        Label nameColumn = new Label("Name");
        Label priceColumn = new Label("Price");
        nameColumn.setStyle("-fx-font-weight: bold");
        priceColumn.setStyle("-fx-font-weight: bold");
        nameColumn.setPrefWidth(300);
        priceColumn.setPrefWidth(100);
        Header.getChildren().addAll(nameColumn, priceColumn);
        menuItemsContainer.getChildren().add(Header);

        // Add menu items to the list and display them
        for (MenuItem item : menuItemList) {
            HBox itemRow = new HBox(10);
            TextField nameField = new TextField(item.getName());
            TextField priceField = new TextField(String.format("$%.2f", item.getPrice()));
            nameField.setPrefWidth(300);
            priceField.setPrefWidth(100);

            Button editButton = new Button("_Edit");
            Button saveButton = new Button("_Save Changes");
            Button deleteButton = new Button("_Delete");

            Button activeButton = new Button();
            if(item.isActive()){
                activeButton.setText("Active");
            }else{
                activeButton.setText("Inactive");
            }
            activeButton.setOnAction(_ -> {
                if(activeButton.getText().equals("Active")){
                    activeButton.setText("Inactive");
                }else{
                    activeButton.setText("Active");
                }
            });

            saveButton.setVisible(false);
            nameField.setEditable(false);
            activeButton.setDisable(true);
            priceField.setEditable(false);

            editButton.setOnAction(_ -> {
                activeButton.setDisable(false);
                saveButton.setVisible(true);
                nameField.setEditable(true);
                priceField.setEditable(true);
                editButton.setVisible(false);
            });


            saveButton.setOnAction(_ -> {
                String newName = nameField.getText();
                String newPriceStr = priceField.getText();
                if(newPriceStr.isEmpty()){
                    showErrorPopup("Please enter a price");
                    return;
                }
                newPriceStr = newPriceStr.replaceAll(",", ".");
                if(newPriceStr.split("\\.").length > 2){
                    showErrorPopup("Too many decimals/commas");
                    return;
                }
                if(newPriceStr.charAt(0) == '$'){
                    newPriceStr = newPriceStr.substring(1);
                }
                if(! (newPriceStr.matches("[0-9]*(\\.[0-9]+)?"))){
                    showErrorPopup("Invalid characters in price field");
                    return;
                }
                float newPrice = Float.parseFloat(newPriceStr);

                int tempIdHold = (int) item.getId();
                List<Ingredient> tempIngredients = repo.getIngredients(tempIdHold);
                menuItemsContainer.getChildren().remove(itemRow);
                boolean isActive = activeButton.getText().equals("Active");
                MenuItem newOne = new MenuItem(tempIdHold, newName, newPrice, tempIngredients, isActive);
                repo.updateMenuItem(newOne);

                saveButton.setVisible(false);
                editButton.setVisible(true);
                nameField.setEditable(false);
                priceField.setEditable(false);
                activeButton.setDisable(true);
                openMenuItems(stage);
            });


            deleteButton.setOnAction(_ -> {
                Popup dlt = createDeletePopup(menuItemsContainer,itemRow,item);
                dlt.show(stage);
            });

            itemRow.getChildren().addAll(activeButton, nameField, priceField, editButton, saveButton, deleteButton);
            menuItemsContainer.getChildren().add(itemRow);
        }


        HBox newItemRow = new HBox(10);
        TextField newNameField = new TextField();
        TextField newPriceField = new TextField();
        Button selectIngredients = new Button("Ingredients");
        Button addButton = new Button("Add Item");

        newNameField.setPromptText("New item name");
        newPriceField.setPromptText("Price");
        newNameField.setPrefWidth(300);
        newPriceField.setPrefWidth(100);

        selectIngredients.setOnAction(_ -> showSelectionDialog());

        addButton.setOnAction(_ -> {
            String name = newNameField.getText();
            if(name.isEmpty()){
                showErrorPopup("Name is empty");
                return;
            }

            String priceString = newPriceField.getText();
            if(priceString.isEmpty()){
                showErrorPopup("Please enter a price");
                return;
            }
            priceString = priceString.replaceAll(",", ".");
            if(priceString.split("\\.").length > 2){
                showErrorPopup("Too many decimals/commas");
                return;
            }
            if(priceString.charAt(0) == '$'){
                priceString = priceString.substring(1);
            }
            if(! (priceString.matches("[0-9]*(\\.[0-9]+)?"))){
                showErrorPopup("Invalid characters in price field");
                return;
            }
            float price = Float.parseFloat(priceString);

            List<Ingredient> ingredients = getIngredients();
            if(ingredients.isEmpty()){
                showErrorPopup("No ingredients found");
                return;
            }

            MenuItem newMenuItem = new MenuItem(-1, name, price, ingredients, true);
            repo.addMenuItem(newMenuItem);
            openMenuItems(stage); // This will refresh the entire screen
        });


        newItemRow.getChildren().addAll(newNameField, newPriceField, selectIngredients, addButton);
        menuItemsContainer.getChildren().add(newItemRow);

        // Adds space so the add item buttons display fully
        Region extraSpace = new Region();
        extraSpace.setPrefHeight(50);
        VBox.setVgrow(extraSpace, javafx.scene.layout.Priority.ALWAYS);
        menuItemsContainer.getChildren().add(extraSpace);

        ScrollPane scrollPane = new ScrollPane(menuItemsContainer);
        scrollPane.setPrefWidth(810);
        scrollPane.setPrefHeight(645);
        scrollPane.setLayoutX(160);
        scrollPane.setLayoutY(0);

        checkBoxStates.clear();
        rootManager.getChildren().add(scrollPane);
    }

    /**
     * Goes through the checkboxes stored data, if it was selected
     * it adds the ingredient to a list of ingredients.
     * Once finished checking all checkboxes data, it
     * returns the selected ingredients list.
     *
     * @return A list containing the ingredients which were selected
     */
    private List<Ingredient> getIngredients(){
        List<Ingredient> ingredients = new ArrayList<>();
        for (Map.Entry<Ingredient, Boolean> entry : checkBoxStates.entrySet()) {
            if(entry.getValue()){
                ingredients.add(entry.getKey());
            }
        }
        return ingredients;
    }

    /**
     * Opens a dialog window containing all ingredients.
     * These ingredients may be selected using check boxes.
     * Upon closing the dialog box, the data is saved to allow it to be
     * redisplayed when it's opened again.
     */
    private void showSelectionDialog() {
        Dialog<Void> dialog = new Dialog<>();
        dialog.setTitle("Select Items");

        VBox dialogContent = new VBox(10, new Label("Select the items:"));
        List<Ingredient> ingredients = repo.getAllIngredients();
        SelectedIngredientsBox[] ingredientsBoxes = new SelectedIngredientsBox[ingredients.size()];

        for(int i = 0; i < ingredients.size(); i++) {
            SelectedIngredientsBox box = new SelectedIngredientsBox(ingredients.get(i), this);
            ingredientsBoxes[i] = box;
            dialogContent.getChildren().add(box.getCheckBox());
        }

        ScrollPane scrollPane = new ScrollPane(dialogContent);
        scrollPane.setFitToWidth(true); // Make the scroll pane fit the dialog width
        scrollPane.setPrefHeight(200); // Set a fixed height for the scroll pane

        dialog.getDialogPane().setContent(scrollPane);

        // Add a button to close the dialog
        dialog.getDialogPane().getButtonTypes().addAll(ButtonType.OK);

        // Set a preferred width for the dialog
        dialog.getDialogPane().setPrefWidth(400);

        // Show the dialog and wait for a result
        dialog.showAndWait();

        for (SelectedIngredientsBox box : ingredientsBoxes) {
            checkBoxStates.put(box.getIngredient(), box.getCheckBox().isSelected());
        }
    }

    /**
     * Opens an error screen popup displaying a message,
     * intended for error handling across the manager screen.
     *
     * @param message String which will be displayed on the error screen to explain the error.
     */
    private void showErrorPopup(String message) {
        Alert alert = new Alert(Alert.AlertType.ERROR);
        alert.setTitle("Error");
        alert.setHeaderText(null);
        alert.setContentText(message);
        alert.showAndWait();
    }
}
