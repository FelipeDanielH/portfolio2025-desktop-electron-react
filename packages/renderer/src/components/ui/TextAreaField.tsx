type Props = {
  label: string;
  rows?: number;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function TextareaField({ label, rows = 4, ...props }: Props) {
  return (
    <div>
      <label className="block font-medium text-sm mb-1">{label}</label>
      <textarea
        rows={rows}
        {...props}
        className={`w-full border border-gray-300 rounded-md p-2 ${props.className ?? ""}`}
      />
    </div>
  );
}
