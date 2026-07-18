export function RangeSlider({ min, max, value, onChange }) {
  return (
    <div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-neutral-200 accent-primary"
      />
      <div className="mt-2 flex items-center justify-between text-xs text-neutral-500">
        <span>{value.toLocaleString()}$</span>
        <span>{min.toLocaleString()}$</span>
      </div>
    </div>
  );
}
