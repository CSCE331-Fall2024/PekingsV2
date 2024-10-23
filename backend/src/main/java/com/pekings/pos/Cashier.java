package com.pekings.pos;

import com.pekings.pos.object.MenuItem;
import com.pekings.pos.object.Order;
import com.pekings.pos.storage.Repository;
import javafx.geometry.Insets;
import javafx.scene.Group;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.ScrollPane;
import javafx.scene.control.TextField;
import javafx.scene.layout.*;
import javafx.scene.paint.Color;
import javafx.scene.shape.Line;
import javafx.scene.shape.Rectangle;
import javafx.scene.text.Text;
import javafx.scene.text.TextFlow;
import javafx.stage.Popup;
import javafx.stage.Stage;
import java.util.*;
import java.sql.Date;
import java.util.Calendar;

import static javafx.scene.text.TextAlignment.CENTER;


public class Cashier {
    static int currOrder = 0;

    int orderNumber;
    List<MenuItem> menuItems;
    private Repository repo;
    Scene cashier, login;
    long employeeID;

    double sub = 0.00;
    Text subTotalTxt;
    Text taxTxt;
    Text totalTxt;

    public List<Text> deleteText;
    public List<TextFlow> deleteTextHolder;
    TilePane orderPane;

    Stage PrimaryStage;
    static List<Cashier> Orders = new ArrayList<>();

    Text memoError = new Text();

    public List<MenuItem> orderItems = new ArrayList<>();
    public List<MenuItem> deleteOrderItems = new ArrayList<>();

    ScrollPane centerScroll = new ScrollPane();
    TilePane menuPane;

    Button originalBtn;
    Button exit;


