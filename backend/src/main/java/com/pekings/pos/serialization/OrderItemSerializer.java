package com.pekings.pos.serialization;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.pekings.pos.entities.OrderItem;

import java.io.IOException;

public class OrderItemSerializer extends JsonSerializer<OrderItem> {
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
