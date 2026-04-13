import Select from "../ui/Select";

type Option = {
  label: string;
  value: string;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
};

export default function DaySelector({ value, onChange, options }: Props) {
  return (
    <div className="w-full max-w-sm">
      <Select
        label="Planning Date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        options={options}
      />
    </div>
  );
}