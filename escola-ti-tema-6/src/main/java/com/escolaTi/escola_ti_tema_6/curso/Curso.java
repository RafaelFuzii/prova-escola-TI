package com.escolaTi.escola_ti_tema_6.curso;

import com.escolaTi.escola_ti_tema_6.disciplina.Disciplina;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tb_curso")
public class Curso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private int cargaHoraria;
    private Date dataInicio;

    @OneToMany(
            mappedBy = "curso",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Disciplina> disciplinas = new ArrayList<>();

    public void addDisciplina(Disciplina disciplina) {
        this.disciplinas.add(disciplina);
        disciplina.setCurso(this);
    }

    public void removeDisciplina(Disciplina disciplina) {
        this.disciplinas.remove(disciplina);
        disciplina.setCurso(null);
    }
}
