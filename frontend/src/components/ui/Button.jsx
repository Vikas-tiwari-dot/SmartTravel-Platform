import { cn } from "../../utils/cn";

const VARIANTS = {
  primary: "bg-ink text-paper hover:bg-ink-soft active:bg-ink",
  amber: "bg-amber text-ink hover:bg-amber-dark",
  teal: "bg-teal text-paper hover:bg-teal-dark",
  outline: "bg-transparent text-ink border border-ink/20 hover:border-ink hover:bg-mist",
  ghost: "bg-transparent text-ink hover:bg-mist",
  danger: "bg-red text-paper hover:bg-red-dark",
};

const SIZES = {
  sm: "text-sm px-3 py-1.5 gap-1.5",
  md: "text-sm px-4 py-2.5 gap-2",
  lg: "text-base px-6 py-3.5 gap-2.5",
};

export default function Button({
  as: Tag = "button",
  variant = "primary",
  size = "md",
  className,
  icon: Icon,
  iconPosition = "left",
  children,
  ...props
}) {
  return (
    <Tag
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-semibold transition-colors duration-150 disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {Icon && iconPosition === "left" && <Icon size={size === "lg" ? 20 : 16} strokeWidth={2.25} />}
      {children}
      {Icon && iconPosition === "right" && <Icon size={size === "lg" ? 20 : 16} strokeWidth={2.25} />}
    </Tag>
  );
}
