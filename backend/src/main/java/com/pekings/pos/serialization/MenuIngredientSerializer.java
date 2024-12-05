package com.pekings.pos.serialization;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.pekings.pos.entities.MenuIngredient;

import java.io.IOException;

/**
 * Custom serializer for the {@link MenuIngredient} entity.
 * Converts a {@link MenuIngredient} object into a JSON representation with specific fields.
 * This serializer is used to control how {@link MenuIngredient} instances are serialized to JSON.
 */
public class MenuIngredientSerializer extends JsonSerializer<MenuIngredient> {

    /**
     * Serializes a {@link MenuIngredient} object into JSON format.
     *
     * The JSON structure includes:
     * - `id`: The ID of the {@link MenuIngredient}.
     * - `ingredient`: The ID of the associated {@link com.pekings.pos.entities.Inventory} ingredient.
     * - `amount`: The amount of the ingredient used in the menu item.
     * - `menu_item`: The ID of the associated {@link com.pekings.pos.entities.MenuItem}.
     *
     * Example Output:
     * <pre>
     * {
     *     "id": 1,
     *     "ingredient": 5,
     *     "amount": 3,
     *     "menu_item": 2
     * }
     * </pre>
     *
     * @param menuIngredient      The {@link MenuIngredient} object to serialize.
     * @param jsonGenerator       The {@link JsonGenerator} used to write the JSON output.
     * @param serializerProvider  The {@link SerializerProvider} that can provide serializers for serializing objects.
     * @throws IOException If an input/output exception occurs during serialization.
     */
    @Override
    public void serialize(MenuIngredient menuIngredient, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        jsonGenerator.writeStartObject();
        jsonGenerator.writeObjectField("id", menuIngredient.getId());
        jsonGenerator.writeObjectField("ingredient", menuIngredient.getIngredient().getId());
        jsonGenerator.writeObjectField("amount", menuIngredient.getAmount());
        jsonGenerator.writeObjectField("menu_item", menuIngredient.getMenuItem().getId());
        jsonGenerator.writeEndObject();
    }
}
