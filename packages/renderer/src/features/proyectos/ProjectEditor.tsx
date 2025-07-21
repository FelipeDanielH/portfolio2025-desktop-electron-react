import { useState } from "react";
import type { Project } from "../../types/projects.types";
import { useProjects } from "../hooks/useProjects";
import ProjectList from "./ProjectList";
import ProjectForm from "./ProjectForm";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";
import SuccessMessage from "../../components/ui/SuccessMessage";

export default function ProjectEditor() {
  const { loading, error, create, update, successMessage, clearMessages } = useProjects();
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleCreateProject = async (data: Omit<Project, '_id'>) => {
    try {
      await create(data);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleUpdateProject = async (data: Omit<Project, '_id'>) => {
    if (!editingProject?._id) return;
    
    try {
      await update(editingProject._id, data);
      setShowForm(false);
      setEditingProject(null);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  const clearError = () => {
    clearMessages();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Gestionar Proyectos</h2>
        <LoadingSpinner text="Cargando proyectos..." />
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        <ProjectForm
          mode={editingProject ? "editar" : "crear"}
          initialData={editingProject || undefined}
          onSubmit={editingProject ? handleUpdateProject : handleCreateProject}
          onCancel={handleCancelForm}
          loading={loading}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Gestionar Proyectos</h2>
      
      {error && (
        <ErrorMessage 
          message={error} 
          onDismiss={clearError}
        />
      )}

      {successMessage && (
        <SuccessMessage 
          message={successMessage} 
          onDismiss={() => clearMessages()}
        />
      )}

      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Agregar nuevo proyecto
        </button>
      </div>

      <ProjectList />
    </div>
  );
} 