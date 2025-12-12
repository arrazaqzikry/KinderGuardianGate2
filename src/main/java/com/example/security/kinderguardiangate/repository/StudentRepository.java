package com.example.security.kinderguardiangate.repository;

import com.example.security.kinderguardiangate.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> { }
