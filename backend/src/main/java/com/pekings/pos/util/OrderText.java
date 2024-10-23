package com.pekings.pos.util;

import com.pekings.pos.Cashier;
import com.pekings.pos.object.MenuItem;
import javafx.scene.layout.TilePane;
import javafx.scene.paint.Color;
import javafx.scene.text.Text;
import javafx.scene.text.TextFlow;

public class OrderText {
    boolean clicked = false;

    /**
     * Adds the text to the orderPane on function call.
     * Allows for the text to be selectable and deletable from the order.
     * Updates the order total.
     *
     * @param pane The pane to add the menu item to as a part of the order.
     * @param cashier The screen to add all necessary information to.
     * @param item The menu item the text will represent on the order screen.
     */
    public OrderText(Cashier cashier, MenuItem item, TilePane pane){
        TextFlow textHolder = new TextFlow();
        Text txt = new Text(item.getName());
        textHolder.getChildren().add(txt);
        textHolder.setPrefWidth(150);
        pane.getChildren().add(textHolder);

        cashier.updateTotals(item.getPrice());

        String price = String.valueOf(item.getPrice());
        int size = price.length();
        if(price.charAt(size - 1) == '.'){
            price += "00";
        }else if(price.charAt(size - 2) == '.'){
            price += "0";
        }
        price = "$" + price;
        Text priceTxt = new Text(price);
        pane.getChildren().add(priceTxt);

        cashier.orderItems.add(item);

        txt.setOnMouseClicked(m ->
        {
            if(!clicked) {
                txt.setFill(Color.DARKBLUE);
                priceTxt.setFill(Color.DARKBLUE);

                cashier.deleteTextHolder.add(textHolder);
                cashier.deleteText.add(priceTxt);

                cashier.deleteOrderItems.add(item);
            }else{
                txt.setFill(Color.BLACK);
                priceTxt.setFill(Color.BLACK);

                cashier.deleteTextHolder.remove(textHolder);
                cashier.deleteText.remove(priceTxt);

                cashier.deleteOrderItems.remove(item);
            }
            clicked = !clicked;
        });
    }
}
