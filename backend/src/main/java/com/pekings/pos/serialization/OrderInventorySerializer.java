package com.pekings.pos.serialization;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.pekings.pos.entities.OrderInventory;

import java.io.IOException;

public class OrderInventorySerializer extends JsonSerializer<OrderInventory> {

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
