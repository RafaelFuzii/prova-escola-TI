import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import { TextField } from "@mui/material";

interface DisciplinaProps {
    id: string;
    nome: string;
    onRemove: (id: string) => void;
    onUpdate: (id: string, nome: string) => void;
}

export default function Disciplina({ id, nome, onRemove, onUpdate }: DisciplinaProps) {
    return (
        <div className="flex items-center gap-x-4">
            <div className="flex-grow">
                <TextField
                    label="Nome da Disciplina"
                    variant="filled"
                    fullWidth
                    value={nome}
                    onChange={(e: { target: { value: string; }; }) => onUpdate(id, e.target.value)} 
                    InputLabelProps={{ style: { color: '#A0A0A0' } }}
                    InputProps={{ style: { color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
                />
            </div>
            <div>
                <IconButton aria-label="delete" onClick={() => onRemove(id)}>
                    <DeleteIcon color="error" />
                </IconButton>
            </div>
        </div>
    );
}