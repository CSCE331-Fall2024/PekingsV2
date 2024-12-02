package com.pekings.pos.serialization;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.pekings.pos.entities.Order;

import java.io.IOException;

/**
 * Custom serializer for the {@link Order} entity.
 * Converts an {@link Order} object into a JSON representation with specific fields.
 * This serializer is used to control how {@link Order} instances are serialized to JSON.
 */
public class OrderSerializer extends JsonSerializer<Order> {

    /**
     * Serializes an {@link Order} object into JSON format.
     *
     * The JSON structure includes:
     * - `order_id`: The unique ID of the {@link Order}.
     * - `customer_id`: The ID of the associated {@link com.pekings.pos.entities.Customer}.
     * - `employee_id`: The ID of the associated {@link com.pekings.pos.entities.Employee}.
     * - `time`: The timestamp of the order as a string.
     * - `price`: The total price of the order.
     * - `status`: The current status of the order (e.g., "completed", "incomplete").
     * - `items`: A list of associated {@link com.pekings.pos.entities.OrderItem} entities in the order.
     *
     * Example Output:
     * <pre>
     * {
     *     "order_id": 101,
     *     "customer_id": 503,
     *     "employee_id": 3,
     *     "time": "2024-12-01T14:30:00Z",
     *     "price": 42.50,
     *     "status": "completed",
     *     "items": [
     *         {
     *             "id": 1,
     *             "menu_item_id": 5,
     *             "extras": [ ... ]
     *         },
     *         {
     *             "id": 2,
     *             "menu_item_id": 6,
     *             "extras": [ ... ]
     *         }
     *     ]
     * }
     * </pre>
     *
     * @param order               The {@link Order} object to serialize.
     * @param jsonGenerator       The {@link JsonGenerator} used to write the JSON output.
     * @param serializerProvider  The {@link SerializerProvider} that can provide serializers for serializing objects.
     * @throws IOException If an input/output exception occurs during serialization.
     */
    @Override
    public void serialize(Order order, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        jsonGenerator.writeStartObject();
        jsonGenerator.writeObjectField("order_id", order.getId());
        jsonGenerator.writeObjectField("customer_id", order.getCustomer().getId());
        jsonGenerator.writeObjectField("employee_id", order.getEmployee().getId());
        jsonGenerator.writeObjectField("time", order.getTime().toString());
        jsonGenerator.writeObjectField("price", order.getPrice());
        jsonGenerator.writeObjectField("status", order.getStatus());
        jsonGenerator.writeObjectField("items", order.getItems());
        jsonGenerator.writeEndObject();
    }
}
