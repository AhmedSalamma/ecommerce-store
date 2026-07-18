import { useRef } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export function Carousel({ children }) {
  const trackRef = useRef(null);

  const scrollByAmount = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <div>
      <div className="relative">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [&::-webkit-scrollbar]:hidden"
        >
          {children}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <button
          type="button"
          aria-label="السابق"
          onClick={() => scrollByAmount(1)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-100"
        >
          <ChevronRight size={17} />
        </button>

        <div className="h-1.5 w-full rounded-full bg-neutral-200">
          <div className="h-1.5 w-1/3 rounded-full bg-neutral-500" />
        </div>

        <button
          type="button"
          aria-label="التالي"
          onClick={() => scrollByAmount(-1)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-100"
        >
          <ChevronLeft size={17} />
        </button>
      </div>
    </div>
  );
}
