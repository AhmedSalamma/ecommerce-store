import { useEffect, useState } from 'react';

function splitDuration(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { hours, minutes, seconds };
}

function pad(value) {
  return String(value).padStart(2, '0');
}

export function Countdown({ initialSeconds }) {
  const [remaining, setRemaining] = useState(initialSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining((current) => (current > 0 ? current - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { hours, minutes, seconds } = splitDuration(remaining);

  return (
    <div className="flex items-center gap-2">
      {[
        { label: 'ساعة', value: hours },
        { label: 'دقيقة', value: minutes },
        { label: 'ثانية', value: seconds },
      ].map((unit) => (
        <div key={unit.label} className="flex w-14 flex-col items-center rounded-lg bg-white/10 py-2">
          <span className="text-lg font-extrabold text-white">{pad(unit.value)}</span>
          <span className="text-[10px] text-neutral-400">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}
