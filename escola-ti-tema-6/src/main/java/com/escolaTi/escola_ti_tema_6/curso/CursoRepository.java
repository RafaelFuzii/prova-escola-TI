package com.escolaTi.escola_ti_tema_6.curso;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CursoRepository extends JpaRepository<Curso, Long> {

    void adicionarDisciplina(String nome);
}
