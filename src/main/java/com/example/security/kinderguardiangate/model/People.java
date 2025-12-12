package com.example.security.kinderguardiangate.model;

import jakarta.persistence.*;

@Entity
public class People {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String icNumber;
    private String name;

    // Default constructor
    public People() {
    }

    // Constructor with fields
    public People(String icNumber, String name) {
        this.icNumber = icNumber;
        this.name = name;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIcNumber() {
        return icNumber;
    }

    public void setIcNumber(String icNumber) {
        this.icNumber = icNumber;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
