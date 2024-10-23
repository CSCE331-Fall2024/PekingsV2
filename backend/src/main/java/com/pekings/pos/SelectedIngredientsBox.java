package com.pekings.pos;

import com.pekings.pos.object.Ingredient;
import javafx.scene.control.CheckBox;

import java.util.HashMap;
import java.util.Map;

public class SelectedIngredientsBox {
    private final Ingredient ingredient;
    private final Manager manager;
    private final CheckBox checkBox;

    /**
     * Stores all arguments permanently in variables.
     * Creates a checkbox with the proper ingredient and sets a default state.
     *
     * @param ingredient The ingredient to be displayed beside a checkbox.
     * @param manager The screen to add the checkboxes to.
     */
    public SelectedIngredientsBox(Ingredient ingredient, Manager manager) {
        this.ingredient = ingredient;
        this.manager = manager;

        checkBox = new CheckBox(ingredient.getName());
        checkBox.setSelected(manager.checkBoxStates.getOrDefault(ingredient, false));
    }

    /**
     * Returns the stored checkbox
     *
     * @return A checkbox connected with an Ingredient
     */
    public CheckBox getCheckBox() {
        return checkBox;
    }

    /**
     * Returns the stored ingredient
     *
     * @return The ingredient given to the class
     */
    public Ingredient getIngredient() {
        return ingredient;
    }

    /**
     * Returns the manager scene this checkbox was linked to
     *
     * @return The manager screen that called this class
     */
    public Manager getManager() {
        return manager;
    }
}
