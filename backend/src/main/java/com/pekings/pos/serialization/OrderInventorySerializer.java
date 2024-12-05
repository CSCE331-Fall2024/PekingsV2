package com.pekings.pos.serialization;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.pekings.pos.entities.OrderInventory;

import java.io.IOException;

/**
 * Custom serializer for the {@link OrderInventory} entity.
 * Converts an {@link OrderInventory} object into a JSON representation with specific fields.
 * This serializer is used to control how {@link OrderInventory} instances are serialized to JSON.
 */
public class OrderInventorySerializer extends JsonSerializer<OrderInventory> {

    /**
     * Serializes an {@link OrderInventory} object into JSON format.
     *
     * The JSON structure includes:
     * - `id`: The ID of the {@link OrderInventory}.
     * - `order_item_id`: The ID of the associated {@link com.pekings.pos.entities.OrderItem}.
     * - `ingredient_id`: The ID of the associated {@link com.pekings.pos.entities.Inventory} ingredient.
     * - `amount`: The quantity of the ingredient used in the order item.
     *
     * Example Output:
     * <pre>
     * {
     *     "id": 1,
     *     "order_item_id": 10,
     *     "ingredient_id": 5,
     *     "amount": 3
     * }
     * </pre>
     *
     * @param item                The {@link OrderInventory} object to serialize.
     * @param jsonGenerator       The {@link JsonGenerator} used to write the JSON output.
     * @param serializerProvider  The {@link SerializerProvider} that can provide serializers for serializing objects.
     * @throws IOException If an input/output exception occurs during serialization.
     */
    @Override
    public void serialize(OrderInventory item, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        jsonGenerator.writeStartObject();
        jsonGenerator.writeObjectField("id", item.getId());
        jsonGenerator.writeObjectField("order_item_id", item.getOrderItem().getId());
        jsonGenerator.writeObjectField("ingredient_id", item.getIngredient().getId());
        jsonGenerator.writeObjectField("amount", item.getAmount());
        jsonGenerator.writeEndObject();
    }
}
