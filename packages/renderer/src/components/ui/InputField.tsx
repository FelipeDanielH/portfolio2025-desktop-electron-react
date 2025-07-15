type Props = {
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function InputField({ label, ...props }: Props) {
  return (
    <div>
      <label className="block font-medium text-sm mb-1">{label}</label>
      <input
        type="text"
        {...props}
        className={`w-full border border-gray-300 rounded-md p-2 ${props.className ?? ""}`}
      />
    </div>
  );
}
