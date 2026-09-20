import NumberFlow from "@number-flow/react";
import * as RadixSlider from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

/**
 * Accessible range slider with an animated value floating above its thumb.
 * The component intentionally mirrors Radix Slider's props so it can be
 * controlled like any other shadcn-style form primitive.
 */
export function Slider({
  className,
  value,
  defaultValue,
  ...props
}: RadixSlider.SliderProps) {
  const displayedValue = value?.[0] ?? defaultValue?.[0];

  return (
    <RadixSlider.Root
      {...props}
      value={value}
      defaultValue={defaultValue}
      className={cn(
        "relative flex h-10 w-full touch-none select-none items-center overflow-visible",
        className,
      )}
    >
      <RadixSlider.Track className="relative h-1.5 grow overflow-hidden rounded-full bg-white/10">
        <RadixSlider.Range className="absolute h-full rounded-full bg-gold-400" />
      </RadixSlider.Track>
      <RadixSlider.Thumb
        className="relative block h-5 w-5 shrink-0 rounded-full border border-gold-300/80 bg-[#f8f7f2] shadow-[0_0_0_4px_rgba(226,168,145,.12),0_4px_12px_rgba(0,0,0,.35)] transition-shadow hover:shadow-[0_0_0_6px_rgba(226,168,145,.16),0_5px_16px_rgba(0,0,0,.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#101416]"
        aria-label={props["aria-label"] ?? "Slider value"}
      >
        {displayedValue != null && (
          <NumberFlow
            willChange
            value={displayedValue}
            isolate
            opacityTiming={{ duration: 250, easing: "ease-out" }}
            transformTiming={{ duration: 500, easing: "ease-out" }}
            className="pointer-events-none absolute bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap font-serif text-xl font-light text-gold-400"
          />
        )}
      </RadixSlider.Thumb>
    </RadixSlider.Root>
  );
}

export { Slider as NumberFlowSlider };
