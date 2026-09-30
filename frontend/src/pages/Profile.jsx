import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bike, LogOut, Mail, MapPin, Shield, User } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Tabs from "../components/ui/Tabs";
import MilestoneStat from "../components/ui/MilestoneStat";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { updateProfile } from "../services/userService";

const TABS = [
  { id: "account", label: "Account" },
  { id: "vehicle", label: "Vehicle" },
  { id: "privacy", label: "Privacy & security" },
];

export default function Profile() {
  const [tab, setTab] = useState("account");
  const { user, signOut, refreshUser } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();

  const [accountForm, setAccountForm] = useState({ name: user?.name || "", homeCity: user?.homeCity || "" });
  const [vehicleForm, setVehicleForm] = useState({
    nickname: user?.vehicle?.nickname || "",
    registration: user?.vehicle?.registration || "",
  });
  const [saving, setSaving] = useState(false);

  async function handleLogout() {
    await signOut();
    notify("Logged out", { tone: "ink" });
    navigate("/");
  }

  async function handleSaveAccount() {
    setSaving(true);
    try {
      await updateProfile({ name: accountForm.name, homeCity: accountForm.homeCity });
      await refreshUser();
      notify("Account updated", { tone: "green" });
    } catch (err) {
      notify(err.message, { tone: "red" });
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveVehicle() {
    setSaving(true);
    try {
      await updateProfile({ vehicle: vehicleForm });
      await refreshUser();
      notify("Vehicle updated", { tone: "green" });
    } catch (err) {
      notify(err.message, { tone: "red" });
    } finally {
      setSaving(false);
    }
  }

  if (!user) return null;

  const initials = user.name.split(" ").map((n) => n[0]).join("");

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
        <span
          className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-paper"
          style={{ backgroundColor: user.avatarColor }}
        >
          {initials}
        </span>
        <div className="text-center sm:text-left">
          <h2 className="font-display text-xl font-bold text-ink">{user.name}</h2>
          <p className="text-sm text-ink/50">{user.handle} · Member since {user.memberSince}</p>
        </div>
        <Button variant="outline" size="sm" icon={LogOut} onClick={handleLogout} className="sm:ml-auto">
          Log out
        </Button>
      </div>

      <div className="flex flex-wrap gap-3.5">
        <MilestoneStat value={user.stats.tripsPlanned} label="Trips planned" band="ink" />
        <MilestoneStat value={user.stats.hoursSaved} unit="hr" label="Time saved" band="teal" />
        <MilestoneStat value={user.stats.fuelSavedLitres} unit="L" label="Fuel saved" band="green" />
      </div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === "account" && (
        <Card className="space-y-4 max-w-lg">
          <Input
            label="Full name"
            icon={User}
            value={accountForm.name}
            onChange={(e) => setAccountForm((f) => ({ ...f, name: e.target.value }))}
          />
          <Input label="Email" icon={Mail} type="email" value={user.email} disabled hint="Email can't be changed yet." />
          <Input
            label="Home city"
            icon={MapPin}
            value={accountForm.homeCity}
            onChange={(e) => setAccountForm((f) => ({ ...f, homeCity: e.target.value }))}
          />
          <Button variant="amber" size="sm" onClick={handleSaveAccount} disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </Card>
      )}

      {tab === "vehicle" && (
        <Card className="max-w-lg">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-mist text-teal-dark">
              <Bike size={20} />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">{user.vehicle?.label || "No vehicle on file"}</p>
              <p className="text-xs text-ink/45">Primary vehicle for route + halt planning</p>
            </div>
          </div>
          <div className="mt-5 space-y-4">
            <Input
              label="Vehicle nickname"
              value={vehicleForm.nickname}
              onChange={(e) => setVehicleForm((f) => ({ ...f, nickname: e.target.value }))}
            />
            <Input
              label="Registration number"
              value={vehicleForm.registration}
              onChange={(e) => setVehicleForm((f) => ({ ...f, registration: e.target.value }))}
            />
          </div>
          <Button variant="amber" size="sm" className="mt-2" onClick={handleSaveVehicle} disabled={saving}>
            {saving ? "Saving…" : "Update vehicle"}
          </Button>
        </Card>
      )}

      {tab === "privacy" && (
        <Card className="max-w-lg space-y-4">
          <div className="flex items-start gap-3">
            <Shield size={18} className="mt-0.5 shrink-0 text-teal-dark" />
            <div>
              <p className="text-sm font-semibold text-ink">Location sharing</p>
              <p className="text-sm text-ink/50">
                Visible to nearby Vikas users only while you're on an active route, so the
                vehicle interaction layer works both ways.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Shield size={18} className="mt-0.5 shrink-0 text-teal-dark" />
            <div>
              <p className="text-sm font-semibold text-ink">End-to-end message encryption</p>
              <p className="text-sm text-ink/50">On by default for every Give Way / Emergency / chat message.</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
