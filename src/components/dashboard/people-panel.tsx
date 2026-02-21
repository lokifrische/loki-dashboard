"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardTitle } from "@/components/ui/card";
import { Users, Plus, Search, X, Briefcase, Phone, Mail, Globe } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  company?: string;
  role?: string;
  email?: string;
  phone?: string;
  notes?: string;
  tags?: string[];
  createdAt?: string;
}

function ContactCard({ contact, onDelete }: { contact: Contact; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-lg border border-border bg-card p-3 group">
      <div className="flex items-start justify-between gap-2">
        <button className="text-left flex-1 min-w-0" onClick={() => setExpanded((p) => !p)}>
          <p className="text-sm font-medium text-foreground truncate">{contact.name}</p>
          {(contact.role || contact.company) && (
            <p className="text-xs text-muted-foreground truncate">
              {contact.role}{contact.role && contact.company ? " · " : ""}{contact.company}
            </p>
          )}
        </button>
        <div className="flex items-center gap-1 shrink-0">
          {contact.tags?.slice(0, 2).map((tag) => (
            <span key={tag} className="text-[10px] bg-muted rounded px-1.5 py-0.5 text-muted-foreground">{tag}</span>
          ))}
          <button onClick={() => onDelete(contact.id)} className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 text-muted-foreground hover:text-red-500">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 space-y-1.5 border-t border-border pt-3">
          {contact.email && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="h-3 w-3 shrink-0" />
              <a href={`mailto:${contact.email}`} className="hover:text-foreground transition-colors">{contact.email}</a>
            </div>
          )}
          {contact.phone && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="h-3 w-3 shrink-0" />
              <span>{contact.phone}</span>
            </div>
          )}
          {contact.notes && (
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{contact.notes}</p>
          )}
        </div>
      )}
    </div>
  );
}

function AddContactForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: "", company: "", role: "", email: "", phone: "", notes: "", tags: "" });
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    await addDoc(collection(db, "dashboard_contacts"), {
      name: form.name.trim(),
      company: form.company.trim(),
      role: form.role.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      notes: form.notes.trim(),
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
      updatedAt: serverTimestamp(),
    });
    setSaving(false);
    onClose();
  };

  const fields = [
    { key: "name", label: "Name *", placeholder: "Full name" },
    { key: "company", label: "Company", placeholder: "Company name" },
    { key: "role", label: "Role", placeholder: "Title / role" },
    { key: "email", label: "Email", placeholder: "email@example.com" },
    { key: "phone", label: "Phone", placeholder: "+1 555 000 0000" },
    { key: "tags", label: "Tags", placeholder: "investor, client, partner (comma-separated)" },
  ];

  return (
    <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-3">
      <p className="text-sm font-medium text-foreground">Add Contact</p>
      {fields.map(({ key, label, placeholder }) => (
        <div key={key}>
          <label className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</label>
          <input
            value={(form as Record<string, string>)[key]}
            onChange={(e) => set(key, e.target.value)}
            placeholder={placeholder}
            className="mt-0.5 w-full rounded border border-border bg-background px-2 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
      ))}
      <div>
        <label className="text-[10px] text-muted-foreground uppercase tracking-wide">Notes</label>
        <textarea
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="What do they care about? Any context..."
          rows={3}
          className="mt-0.5 w-full rounded border border-border bg-background px-2 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
        />
      </div>
      <div className="flex gap-2">
        <button onClick={handleSave} disabled={saving || !form.name.trim()} className="rounded bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
          {saving ? "Saving..." : "Save"}
        </button>
        <button onClick={onClose} className="rounded px-4 py-1.5 text-xs text-muted-foreground hover:text-foreground">Cancel</button>
      </div>
    </div>
  );
}

export function PeoplePanel() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    return onSnapshot(collection(db, "dashboard_contacts"), (snap) => {
      const data = snap.docs
        .map((d) => ({ id: d.id, ...d.data() } as Contact))
        .sort((a, b) => a.name.localeCompare(b.name));
      setContacts(data);
    });
  }, []);

  const filtered = search
    ? contacts.filter((c) =>
        [c.name, c.company, c.role, c.email, ...(c.tags || [])].some(
          (v) => v?.toLowerCase().includes(search.toLowerCase())
        )
      )
    : contacts;

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "dashboard_contacts", id));
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <CardTitle>People</CardTitle>
        </div>
        <button
          onClick={() => setAdding((p) => !p)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Add
        </button>
      </div>

      {adding && <div className="mb-4"><AddContactForm onClose={() => setAdding(false)} /></div>}

      {/* Search */}
      {contacts.length > 0 && (
        <div className="relative mb-3">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contacts..."
            className="w-full rounded-md border border-border bg-background pl-8 pr-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
          />
        </div>
      )}

      {contacts.length === 0 && !adding ? (
        <div className="text-center py-6">
          <Globe className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No contacts yet.</p>
          <p className="text-xs text-muted-foreground mt-1">Add people as you go — clients, partners, investors.</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {filtered.map((contact) => (
            <ContactCard key={contact.id} contact={contact} onDelete={handleDelete} />
          ))}
          {filtered.length === 0 && search && (
            <p className="text-sm text-muted-foreground text-center py-4">No results for &ldquo;{search}&rdquo;</p>
          )}
          <div className="flex items-center gap-1.5 pt-1 text-xs text-muted-foreground">
            <Briefcase className="h-3 w-3" />
            <span>{contacts.length} contact{contacts.length !== 1 ? "s" : ""}</span>
          </div>
        </div>
      )}
    </Card>
  );
}
