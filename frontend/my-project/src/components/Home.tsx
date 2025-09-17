import { useEffect, useState } from 'react';
import { Fab, TextField } from '@mui/material';
import Disciplina from './Disciplina';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import Cursos from './Cursos';

interface DisciplinaState {
  id: string;
  nome: string;
}

interface CursoData {
    id: string;
    nome: string;
    cargaHoraria: string;
    dataInicio: string;
    disciplinas: { nome: string }[];
}

export default function Home() {
    const [nomeCurso, setNomeCurso] = useState('')
    const [cargaHoraria, setCargaHoraria] = useState('')
    const [dataInicio, setDataInicio] = useState('')
    const [disciplinas, setDisciplinas] = useState<Array<DisciplinaState>>([]);
    const [cursosCriados, setCursosCriados] = useState<CursoData[]>([])
    const [disciplinaNome, setDisciplinaNome] = useState('')
    const [cursoSelecionado, setCursoSelecionado] = useState<string>('');

    useEffect(() => {
        async function fetchCursos() {
            const response = await axios.get('http://localhost:8080/api/curso')
            setCursosCriados(response.data)
        }
        fetchCursos();
    }, [])

    const handleDeleteCurso = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este curso?')) {
            await axios.delete(`http://localhost:8080/api/curso/${id}`);
            setCursosCriados(prevCursos => prevCursos.filter(curso => curso.id !== id));
        }
    };

    const handleUpdateCurso = async (id: string, data: { nome: string; cargaHoraria: string; dataInicio: string; disciplinas: { nome: string }[] }) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/curso/${id}`, data);
            setCursosCriados(prevCursos =>
                prevCursos.map(curso => (curso.id === id ? response.data : curso))
            );
        } catch (error) {
            console.error("Falha ao atualizar o curso", error);
            alert("Não foi possível atualizar o curso.");
        }
    };

    async function handleSubmitCurso(e: React.FormEvent) {
        e.preventDefault();

        if (disciplinas.some(d => d.nome.trim() === '')) {
            alert("Por favor, preencha o nome de todas as disciplinas.");
            return;
        }

        const novoCursoData = {
            nome: nomeCurso,
            cargaHoraria,
            dataInicio,
            disciplinas: disciplinas.map(d => ({ nome: d.nome }))
        };

        const response = await axios.post('http://localhost:8080/api/curso', novoCursoData);
        setCursosCriados(cursos => [...cursos, response.data]);
        console.log("Curso criado com sucesso:", response.data);
        resetForm();
    }

    async function handleAddDisciplina() {
        if (!disciplinaNome || !cursoSelecionado) {
            alert('Selecione um curso e digite o nome da disciplina.');
            return;
        }
        const payload = {
            nome: disciplinaNome,
            idCurso: cursoSelecionado
        };
        await axios.post(`http://localhost:8080/api/disciplinas?cursoId=${payload.idCurso}`, payload);
        alert('Disciplina adicionada com sucesso!');
        setDisciplinaNome('');
        setCursoSelecionado('');

        const response = await axios.get('http://localhost:8080/api/curso');
        setCursosCriados(response.data);
    }

    function handleCreateDisciplina() {
        setDisciplinas(prev => [
            ...prev,
            { id: uuidv4(), nome: '' }
        ]); 
    }

    function handleRemoveDisciplina(id: string) {
        setDisciplinas(prev => prev.filter(d => d.id !== id));
    }

    function handleUpdateDisciplina(id: string, nome: string) {
        setDisciplinas(prev => 
            prev.map(disciplina => 
                disciplina.id === id ? { ...disciplina, nome } : disciplina
            )
        );
    }

    function resetForm() {
        setNomeCurso('');
        setCargaHoraria('');
        setDataInicio('');
        setDisciplinas([]);
    }

    return (
        <>
            {/*Criar Curso */}
            <div className={`bg-gray-900 min-h-screen flex justify-center items-start pt-20 sm:pt-40`}>
                <form onSubmit={handleSubmitCurso} className='w-full max-w-3xl p-4'>
                    <div className="space-y-12">
                        <div className="border-b border-white/10 pb-12">
                            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl text-center mb-10">
                                Crie O Seu Curso
                            </h1>

                            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="sm:col-span-6">
                                    <TextField
                                        label="Nome do Curso"
                                        variant="filled"
                                        fullWidth
                                        value={nomeCurso}
                                        onChange={(e) => setNomeCurso(e.target.value)}
                                        InputLabelProps={{ style: { color: '#A0A0A0' } }}
                                        InputProps={{ style: { color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.05)' } }}
                                    />
                                </div>

                                <div className="sm:col-span-3">
                                    <TextField
                                        label="Carga Horária do Curso"
                                        variant="filled"
                                        fullWidth
                                        value={cargaHoraria}
                                        onChange={(e) => setCargaHoraria(e.target.value)}
                                        InputLabelProps={{ style: { color: '#A0A0A0' } }}
                                        InputProps={{ style: { color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.05)' } }}
                                    />
                                </div>

                                <div className="sm:col-span-3">
                                    <TextField
                                        label="Data de Início"
                                        type="date"
                                        variant="filled"
                                        fullWidth
                                        value={dataInicio}
                                        onChange={(e) => setDataInicio(e.target.value)}
                                        InputLabelProps={{ shrink: true, style: { color: '#A0A0A0' } }}
                                        InputProps={{ style: { color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.05)' } }}
                                    />
                                </div>

                                <div className="sm:col-span-6 space-y-4">
                                    {disciplinas.map((disciplina) => (
                                        <Disciplina key={disciplina.id} id={disciplina.id} nome={disciplina.nome} onRemove={handleRemoveDisciplina} onUpdate={handleUpdateDisciplina}/>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <Fab variant="extended" color="primary" type="submit">
                                Salvar Curso
                            </Fab>
                            <Fab variant="extended" color="primary" onClick={handleCreateDisciplina}>
                                Adicionar Disciplina
                            </Fab>
                        </div>
                    </div>
                </form>
            </div>

            {/*Criar Disciplinas */}
            {cursosCriados.length > 0 && (
            <div className={`bg-gray-900 min-h-screen flex justify-center items-start pt-20 sm:pt-40`}>
                <form className='w-full max-w-3xl p-4'>
                    <div className="space-y-12">
                        <div className="border-b border-white/10 pb-12">
                            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl text-center mb-10">
                                Crie Disciplina
                            </h1>
                            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="sm:col-span-6">
                                    <TextField
                                        label="Nome da Disciplina"
                                        variant="filled"
                                        fullWidth
                                        value={disciplinaNome}
                                        onChange={(e) => setDisciplinaNome(e.target.value)}
                                        InputLabelProps={{ style: { color: '#A0A0A0' } }}
                                        InputProps={{ style: { color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.05)' } }}
                                    />
                                </div>
                                <div className="sm:col-span-6 mt-4">
                                    <select
                                        value={cursoSelecionado}
                                        onChange={e => setCursoSelecionado(e.target.value)}
                                        className="w-full p-2 rounded bg-gray-800 text-white"
                                    >
                                        <option value="">Selecione o curso</option>
                                        {cursosCriados.map(curso => (
                                            <option key={curso.id} value={curso.id}>{curso.nome}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="sm:col-span-6 mt-4">
                                    <Fab variant="extended" color="primary" type="submit" onClick={handleAddDisciplina}>
                                        Adicionar Disciplina ao Curso
                                    </Fab>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>)}

            {cursosCriados.length > 0 && (
            <div className="mt-10 w-full max-w-3xl p-4 mx-auto">
                <h2 className="text-3xl font-semibold text-white text-center">Cursos Criados</h2>
                <div className="mt-8 space-y-6">
                    {cursosCriados.map((curso, index) => (
                        <Cursos
                            key={curso.id || index}
                            id={curso.id}
                            curso={curso.nome}
                            cargaHoraria={curso.cargaHoraria}
                            dataInicio={curso.dataInicio}
                            nomeDisciplinas={curso.disciplinas.map(d => d.nome)}
                            onDelete={handleDeleteCurso}
                            onUpdate={handleUpdateCurso}
                        />
                    ))}
                </div>
            </div>
            )}
        </>
    );
}