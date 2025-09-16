package com.escolaTi.escola_ti_tema_6.curso;
import com.escolaTi.escola_ti_tema_6.disciplina.DisciplinaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CursoService {

    private final CursoRepository cursoRepository;
    private final DisciplinaRepository disciplinaRepository;

    public void criarCurso(Curso curso) {
        cursoRepository.save(curso);
    }

    public List<Curso> listarCursos(){
       return cursoRepository.findAll();
    }

    public void addDisciplina(String nomeDisciplina){
        disciplinaRepository.findByNome(nomeDisciplina).orElseThrow(
                () -> new RuntimeException("Disciplina não encontrado")
        );
    }
}