    /**
     * Sets up and creates the entire cashier scene, does NOT change the scene of the current stage.
     * Includes calling all necessary functions for the cashier screen to function correctly.
     * Creates all button functionality for the screen.
     *
     * @param PrimaryStage the stage the window holds
     * @param backBtn button with pre-designated action, used for returning to previous screens it was called from.
     * @param employeeID ID of the employee/manager, for placing orders
     */
    public Cashier(Stage PrimaryStage, Button backBtn, long employeeID){
        this.PrimaryStage = PrimaryStage;
        this.employeeID = employeeID;
        originalBtn = backBtn;

        exit = new Button(originalBtn.getText());
        exit.setOnAction(originalBtn.getOnAction());
        exit.setOnMouseEntered(_ -> {
            exit.setStyle("-fx-background-color: darkgray;");
        });
        exit.setOnMouseExited(_ -> {
            exit.setStyle("-fx-background-color: RED");
        });

        repo = Main.getRepository();
        menuItems = repo.getMenuItems().stream().sorted(Comparator.comparingInt(value -> (int) value.getId())).toList();
        currOrder++;
        orderNumber = currOrder;
        Orders.add(this);

        deleteText = new ArrayList<>();
        deleteTextHolder = new ArrayList<>();

        Group rootCashier = new Group();
        cashier = new Scene(rootCashier, 1000, 700);

        Rectangle leftRect = new Rectangle();
        leftRect.setX(0);
        leftRect.setY(0);
        leftRect.setWidth(150);
        leftRect.setHeight(700);
        leftRect.setFill(Color.web("#D9D9D9"));

        Text cashierText = new Text("Cashier");
        cashierText.setX(50);
        cashierText.setY(640);
        cashierText.setFill(Color.BLACK);

        exit.setPrefWidth(80);
        exit.setPrefHeight(80);
        exit.setStyle("-fx-background-color: Red");
        // Change Font Weight
        exit.setLayoutX(30);
        exit.setLayoutY(30);

        Button newOrder = new Button(" New\nOrder");
        newOrder.setPrefWidth(80);
        newOrder.setPrefHeight(80);
        newOrder.setStyle("-fx-background-color: #36919E");
        newOrder.setLayoutX(30);
        newOrder.setLayoutY(160);
        newOrder.setOnAction(e -> openNewOrder());

        Button cancelOrder = new Button("Cancel\n Order");
        cancelOrder.setPrefWidth(80);
        cancelOrder.setPrefHeight(80);
        cancelOrder.setStyle("-fx-background-color: #36919E");
        cancelOrder.setLayoutX(30);
        cancelOrder.setLayoutY(255);
        cancelOrder.setOnAction(e -> cancelOrder());

        Button viewPrevious = new Button("  View\nPrevious");
        viewPrevious.setPrefWidth(80);
        viewPrevious.setPrefHeight(80);
        viewPrevious.setStyle("-fx-background-color: #36919E");
        viewPrevious.setLayoutX(30);
        viewPrevious.setLayoutY(350);
        viewPrevious.setOnAction(e -> viewPreviousOrders());

        Button memoBtn = new Button("Memo");
        memoBtn.setPrefWidth(80);
        memoBtn.setPrefHeight(80);
        memoBtn.setStyle("-fx-background-color: #1E3A63");
        memoBtn.setTextFill(Color.BLACK);
        memoBtn.setLayoutX(30);
        memoBtn.setLayoutY(455);

        memoError.setFill(Color.RED);
        memoError.setX(210);
        memoError.setY(280);

        Popup memo = new Popup();
        memo.setX(200);
        memo.setY(200);

        Rectangle memoBox = new Rectangle();

        Text memoTxt = new Text("Enter memo :");
        memoTxt.setLayoutX(210);
        memoTxt.setLayoutY(235);

        TextField memoField = new TextField();
        memoField.setLayoutX(210);
        memoField.setLayoutY(240);
        memoField.setPrefWidth(200);

        Button closePop = new Button("X");
        closePop.setLayoutX(420);
        closePop.setLayoutY(210);
        closePop.setOnAction(e -> {
            memo.hide();
            memoField.clear();
            memoError.setText("");
        });

        Button memoFinish = new Button("Done");
        memoFinish.setLayoutX(310);
        memoFinish.setLayoutY(285);
        memoFinish.setOnAction(e -> finishMemo(memoField, memo));

        memoBox.setLayoutX(200);
        memoBox.setLayoutY(200);
        memoBox.setWidth(250);
        memoBox.setHeight(125);
        memoBox.setFill(Color.WHITE);
        memoBox.setStroke(Color.BLACK);

        memo.getContent().addAll(memoBox, memoTxt, memoField, closePop, memoFinish, memoError);

        memoBtn.setOnAction(e -> {
            if((!(orderPane.getChildren().isEmpty())) && (orderPane.getChildren().get(orderPane.getChildren().size() - 2) instanceof Text)){
                memoField.setText(((Text) orderPane.getChildren().get(orderPane.getChildren().size() - 2)).getText());
            }
            memo.show(PrimaryStage);
        });



        Button removeItem = new Button("Delete Selected Item");
        removeItem.setLayoutX(702);
        removeItem.setLayoutY(110);
        removeItem.setPrefWidth(298);
        removeItem.setPrefHeight(40);
        removeItem.setStyle("-fx-background-color: Red");
        removeItem.setOnAction(e -> deleteItems());

        // Background rectangle covering right side of screen
        Rectangle rectRight = new Rectangle();
        rectRight.setX(700);
        rectRight.setY(0);
        rectRight.setWidth(300);
        rectRight.setHeight(700);
        rectRight.setFill(Color.web("#D9D9D9"));

        // Sepearates the center screen and the right side of the screen
        Line orderBorderLeft = new Line();
        orderBorderLeft.setStartX(700);
        orderBorderLeft.setStartY(0);
        orderBorderLeft.setEndX(700);
        orderBorderLeft.setEndY(700);
        orderBorderLeft.setStrokeWidth(4);

        // Line separates the payment box from the order items box
        Line paymentBorderTop = new Line();
        paymentBorderTop.setStartX(700);
        paymentBorderTop.setStartY(450);
        paymentBorderTop.setEndX(1000);
        paymentBorderTop.setEndY(450);
        paymentBorderTop.setStrokeWidth(2);

        //Bottom right rectangle
        Rectangle paymentRect = new Rectangle();
        paymentRect.setX(700);
        paymentRect.setY(450);
        paymentRect.setWidth(300);
        paymentRect.setHeight(250);
        paymentRect.setFill(Color.web("#8c8c8c"));


        //Menu section
        centerScroll.setLayoutX(150);
        centerScroll.setLayoutY(0);
        centerScroll.setPrefWidth(550);
        centerScroll.setPrefHeight(700);

        //Holds all the buttons
        menuPane = new TilePane();
        menuPane.setPrefColumns(4);
        menuPane.setPadding(new Insets(30));
        menuPane.setHgap(30);
        menuPane.setVgap(30);
        menuPane.setLayoutX(180);
        menuPane.setLayoutY(25);
        menuPane.setMaxWidth(600);
        menuPane.setMaxHeight(550);


        Text orderNumTitle = new Text("Order #");
        orderNumTitle.setStyle("-fx-font-size: 30px");
        orderNumTitle.setX(790);
        orderNumTitle.setY(40);
        Text orderNum = new Text(String.valueOf(currOrder));
        orderNum.setStyle("-fx-font-size: 40px");
        orderNum.setX(825);
        orderNum.setY(90);

        // Sets the line under the order number
        Line orderNumLine = new Line();
        orderNumLine.setStartX(700);
        orderNumLine.setStartY(110);
        orderNumLine.setEndX(1000);
        orderNumLine.setEndY(110);
        orderNumLine.setStrokeWidth(5);


        //Displays items on current order
        ScrollPane orderScroll = new ScrollPane();
        orderScroll.setLayoutX(700);
        orderScroll.setLayoutY(150);
        orderScroll.setMaxHeight(290);
        orderScroll.setMaxWidth(400);
        orderScroll.setMinHeight(290);
        orderScroll.setMinWidth(400);

        orderPane = new TilePane();
        orderPane.setPadding(new Insets(20, 0, 10, 20));
        orderScroll.setContent(orderPane);

        orderPane.setStyle("-fx-background-color: #D9D9D9");
        orderPane.setPrefColumns(2);
        orderPane.setHgap(20);
        orderPane.setVgap(15);
        orderPane.setPrefTileWidth(140);
        orderPane.setMinHeight(290);

        //Adds the menu buttons to the menu TilePane
        for (MenuItem i : menuItems) {
            if(i.isActive()) {
                MenuButton MenuItemButton = new MenuButton(i, orderPane, this);
                menuPane.getChildren().add(MenuItemButton.createMenuBtn());
            }
        }


        String subtotal = String.valueOf(sub);
        int size = subtotal.length();
        if(subtotal.charAt(size - 1) == '.'){
            subtotal += "00";
        }else if(subtotal.charAt(size - 2) == '.'){
            subtotal += "0";
        }

        subTotalTxt = new Text("Sub-Total: $" + subtotal);
        subTotalTxt.setX(730);
        subTotalTxt.setY(490);
        subTotalTxt.setStyle("-fx-font-size: 15px");


        String tax = String.valueOf((Math.round((sub * 0.0625) * 100) / 100.00));
        size = tax.length();
        if(tax.charAt(size - 1) == '.'){
            tax += "00";
        }else if(tax.charAt(size - 2) == '.'){
            tax += "0";
        }

        taxTxt = new Text("Tax: $" + tax);
        taxTxt.setX(730);
        taxTxt.setY(520);
        taxTxt.setStyle("-fx-font-size: 15px");


        String total = String.valueOf((Math.round((sub * 1.0625) * 100) / 100.00));
        size = total.length();
        if(total.charAt(size - 1) == '.'){
            total += "00";
        }else if(total.charAt(size - 2) == '.'){
            total += "0";
        }

        totalTxt = new Text("Total: $" + total);
        totalTxt.setX(730);
        totalTxt.setY(600);
        totalTxt.setStyle("-fx-font-size: 30px");

        Button payment = new Button("Payment");
        payment.setLayoutX(700);
        payment.setLayoutY(624);
        payment.setPrefWidth(300);
        payment.setPrefHeight(40);
        payment.setOnAction(e -> finishOrder());


        rootCashier.getChildren().addAll(leftRect, cashierText, exit, newOrder, cancelOrder, viewPrevious, memoBtn, rectRight, paymentRect);
        rootCashier.getChildren().add(centerScroll);
        rootCashier.getChildren().addAll(orderNumTitle, orderNum, orderNumLine, orderScroll);
        rootCashier.getChildren().addAll(payment, orderBorderLeft, paymentBorderTop, subTotalTxt, taxTxt, totalTxt, removeItem);
    }

