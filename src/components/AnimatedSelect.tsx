import { FluidDropdown, type FluidDropdownOption } from "@/components/ui/fluid-dropdown";

export type AnimatedSelectOption = FluidDropdownOption;

export interface AnimatedSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<string | AnimatedSelectOption>;
  placeholder?: string;
  ariaLabel: string;
  required?: boolean;
  className?: string;
}

/** Shared fluid dropdown used by all existing Grandeur forms. */
export default function AnimatedSelect(props: AnimatedSelectProps) {
  return <FluidDropdown {...props} />;
}
