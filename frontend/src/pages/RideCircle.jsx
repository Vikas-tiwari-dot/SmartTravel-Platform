import { useEffect, useState } from "react";
import { Car, Bike, Star, Users2, MessageCircle, Send } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import StatusPill from "../components/ui/StatusPill";
import { Skeleton } from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import {
  getRideCircleMembers,
  getCommunityRequests,
  requestRideShare,
  postCommunityRequest,
} from "../services/communityService";
import { useToast } from "../context/ToastContext";

const VEHICLE_ICON = { Car, Scooter: Bike };

export default function RideCircle() {
  const [members, setMembers] = useState(null);
  const [requests, setRequests] = useState(null);
  const [sentIds, setSentIds] = useState(new Set());
  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);
  const { notify } = useToast();

  useEffect(() => {
    getRideCircleMembers().then(setMembers);
    getCommunityRequests().then(setRequests);
  }, []);

  async function handleRequest(member) {
    try {
      await requestRideShare(member.id);
      setSentIds((s) => new Set(s).add(member.id));
      notify(`Ride-share request sent to ${member.name}`, { tone: "green" });
    } catch (err) {
      notify(err.message, { tone: "red" });
    }
  }

  async function handlePost(e) {
    e.preventDefault();
    if (!draft.trim()) return;
    setPosting(true);
    try {
      const posted = await postCommunityRequest(draft.trim());
      setRequests((prev) => [posted, ...(prev || [])]);
      setDraft("");
    } catch (err) {
      notify(err.message, { tone: "red" });
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-3 rounded-2xl border border-line bg-mist p-4">
        <Users2 size={18} className="mt-0.5 shrink-0 text-teal-dark" />
        <p className="text-sm text-ink/60">
          These commuters share part of your route right now. Coordinate a ride, or just a heads-up
          about what's ahead.
        </p>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-ink/60">On your route</h3>
        {!members ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : members.length === 0 ? (
          <EmptyState icon={Users2} title="Nobody nearby yet" body="Check back once you're on an active route." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {members.map((m) => {
              const VIcon = VEHICLE_ICON[m.vehicle] || Car;
              const sent = sentIds.has(m.id);
              return (
                <Card key={m.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-sm font-bold text-paper">
                        {m.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-ink">{m.name}</p>
                        <p className="flex items-center gap-1 text-xs text-ink/45">
                          <Star size={11} className="fill-amber text-amber" /> {m.rating}
                        </p>
                      </div>
                    </div>
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-mist text-ink/50">
                      <VIcon size={15} />
                    </span>
                  </div>

                  <div className="mt-4 space-y-1.5 text-sm text-ink/60">
                    <p><span className="font-semibold text-ink">{m.route}</span></p>
                    <p>{m.overlapKm} km overlap with your route</p>
                    <p>Departing {m.departureWindow}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                    <StatusPill tone={m.seatsOffered > 0 ? "green" : "mist"}>
                      {m.seatsOffered > 0 ? `${m.seatsOffered} seat${m.seatsOffered > 1 ? "s" : ""} open` : "No seats — chat only"}
                    </StatusPill>
                    <Button
                      variant={sent ? "outline" : "teal"}
                      size="sm"
                      disabled={sent}
                      onClick={() => handleRequest(m)}
                    >
                      {sent ? "Request sent" : "Request"}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink/60">
          <MessageCircle size={15} /> Community requests
        </h3>

        <form onSubmit={handlePost} className="mb-4 flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Post a ride request to the community…"
            maxLength={280}
            className="flex-1 rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal"
          />
          <Button type="submit" variant="teal" size="md" icon={Send} disabled={posting || !draft.trim()} aria-label="Post">
            Post
          </Button>
        </form>

        {!requests ? (
          <Skeleton className="h-24 w-full" />
        ) : requests.length === 0 ? (
          <EmptyState icon={MessageCircle} title="No requests yet" body="Be the first to post one." />
        ) : (
          <div className="space-y-3">
            {requests.map((r) => (
              <Card key={r.id} className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mist text-xs font-bold text-ink/60">
                  {r.name.split(" ").map((n) => n[0]).join("")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-ink">
                    <span className="font-semibold">{r.name}</span> {r.text}
                  </p>
                  <p className="mt-1 text-xs text-ink/40">{r.time}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