    /**
     * Returns the cashier scene and resets the scene to its default look
     *
     * @return The cashier scene the class generated.
     */
    public Scene getScene(){
        centerScroll.setContent(menuPane);
        return cashier;
    }

    /**
     * Adjusts the screen to show buttons allowing you to select previous orders.
     * On a selection of an order, the scene will return to the default order screen of that specific order.
     */
    private void viewPreviousOrders(){
        TilePane previousOrders = new TilePane();
        previousOrders.setPrefColumns(4);
        previousOrders.setPadding(new Insets(30));
        previousOrders.setHgap(30);
        previousOrders.setVgap(30);
        previousOrders.setLayoutX(180);
        previousOrders.setLayoutY(25);
        previousOrders.setMaxWidth(600);
        previousOrders.setMaxHeight(550);

        for(Cashier cash : Orders){
            Button btn = new Button(String.valueOf(cash.orderNumber));
            btn.setTextAlignment(CENTER);
            btn.setPrefWidth(100);
            btn.setPrefHeight(100);
            btn.setStyle("-fx-background-color: #BA6433");
            btn.setOnAction(e -> PrimaryStage.setScene(cash.getScene()));

            previousOrders.getChildren().add(btn);
        }

        centerScroll.setContent(previousOrders);
    }

    /**
     * Alters the screen to allow for selection of payment option. On selection the order is completed and placed.
     */
    private void finishOrder(){
        if(!orderItems.isEmpty()) {
            Button cancel = new Button("Cancel");
            cancel.setPrefWidth(250);
            cancel.setPrefHeight(125);
            cancel.setStyle("-fx-background-color: RED");
            cancel.setOnAction(e -> centerScroll.setContent(menuPane));

            // Create buttons
            Button cash = new Button("Cash");
            cash.setPrefWidth(150);
            cash.setPrefHeight(150);
            cash.setStyle("-fx-background-color: lightgreen");
            cash.setOnAction(e -> {
                Random random = new Random();
                repo.addOrder(new Order(-1, (random.nextInt(1000) + 1), orderItems, (Math.round((sub * 1.0625) * 100) / 100.00), "cash", new Date(Calendar.getInstance().getTimeInMillis()), (int) employeeID));
                closeOrder();
            });

            Button card = new Button("Card");
            card.setPrefWidth(150);
            card.setPrefHeight(150);
            card.setStyle("-fx-background-color: orange");
            card.setOnAction(e -> {
                Random random = new Random();
                repo.addOrder(new Order(-1, (random.nextInt(1000) + 1), orderItems, (Math.round((sub * 1.0625) * 100) / 100.00), "credit_card", new Date(Calendar.getInstance().getTimeInMillis()), (int) employeeID));
                closeOrder();
            });

            // Create HBox for top buttons
            HBox topHBox = new HBox(20); // 20 pixels spacing
            topHBox.setPadding(new Insets(200, 0, 0, 65));
            topHBox.getChildren().addAll(cash);
            HBox.setMargin(card, new Insets(0, 0, 0, 100)); // Adjust margin for spacing
            topHBox.getChildren().addAll(card);

            // Create VBox for the bottom button
            VBox bottomVBox = new VBox();
            bottomVBox.setPadding(new Insets(75, 0, 0, 150));
            bottomVBox.getChildren().add(cancel);

            // Create a BorderPane to combine everything
            BorderPane borderPane = new BorderPane();
            borderPane.setTop(topHBox);
            borderPane.setCenter(bottomVBox);
            centerScroll.setContent(borderPane);
        }
    }

