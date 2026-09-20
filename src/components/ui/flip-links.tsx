import { cn } from "@/lib/utils";

const getLetterDelay = (i: number) => `${i * 25}ms`;

/** Single flip-letter link */
const FlipLink = ({ label, href }: { label: string; href: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group text-neutral-50 relative block overflow-hidden whitespace-nowrap text-4xl font-black uppercase sm:text-7xl md:text-8xl lg:text-9xl"
    style={{ lineHeight: 0.75 }}
  >
    {/* Visible layer — slides up on hover */}
    <div className="flex">
      {label.split("").map((letter, i) => (
        <span
          key={i}
          className="inline-block transition-transform duration-300 ease-in-out group-hover:-translate-y-[110%]"
          style={{ transitionDelay: getLetterDelay(i) }}
        >
          {letter}
        </span>
      ))}
    </div>

    {/* Reveal layer — slides in from below, tinted gold */}
    <div className="absolute inset-0 flex">
      {label.split("").map((letter, i) => (
        <span
          key={i}
          className="inline-block translate-y-[110%] text-gold-400 transition-transform duration-300 ease-in-out group-hover:translate-y-0"
          style={{ transitionDelay: getLetterDelay(i) }}
        >
          {letter}
        </span>
      ))}
    </div>
  </a>
);

/** Hero-scale social links with a letter-flip reveal on hover. */
export function FlipLinks({
  links,
  className,
}: {
  links: Array<{ label: string; href: string }>;
  className?: string;
}) {
  return (
    <section className={cn("grid place-content-center gap-2 bg-[#101416] w-full text-neutral-50", className)}>
      {links.map((link) => (
        <FlipLink key={link.label} label={link.label} href={link.href} />
      ))}
    </section>
  );
}
