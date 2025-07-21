type Props = {
  title: React.ReactNode;
  children: React.ReactNode;
  onDelete?: () => void;
  className?: string;
};

export default function FormSection({ title, children, onDelete, className = "" }: Props) {
  return (
    <div className={`border p-4 rounded-md bg-gray-50 space-y-4 ${className}`}>
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">{title}</h3>
        {onDelete && (
          <button
            onClick={onDelete}
            className="text-red-500 hover:underline text-sm"
          >
            Eliminar
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