    /**
     * Handles the possible errors from taking in user input for a memo.
     * If no memo exists on the latest item, it adds a memo to it.
     * If a memo does exist on the latest item, it edits the existing memo rather than creating a new one.
     *
     * @param memo popup that closes upon a successful memo, remains open otherwise.
     * @param memoField User input field that must contain a successful input to continue forward with the memo.
     */
    private void finishMemo(TextField memoField, Popup memo){
        int size = orderPane.getChildren().size();
        String input = memoField.getText();

        if((!(orderPane.getChildren().isEmpty())) && (orderPane.getChildren().get(size - 2) instanceof Text)){
            if(input.length() > 25){
                memoError.setText("Error: Maximum memo size: 25 characters");
            }else if(input.isEmpty()){
                memoError.setText("Error: Empty Memo");
            }else{
                if ((!(orderPane.getChildren().isEmpty())) && (orderPane.getChildren().get(size - 2) instanceof Text)) {
                    ((Text) orderPane.getChildren().get(size - 2)).setText(input);
                    memo.hide();
                    memoField.clear();
                    memoError.setText("");
                }else{
                    memoError.setText("Error: Nothing to memo");
                }
            }
        }else{
            if (input.length() > 25) {
                memoError.setText("Error: Maximum memo size: 25 characters");
            } else if (input.isEmpty()) {
                memoError.setText("Error: Empty Memo");
            } else {
                if ((!(orderPane.getChildren().isEmpty())) && (orderPane.getChildren().get(size - 2) instanceof TextFlow)) {
                    orderPane.getChildren().addAll(new Text(input), new Text(""));
                    memo.hide();
                    memoField.clear();
                    memoError.setText("");
                } else {
                    memoError.setText("Error: Nothing to memo");
                }
            }
        }
    }

