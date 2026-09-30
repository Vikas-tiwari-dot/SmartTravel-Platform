import { Link } from "react-router-dom";
import { Milestone } from "lucide-react";
import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-mist px-4 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-amber">
        <Milestone size={26} strokeWidth={2} />
      </span>
      <div>
        <h1 className="font-display text-3xl font-bold text-ink">Wrong turn</h1>
        <p className="mt-2 text-ink/55">This route doesn't lead anywhere in TripLink.</p>
      </div>
      <Button as={Link} to="/" variant="amber">
        Back to safety
      </Button>
    </div>
  );
}
