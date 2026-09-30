import Card from "../ui/Card";

export default function FeatureCard({ icon: Icon, title, body }) {
  return (
    <Card hover className="h-full">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-amber">
        <Icon size={19} strokeWidth={2} />
      </div>
      <h3 className="mt-4 font-display text-base font-semibold text-ink">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-ink/55">{body}</p>
    </Card>
  );
}
