package com.escolaTi.escola_ti_tema_6.curso;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CursoService {

    private final CursoRepository cursoRepository;

    @Transactional
    public Curso criarCurso(Curso curso){
        curso.getDisciplinas().forEach(disciplina -> disciplina.setCurso(curso));
        return cursoRepository.save(curso);
    }

    @Transactional
    public List<Curso> listarTodos() {
        return cursoRepository.findAll();
    }

    @Transactional
    public Curso buscarPorId(Long id) {
        return cursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curso não encontrado com o ID: " + id));
    }

    @Transactional
    public Curso atualizarCurso(Long id, Curso cursoDetalhes) {
        Curso cursoExistente = buscarPorId(id);

        cursoExistente.setNome(cursoDetalhes.getNome());
        cursoExistente.setCargaHoraria(cursoDetalhes.getCargaHoraria());
        cursoExistente.setDataInicio(cursoDetalhes.getDataInicio());

        cursoExistente.getDisciplinas().clear();
        cursoDetalhes.getDisciplinas().forEach(disciplina -> {
            cursoExistente.addDisciplina(disciplina);
        });

        return cursoRepository.save(cursoExistente);
    }

    @Transactional
    public void deletarCurso(Long id) {
        if (!cursoRepository.existsById(id)) {
            throw new RuntimeException("Curso não encontrado com o ID: " + id);
        }
        cursoRepository.deleteById(id);
    }
}
