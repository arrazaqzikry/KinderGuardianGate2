package com.example.security.kinderguardiangate.repository;

import com.example.security.kinderguardiangate.model.People;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PeopleRepository extends JpaRepository<People, Long> {
    Optional<People> findByIcNumber(String icNumber);
}
