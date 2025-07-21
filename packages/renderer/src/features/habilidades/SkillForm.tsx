import { useState, useEffect } from 'react';
import InputField from '../../components/ui/InputField';
import TextareaField from '../../components/ui/TextAreaField';
import type { Skill, Concepto } from '../../types/skills.types';
import { useCategories } from '../hooks/useCategories';

// Tipo para conceptos nuevos (sin _id)
type NewConcepto = Omit<Concepto, '_id'>;

interface SkillFormProps {
  skill?: Skill | null;
  onSubmit: (data: Omit<Skill, '_id'>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function SkillForm({ 
  skill, 
  onSubmit, 
  onCancel, 
  loading = false 
}: SkillFormProps) {
  const { categorias, loading: loadingCategorias } = useCategories();
  const [formData, setFormData] = useState({
    categoria_id: '',
    tecnologia: '',
    nivel: 'Básico' as 'Básico' | 'Intermedio' | 'Avanzado' | 'Experto',
    puntuacion: 1,
    descripcion: '',
    conceptos: [] as (Concepto | NewConcepto)[]
  });

  const [newConcepto, setNewConcepto] = useState({ nombre: '', aprendido: false });

  const niveles = ["Básico", "Intermedio", "Avanzado", "Experto"] as const;

  useEffect(() => {
    if (skill) {
      setFormData({
        categoria_id: skill.categoria_id,
        tecnologia: skill.tecnologia,
        nivel: skill.nivel,
        puntuacion: skill.puntuacion,
        descripcion: skill.descripcion || '',
        conceptos: skill.conceptos || []
      });
    }
  }, [skill]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const addConcepto = () => {
    if (newConcepto.nombre.trim()) {
      // Para conceptos nuevos, NO incluimos _id (el backend lo generará)
      const concepto = {
        nombre: newConcepto.nombre.trim(),
        aprendido: newConcepto.aprendido
      };
      setFormData(prev => ({
        ...prev,
        conceptos: [...prev.conceptos, concepto]
      }));
      setNewConcepto({ nombre: '', aprendido: false });
    }
  };

  const removeConcepto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      conceptos: prev.conceptos.filter((_, i) => i !== index)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-bold">
        {skill ? 'Editar Habilidad' : 'Nueva Habilidad'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium text-sm mb-1">Categoría *</label>
          <select
            className="w-full border border-gray-300 rounded-md p-2"
            value={formData.categoria_id}
            onChange={e => setFormData(prev => ({ ...prev, categoria_id: e.target.value }))}
            required
            disabled={loadingCategorias}
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.nombre}</option>
            ))}
          </select>
        </div>

        <InputField
          label="Tecnología *"
          value={formData.tecnologia}
          onChange={e => setFormData(prev => ({ ...prev, tecnologia: e.target.value }))}
          placeholder="Ej: React"
          required
        />

        <div>
          <label className="block font-medium text-sm mb-1">Nivel *</label>
          <select
            className="w-full border border-gray-300 rounded-md p-2"
            value={formData.nivel}
            onChange={e => setFormData(prev => ({ ...prev, nivel: e.target.value as any }))}
            required
          >
            {niveles.map(nivel => (
              <option key={nivel} value={nivel}>{nivel}</option>
            ))}
          </select>
        </div>

        <InputField
          label="Puntuación (1-10) *"
          type="number"
          min={1}
          max={10}
          value={formData.puntuacion}
          onChange={e => setFormData(prev => ({ ...prev, puntuacion: Number(e.target.value) }))}
          required
        />
      </div>

      <TextareaField
        label="Descripción"
        value={formData.descripcion}
        onChange={e => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
        placeholder="Descripción opcional de la habilidad"
        rows={3}
      />

      {/* Conceptos */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Conceptos Asociados</h3>
        
        {/* Agregar nuevo concepto */}
        <div className="flex gap-2 items-end">
          <InputField
            label="Nombre del concepto"
            value={newConcepto.nombre}
            onChange={e => setNewConcepto(prev => ({ ...prev, nombre: e.target.value }))}
            placeholder="Ej: Hooks, Context, etc."
          />
          <label className="flex items-center gap-1 text-sm">
            <input
              type="checkbox"
              checked={newConcepto.aprendido}
              onChange={e => setNewConcepto(prev => ({ ...prev, aprendido: e.target.checked }))}
            />
            Aprendido
          </label>
          <button
            type="button"
            onClick={addConcepto}
            className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700"
          >
            Agregar
          </button>
        </div>

        {/* Lista de conceptos */}
        {formData.conceptos.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Conceptos actuales:</h4>
            {formData.conceptos.map((concepto, index) => (
              <div key={('_id' in concepto ? concepto._id : `temp-${index}`)} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <span className="flex-1">{concepto.nombre}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  concepto.aprendido ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {concepto.aprendido ? 'Aprendido' : 'Pendiente'}
                </span>
                <button
                  type="button"
                  onClick={() => removeConcepto(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Guardando...' : (skill ? 'Actualizar' : 'Crear')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
} 