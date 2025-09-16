package com.escolaTi.escola_ti_tema_6.curso;

import com.escolaTi.escola_ti_tema_6.disciplina.Disciplina;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/curso")
@RequiredArgsConstructor
public class CursoController {

    private final CursoService cursoService;

    @PostMapping
    public ResponseEntity<Void> criarCurso(@RequestBody Curso curso) {
        cursoService.criarCurso(curso);
        return ResponseEntity.ok().build();
    }

    @PostMapping
    public ResponseEntity<Void> adicionarDisciplinas(@RequestBody String disciplina) {
        cursoService.addDisciplina(disciplina);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public List<Curso> listarCursos(){
        return cursoService.listarCursos();
    }

}
