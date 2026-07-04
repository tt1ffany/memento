interface FilterSliderProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (val: number) => void;
}

const FilterSlider = ({ label, value, min, max, step, onChange }: FilterSliderProps) => {
    return (
        <div className="flex flex-col gap-2 w-full max-w-xs mx-auto p-4 bg-pink-100 border-4 border-pink-400 rounded-lg shadow-[4px_4px_0px_rgba(244,114,182,1)] font-mono text-pink-600">
            <div className="flex justify-between uppercase font-bold text-sm">
                <span>{label}</span>
                <span>{value.toFixed(2)}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full accent-pink-500 cursor-pointer"
            />
        </div>
    );
};

export default FilterSlider;