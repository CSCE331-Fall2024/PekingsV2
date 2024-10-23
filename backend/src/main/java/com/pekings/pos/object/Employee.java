package com.pekings.pos.object;

import java.sql.Date;
import java.sql.Time;
import java.util.Objects;

public class Employee {

    private final long id;
    private final String username;
    private final String password;
    private final String position;
    private final Time lastClockIn;
    private final boolean clockedIn;

    public Employee(long id, String username, String password, String position, Time lastClockIn, boolean clockedIn) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.position = position;
        this.lastClockIn = lastClockIn;
        this.clockedIn = clockedIn;
    }

    public long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public String getPosition() {
        return position;
    }

    public Time getLastClockIn() {
        return lastClockIn;
    }

    public boolean isClockedIn() {
        return clockedIn;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Employee other)) return false;

        return getId() == other.getId();
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
