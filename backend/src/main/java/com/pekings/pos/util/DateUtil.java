package com.pekings.pos.util;

import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Calendar;

/**
 * Utility class for handling common date and time operations.
 * Provides methods for parsing, manipulating, and obtaining specific date and time values.
 */
public class DateUtil {

    // Defines a date format for parsing and formatting dates.
    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

    /**
     * Parses a string into a {@link Date} object using the format "yyyy-MM-dd".
     *
     * @param s The date string to parse.
     * @return A {@link Date} object representing the parsed date, or {@code null} if parsing fails.
     */
    public static Date fromString(String s) {
        try {
            return new Date(dateFormat.parse(s).getTime());
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Adds one day to the given {@link Date}.
     *
     * @param date The date to which a day will be added.
     * @return A new {@link Date} object representing the next day.
     */
    public static Date addDay(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.DAY_OF_YEAR, 1);
        return new Date(calendar.getTimeInMillis());
    }

    /**
     * Provides the starting instant for the application data range (January 1, 2024).
     *
     * @return An {@link Instant} representing the start of the data range.
     */
    public static Instant startOfData() {
        Calendar calendar = Calendar.getInstance();
        calendar.set(2024, Calendar.JANUARY, 1);
        return calendar.toInstant();
    }

    /**
     * Provides the ending instant for the application data range (December 31, 2024).
     *
     * @return An {@link Instant} representing the end of the data range.
     */
    public static Instant endOfData() {
        Calendar calendar = Calendar.getInstance();
        calendar.set(2024, Calendar.DECEMBER, 31);
        return calendar.toInstant();
    }

    /**
     * Computes the start of the day (midnight) for a given instant.
     *
     * @param instant The {@link Instant} for which the start of the day is calculated.
     * @return An {@link Instant} representing the start of the day (midnight).
     */
    public static Instant startOfDay(Instant instant) {
        Instant now = Instant.now();
        ZonedDateTime zonedDateTime = now.atZone(ZoneId.systemDefault());
        LocalDate localDate = zonedDateTime.toLocalDate();
        ZonedDateTime midnight = localDate.atStartOfDay(ZoneId.systemDefault());
        return midnight.toInstant();
    }

    public static Instant endOfDay(Instant instant) {
        ZonedDateTime zonedDateTime = instant.atZone(ZoneId.systemDefault());
        LocalDate localDate = zonedDateTime.toLocalDate();
        ZonedDateTime endOfDay = localDate.atTime(LocalTime.MAX).atZone(ZoneId.systemDefault());
        return endOfDay.toInstant();
    }

}
