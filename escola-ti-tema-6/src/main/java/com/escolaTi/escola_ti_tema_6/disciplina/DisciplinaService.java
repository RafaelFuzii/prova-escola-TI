package com.escolaTi.escola_ti_tema_6.disciplina;

import com.escolaTi.escola_ti_tema_6.curso.Curso;
import com.escolaTi.escola_ti_tema_6.curso.CursoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DisciplinaService {

    private final DisciplinaRepository disciplinaRepository;

    private final CursoRepository cursoRepository; // Necessário para associar a um curso

    @Transactional
    public List<Disciplina> listarTodas() {
        return disciplinaRepository.findAll();
    }

    @Transactional
    public Disciplina buscarPorId(Long id) {
        return disciplinaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Disciplina não encontrada com o ID: " + id));
    }

    public Long buscarIdPeloNome(String nome) {
        Disciplina disciplina = disciplinaRepository.findByNome(nome)
                .orElseThrow(() -> new RuntimeException("Disciplina não encontrada com o nome: " + nome));

        return disciplina.getId();
    }

    @Transactional
    public Disciplina criarDisciplina(Disciplina disciplina, Long cursoId) {
        Curso curso = cursoRepository.findById(cursoId)
                .orElseThrow(() -> new RuntimeException("Curso não encontrado com o ID: " + cursoId));

        disciplina.setCurso(curso);
        return disciplinaRepository.save(disciplina);
    }

    @Transactional
    public Disciplina atualizarDisciplina(Long id, Disciplina disciplinaDetalhes) {
        Disciplina disciplinaExistente = buscarPorId(id);

        disciplinaExistente.setNome(disciplinaDetalhes.getNome());

        return disciplinaRepository.save(disciplinaExistente);
    }

    @Transactional
    public void deletarDisciplina(String name) {
        disciplinaRepository.deleteById(buscarIdPeloNome(name));
    }
}
