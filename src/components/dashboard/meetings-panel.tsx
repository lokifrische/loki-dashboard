"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Users, Video, Clock } from "lucide-react";

interface Meeting {
  id: string;
  title: string;
  start: string;
  end: string;
  location: string;
  description: string;
  attendees: string[];
  meetLink: string;
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const isTomorrow = d.toDateString() === new Date(now.getTime() + 86400000).toDateString();
  const dayLabel = isToday ? "Today" : isTomorrow ? "Tomorrow" : d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "America/Indiana/Indianapolis" });
  return `${dayLabel} · ${time}`;
}

function timeUntil(iso: string): string {
  if (!iso) return "";
  const diff = new Date(iso).getTime() - Date.now();
  if (diff < 0) return "now";
  const m = Math.floor(diff / 60000);
  if (m < 60) return `in ${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `in ${h}h ${m % 60}m`;
  const d = Math.floor(h / 24);
  return `in ${d}d`;
}

function isDateOnly(s: string) { return /^\d{4}-\d{2}-\d{2}$/.test(s); }

export function MeetingsPanel() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [, setTick] = useState(0);

  useEffect(() => {
    return onSnapshot(collection(db, "dashboard_meetings"), (snap) => {
      const data = snap.docs
        .map((d) => ({ id: d.id, ...d.data() } as Meeting))
        .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
      setMeetings(data);
    });
  }, []);

  // Live countdown tick
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 60000);
    return () => clearInterval(t);
  }, []);

  const upcoming = meetings.filter((m) => {
    if (isDateOnly(m.start)) return true;
    return new Date(m.start).getTime() > Date.now() - 3600000; // include meetings started <1h ago
  });

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          <CardTitle>Meetings</CardTitle>
        </div>
        <span className="text-[10px] text-muted-foreground">{upcoming.length} this week</span>
      </div>

      {upcoming.length === 0 ? (
        <p className="text-sm text-muted-foreground">No upcoming meetings. Clear schedule 👌</p>
      ) : (
        <div className="space-y-3">
          {upcoming.slice(0, 5).map((meeting, i) => {
            const isDateOnlyEvent = isDateOnly(meeting.start);
            const until = isDateOnlyEvent ? "" : timeUntil(meeting.start);
            const isNext = i === 0;

            return (
              <div
                key={meeting.id}
                className={`rounded-lg border p-3 transition-colors ${
                  isNext ? "border-primary/30 bg-primary/5" : "border-border bg-card"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-medium leading-snug ${isNext ? "text-foreground" : "text-foreground/80"}`}>
                    {meeting.title}
                  </p>
                  {until && (
                    <span className={`text-[10px] font-medium shrink-0 px-2 py-0.5 rounded-full border ${
                      until === "in 0m" || until === "now"
                        ? "bg-red-500/10 border-red-500/30 text-red-400"
                        : isNext
                        ? "bg-primary/10 border-primary/30 text-primary"
                        : "bg-muted border-border text-muted-foreground"
                    }`}>
                      {until}
                    </span>
                  )}
                </div>

                <div className="mt-1.5 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 shrink-0" />
                    <span>{formatDate(meeting.start)}</span>
                  </div>

                  {meeting.location && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">{meeting.location}</span>
                    </div>
                  )}

                  {meeting.attendees?.length > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Users className="h-3 w-3 shrink-0" />
                      <span className="truncate">{meeting.attendees.slice(0, 3).join(", ")}{meeting.attendees.length > 3 ? ` +${meeting.attendees.length - 3}` : ""}</span>
                    </div>
                  )}

                  {meeting.meetLink && (
                    <a
                      href={meeting.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline mt-1"
                    >
                      <Video className="h-3 w-3" />
                      Join
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
