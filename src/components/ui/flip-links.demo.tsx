import { FlipLinks } from "@/components/ui/flip-links";

const DEMO_LINKS = [
  { label: "Twitter", href: "https://x.com/thisis_vaib" },
  { label: "Linkedin", href: "https://linkedin.com/in/vaib215" },
  { label: "Github", href: "https://github.com/vaib215" },
  { label: "Instagram", href: "https://instagram.com/thisis_vaib" },
];

const DemoFlipLinks = () => {
  return <FlipLinks links={DEMO_LINKS} />;
};

export { DemoFlipLinks };
