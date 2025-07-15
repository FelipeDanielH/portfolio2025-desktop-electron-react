// packages/renderer/src/features/inicio/AboutEditor.tsx
import { useState } from "react";
import TextareaField from "../../components/ui/TextAreaField"

export default function AboutEditor() {
  const [resumen, setResumen] = useState("");

  return (
    <div className="space-y-4">
      <TextareaField
        label="Resumen profesional"
        value={resumen}
        onChange={(e) => setResumen(e.target.value)}
        placeholder="Ej: Ingeniero en Informática y egresado del bootcamp Full Stack..."
        rows={6}
      />
    </div>
  );
}
