package com.pekings.pos.serialization;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.pekings.pos.entities.Order;

import java.io.IOException;

public class OrderSerializer extends JsonSerializer<Order> {

    @Override
    public void serialize(Order order, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        jsonGenerator.writeStartObject();
        jsonGenerator.writeObjectField("order_id", order.getId());
        jsonGenerator.writeObjectField("customer_id", order.getCustomer().getId());
        jsonGenerator.writeObjectField("employee_id", order.getEmployee().getId());
        jsonGenerator.writeObjectField("time", order.getOrderTime().toString());
        jsonGenerator.writeObjectField("price", order.getPrice());
        jsonGenerator.writeEndObject();
    }

}
