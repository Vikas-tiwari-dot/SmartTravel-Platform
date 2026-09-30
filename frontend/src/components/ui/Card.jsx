import { cn } from "../../utils/cn";

export default function Card({ as: Tag = "div", className, padded = true, hover = false, children, ...props }) {
  return (
    <Tag
      className={cn(
        "bg-paper border border-line rounded-2xl",
        padded && "p-5 sm:p-6",
        hover && "transition-all duration-200 hover:shadow-[var(--shadow-stone)] hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
