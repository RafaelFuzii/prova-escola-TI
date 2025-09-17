import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, TextField, IconButton, Box } from '@mui/material';
import axios from 'axios';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';

interface CursosProps {
    id: string;
    curso: string;
    cargaHoraria: string;
    dataInicio: string;
    nomeDisciplinas: string[];
    onUpdate: (id: string, data: {
        nome: string;
        cargaHoraria: string;
        dataInicio: string;
        disciplinas: { nome: string }[];
    }) => void;
    onDelete: (id: string) => void;
}

export default function Cursos({ id, curso, cargaHoraria, dataInicio, nomeDisciplinas, onUpdate, onDelete }: CursosProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({
        curso,
        cargaHoraria,
        dataInicio,
        nomeDisciplinas,
    });

    // Atualiza o estado editável quando props mudam (ex: após adicionar disciplina)
    useEffect(() => {
        setEditedData({
            curso,
            cargaHoraria,
            dataInicio,
            nomeDisciplinas,
        });
    }, [curso, cargaHoraria, dataInicio, nomeDisciplinas]);

    const handleDeleteDisciplina = async (disciplinaNome: string) => {
        try {
            await axios.delete(`http://localhost:8080/api/disciplinas/${encodeURIComponent(disciplinaNome)}`);
            setEditedData(prev => ({
                ...prev,
                nomeDisciplinas: prev.nomeDisciplinas.filter(nome => nome !== disciplinaNome)
            }));
        } catch (error) {
            alert('Erro ao excluir disciplina');
        }
    };

    const handleDisciplinaChange = (index: number, value: string) => {
        setEditedData(prev => {
            const novas = [...prev.nomeDisciplinas];
            novas[index] = value;
            return { ...prev, nomeDisciplinas: novas };
        });
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setEditedData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSave = () => {
        const dataToSend = {
            nome: editedData.curso,
            cargaHoraria: editedData.cargaHoraria,
            dataInicio: editedData.dataInicio,
            disciplinas: editedData.nomeDisciplinas.map(nome => ({ nome })),
        };
        onUpdate(id, dataToSend);
        setIsEditing(false);
    };

    return (
        <Card sx={{ maxWidth: 'lg', bgcolor: '#1f2937', color: 'white' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', p: 2 }}>
                {isEditing ? (
                    <Box component="div" sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField name="curso" label="Nome do Curso" variant="filled" value={editedData.curso} onChange={handleChange} fullWidth InputLabelProps={{style: {color: '#A0A0A0'}}} InputProps={{style: {color: 'white'}}}/>
                        <TextField name="cargaHoraria" label="Carga Horária" variant="filled" value={editedData.cargaHoraria} onChange={handleChange} fullWidth InputLabelProps={{style: {color: '#A0A0A0'}}} InputProps={{style: {color: 'white'}}}/>
                        <TextField name="dataInicio" label="Data de Início" type="date" variant="filled" value={editedData.dataInicio} onChange={handleChange} fullWidth InputLabelProps={{shrink: true, style: {color: '#A0A0A0'}}} InputProps={{style: {color: 'white'}}}/>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {editedData.nomeDisciplinas.map((nome, idx) => (
                                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <TextField
                                        label={`Disciplina ${idx + 1}`}
                                        variant="filled"
                                        value={nome}
                                        onChange={e => handleDisciplinaChange(idx, e.target.value)}
                                        fullWidth
                                        InputLabelProps={{ style: { color: '#A0A0A0' } }}
                                        InputProps={{ style: { color: 'white' } }}
                                    />
                                    <IconButton
                                        onClick={() => handleDeleteDisciplina(nome)}
                                        aria-label="delete-disciplina"
                                        size="small"
                                    >
                                        <DeleteIcon sx={{ color: '#f44336' }} />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                ) : (
                    <CardContent sx={{ py: 0 }}>
                        <Typography gutterBottom variant="h5" component="div">
                            Curso: {curso}
                        </Typography>
                        <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                            Carga Horária: {cargaHoraria} <br />
                            Data Início do Curso: {dataInicio}<br />
                            Disciplinas: {nomeDisciplinas.join(", ")}
                        </Typography>
                    </CardContent>
                )}

                <Box sx={{ display: 'flex', gap: 1 }}>
                    {isEditing ? (
                        <IconButton onClick={handleSave} aria-label="save">
                            <SaveIcon sx={{ color: '#4caf50' }} />
                        </IconButton>
                    ) : (
                        <IconButton
                            onClick={() => setIsEditing(true)}
                            aria-label="edit"
                        >
                            <EditIcon color="primary" />
                        </IconButton>
                    )}
                    <IconButton onClick={() => onDelete(id)} aria-label="delete">
                        <DeleteIcon sx={{ color: '#f44336'}} />
                    </IconButton>
                </Box>
            </Box>
        </Card>
    );
}