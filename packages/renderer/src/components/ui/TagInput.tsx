type Props = {
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  placeholder?: string;
};

export default function TagInput({
  tags,
  onAdd,
  onRemove,
  inputValue,
  setInputValue,
  placeholder = "Ej: React, Tailwind"
}: Props) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = inputValue.trim();
      if (trimmed) {
        onAdd(trimmed);
        setInputValue("");
      }
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 border border-gray-300 p-2 rounded-md"
        />
        <button
          type="button"
          onClick={() => {
            const trimmed = inputValue.trim();
            if (trimmed) {
              onAdd(trimmed);
              setInputValue("");
            }
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Agregar
        </button>
      </div>
      <ul className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <li
            key={i}
            className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
          >
            {tag}
            <button
              onClick={() => onRemove(tag)}
              className="text-red-500 hover:text-red-700"
            >
              &times;
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
