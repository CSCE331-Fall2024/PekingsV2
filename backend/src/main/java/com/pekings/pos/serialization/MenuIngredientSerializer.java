package com.pekings.pos.serialization;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.pekings.pos.entities.MenuIngredient;

import java.io.IOException;

public class MenuIngredientSerializer extends JsonSerializer<MenuIngredient> {

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
