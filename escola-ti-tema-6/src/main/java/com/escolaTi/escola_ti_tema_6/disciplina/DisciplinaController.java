package com.escolaTi.escola_ti_tema_6.disciplina;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/disciplinas")
@RequiredArgsConstructor
public class DisciplinaController {

    private final DisciplinaService disciplinaService;

    @GetMapping
    public List<Disciplina> listarDisciplinas() {
        return disciplinaService.listarTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Disciplina> buscarDisciplinaPorId(@PathVariable Long id) {
        Disciplina disciplina = disciplinaService.buscarPorId(id);
        return ResponseEntity.ok(disciplina);
    }

    @PostMapping
    public ResponseEntity<Disciplina> criarDisciplina(@RequestParam Long cursoId, @RequestBody Disciplina disciplina) {
        Disciplina novaDisciplina = disciplinaService.criarDisciplina(disciplina, cursoId);
        return new ResponseEntity<>(novaDisciplina, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Disciplina> atualizarDisciplina(@PathVariable Long id, @RequestBody Disciplina disciplinaDetalhes) {
        Disciplina disciplinaAtualizada = disciplinaService.atualizarDisciplina(id, disciplinaDetalhes);
        return ResponseEntity.ok(disciplinaAtualizada);
    }

    @DeleteMapping("/{name}")
    public ResponseEntity<Void> deletarDisciplina(@PathVariable String name) {
        disciplinaService.deletarDisciplina(name);
        return ResponseEntity.noContent().build();
    }
}