    /**
     * Handles deleting the Menu Items in the delete lists.
     * This may result in the items in the orderItems list being
     * out of order when compared to the visual order, however the items will remain the same.
     */
    private void deleteItems(){
        for(Text txt : deleteText){
            int index = orderPane.getChildren().indexOf(txt);
            if( (index + 2 < orderPane.getChildren().size()) && (orderPane.getChildren().get(index + 2) instanceof Text) && (((Text) orderPane.getChildren().get(index + 2)).getText().equals(""))){
                orderPane.getChildren().remove(index + 1, index + 3);
            }
            orderPane.getChildren().remove(txt);
        }
        for(TextFlow txt : deleteTextHolder){
            orderPane.getChildren().remove(txt);
        }
        for(MenuItem item : deleteOrderItems){
            orderItems.remove(item);
            updateTotals(-1* item.getPrice());
        }
        deleteText.clear();
        deleteTextHolder.clear();
        deleteOrderItems.clear();
    }

    /**
     * Opens a new order and displays it without closing and deleting the current one.
     */
    private void openNewOrder(){
        Cashier newCashier = new Cashier(PrimaryStage, exit, employeeID);
        PrimaryStage.setScene(newCashier.getScene());
    }

    /**
     * Updates the displayed total for the order. This includes sub-total, tax, and total.
     * Handles issues when changing from string to float.
     *
     * @param cost The amount you want to add to the subtotal
     */
    public void updateTotals(double cost){
        sub += cost;

        String subtotal = String.valueOf(sub);
        int size = subtotal.length();
        if(subtotal.charAt(size - 1) == '.'){
            subtotal += "00";
        }else if(subtotal.charAt(size - 2) == '.'){
            subtotal += "0";
        }
        subTotalTxt.setText("Sub-Total: $" + subtotal);

        String tax = String.valueOf((Math.round((sub * 0.0625) * 100) / 100.00));
        size = tax.length();
        if(tax.charAt(size - 1) == '.'){
            tax += "00";
        }else if(tax.charAt(size - 2) == '.'){
            tax += "0";
        }
        taxTxt.setText("Tax: $" + tax);

        String total = String.valueOf((Math.round((sub * 1.0625) * 100) / 100.00));
        size = total.length();
        if(total.charAt(size - 1) == '.'){
            total += "00";
        }else if(total.charAt(size - 2) == '.'){
            total += "0";
        }
        totalTxt.setText("Total: $" + total);
    }

    /**
     * Removes order
     * If no previous orders exist it opens a new one
     * If a previous order does exist it reopens the last one automatically.
     * Intended as a quick fix for accidental presses of the new order button.
     */
    private void cancelOrder(){
        Orders.remove(this);
        if(Orders.isEmpty()) {
            openNewOrder();
        }else{
            PrimaryStage.setScene(Orders.getLast().getScene());
        }
    }

    /**
     * Finishes off the order by removing it from the open orders and opens a new one for the next customer
     */
    private void closeOrder(){
        Orders.remove(this);
        openNewOrder();
    }
}
