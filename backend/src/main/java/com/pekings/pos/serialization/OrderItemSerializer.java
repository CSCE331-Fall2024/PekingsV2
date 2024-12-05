package com.pekings.pos.serialization;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.pekings.pos.entities.OrderItem;

import java.io.IOException;

/**
 * Custom serializer for the {@link OrderItem} entity.
 * Converts an {@link OrderItem} object into a JSON representation with specific fields.
 * This serializer is used to control how {@link OrderItem} instances are serialized to JSON.
 */
public class OrderItemSerializer extends JsonSerializer<OrderItem> {

    /**
     * Serializes an {@link OrderItem} object into JSON format.
     *
     * The JSON structure includes:
     * - `id`: The ID of the {@link OrderItem}.
     * - `order_id`: The ID of the associated {@link com.pekings.pos.entities.Order}.
     * - `menu_item_id`: The ID of the associated {@link com.pekings.pos.entities.MenuItem}.
     * - `extras`: A list of associated {@link com.pekings.pos.entities.OrderInventory} objects representing extra ingredients.
     *
     * Example Output:
     * <pre>
     * {
     *     "id": 1,
     *     "order_id": 101,
     *     "menu_item_id": 5,
     *     "extras": [
     *         {
     *             "id": 10,
     *             "ingredient_id": 3,
     *             "amount": 2
     *         },
     *         {
     *             "id": 11,
     *             "ingredient_id": 4,
     *             "amount": 1
     *         }
     *     ]
     * }
     * </pre>
     *
     * @param orderItem           The {@link OrderItem} object to serialize.
     * @param jsonGenerator       The {@link JsonGenerator} used to write the JSON output.
     * @param serializerProvider  The {@link SerializerProvider} that can provide serializers for serializing objects.
     * @throws IOException If an input/output exception occurs during serialization.
     */
    @Override
    public void serialize(OrderItem orderItem, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        jsonGenerator.writeStartObject();
        jsonGenerator.writeObjectField("id", orderItem.getId());
        jsonGenerator.writeObjectField("order_id", orderItem.getOrder().getId());
        jsonGenerator.writeObjectField("menu_item_id", orderItem.getMenuItem().getId());
        jsonGenerator.writeObjectField("extras", orderItem.getExtras());
        jsonGenerator.writeEndObject();
    }
}
