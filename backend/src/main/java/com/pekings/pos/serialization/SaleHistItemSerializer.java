package com.pekings.pos.serialization;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.pekings.pos.util.SaleHistoryItem;

import java.io.IOException;

public class SaleHistItemSerializer extends JsonSerializer<SaleHistoryItem> {

    @Override
    public void serialize(SaleHistoryItem saleHistoryItem, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        jsonGenerator.writeObjectField("menu_item_id", saleHistoryItem.getMenuItemID());
        jsonGenerator.writeObjectField("name", saleHistoryItem.getName());
        jsonGenerator.writeObjectField("revenue", saleHistoryItem.getTotalRevenue());
        jsonGenerator.writeObjectField("total_orders", saleHistoryItem.getTotalOrders());
    }
}
