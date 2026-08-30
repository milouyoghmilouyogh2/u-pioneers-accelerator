"use client";

import { useState, useTransition, useRef } from "react";
import { X, Plus, Trash2, Save, Edit, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import {
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
  addTeamMemberLink,
  deleteTeamMemberLink,
} from "@/app/actions/team";

const PLATFORMS = [
  { id: "facebook", label: "Facebook", color: "#1877F2" },
  { id: "x", label: "X", color: "#000000" },
  { id: "linkedin", label: "LinkedIn", color: "#0A66C2" },
  { id: "instagram", label: "Instagram", color: "#E4405F" },
  { id: "tiktok", label: "TikTok", color: "#000000" },
  { id: "youtube", label: "YouTube", color: "#FF0000" },
  { id: "whatsapp", label: "WhatsApp", color: "#25D366" },
  { id: "telegram", label: "Telegram", color: "#0088CC" },
  { id: "discord", label: "Discord", color: "#5865F2" },
  { id: "email", label: "Email", color: "#EA4335" },
  { id: "website", label: "Website", color: "#666666" },
];

function SocialIcon({ platform, className = "size-7" }: { platform: string; className?: string }) {
  const iconMap: Record<string, JSX.Element> = {
    facebook: <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
    x: <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
    linkedin: <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.607H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
    instagram: <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>,
    tiktok: <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 10.86 4.48V13.2a8.16 8.16 0 0 0 5.58 2.17v-3.45a4.85 4.85 0 0 1-2-.65v.02l.03-.03z"/></svg>,
    youtube: <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
    whatsapp: <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
    telegram: <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12.056 0h-.112zM5.8 12.8l1.8-6.8 10.4 5.4-10.4 5.4-4.8-2.4c-.4-.2-.4-.8 0-1l.8-.4zm.6 1.2l2.6 1.3-2.6 1.3v-2.6zm6.8 3.4l-2.6-1.3 2.6-1.3 2.6 1.3-2.6 1.3zm-1-2.6l-5.4-2.8 8.4-4.2-8.4 4.2z"/></svg>,
    discord: <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189z"/></svg>,
    email: <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>,
    website: <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>,
  };

  const info = PLATFORMS.find((p) => p.id === platform) || PLATFORMS[0];
  return (
    <span
      className={`${className} flex items-center justify-center rounded-lg text-white shrink-0`}
      style={{ backgroundColor: info.color }}
      title={info.label}
    >
      {iconMap[platform] || <span className="text-xs">?</span>}
    </span>
  );
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string | null;
  image_url: string | null;
  links: { id: string; platform: string; url: string }[];
}

export function TeamMemberCard({ member }: { member: TeamMember }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(member.name);
  const [role, setRole] = useState(member.role);
  const [description, setDescription] = useState(member.description || "");
  const [imageUrl, setImageUrl] = useState(member.image_url || "");
  const [links, setLinks] = useState(member.links.map((l) => ({ ...l })));
  const [newPlatform, setNewPlatform] = useState("linkedin");
  const [newUrl, setNewUrl] = useState("");

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const supabase = createClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `team-${member.id}-${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("team-photos")
      .upload(fileName, file, { contentType: file.type });

    if (error) {
      alert("خطأ في رفع الصورة: " + error.message);
      return;
    }

    const { data } = supabase.storage.from("team-photos").getPublicUrl(fileName);
    setImageUrl(data.publicUrl);
  }

  function handleSave() {
    setError("");
    const fd = new FormData();
    fd.append("name", name);
    fd.append("role", role);
    fd.append("description", description);
    fd.append("image_url", imageUrl);
    startTransition(async () => {
      const result = await updateTeamMember(member.id, fd);
      if (result.error) { setError(result.error); return; }
      setIsEditing(false);
    });
  }

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  function handleDelete() {
    setShowDeleteConfirm(true);
  }

  function confirmDelete() {
    setShowDeleteConfirm(false);
    startTransition(async () => {
      const result = await deleteTeamMember(member.id);
      if (result.error) alert("خطأ: " + result.error);
    });
  }

  function handleRemoveLink(linkId: string) {
    if (!confirm("حذف هذا الرابط؟")) return;
    startTransition(async () => {
      await deleteTeamMemberLink(linkId);
      setLinks(links.filter((l) => l.id !== linkId));
    });
  }

  function addLink() {
    if (!newUrl.trim()) return;
    startTransition(async () => {
      await addTeamMemberLink(member.id, newPlatform, newUrl.trim());
      setLinks([...links, { id: "new-" + Date.now(), platform: newPlatform, url: newUrl.trim() }]);
      setNewUrl("");
    });
  }

  if (isEditing) {
    return (
      <div className="card-luxury rounded-xl p-5 border border-gold-500/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-cream">تعديل العضو</h3>
          <button onClick={() => setIsEditing(false)} className="text-muted hover:text-cream"><X className="size-5" /></button>
        </div>
        {error && <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-500">{error}</div>}

        <div className="mb-3">
          <label className="mb-1 block text-xs font-medium text-cream-dim">الصورة</label>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          <div onClick={() => fileInputRef.current?.click()} className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-border bg-surface p-3 transition hover:border-gold-500/50">
            {imageUrl ? <img src={imageUrl} alt="preview" className="size-12 rounded-full object-cover" /> : <div className="flex size-12 items-center justify-center rounded-full bg-white/5"><Upload className="size-5 text-muted" /></div>}
            <span className="text-xs text-muted">{imageUrl ? "تغيير الصورة" : "اضغط لرفع صورة"}</span>
          </div>
        </div>

        <div className="mb-3">
          <label className="mb-1 block text-xs font-medium text-cream-dim">الاسم</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-cream" />
        </div>

        <div className="mb-3">
          <label className="mb-1 block text-xs font-medium text-cream-dim">الدور</label>
          <input type="text" value={role} onChange={(e) => setRole(e.target.value)} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-cream" />
        </div>

        <div className="mb-3">
          <label className="mb-1 block text-xs font-medium text-cream-dim">الوصف</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-cream" />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-xs font-medium text-cream-dim">روابط التواصل الاجتماعي</label>
          {links.map((link) => (
            <div key={link.id} className="mb-2 flex items-center gap-2">
              <SocialIcon platform={link.platform} className="size-8" />
              <input type="url" value={link.url} onChange={(e) => setLinks(links.map((l) => l.id === link.id ? { ...l, url: e.target.value } : l))} className="flex-1 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-cream" />
              <button type="button" onClick={() => handleRemoveLink(link.id)} className="flex size-8 items-center justify-center rounded-lg bg-red-500/10 text-red-400 transition hover:bg-red-500/20 hover:text-red-300" title="حذف الرابط"><Trash2 className="size-4" /></button>
            </div>
          ))}
          <div className="flex items-center gap-2 mt-3">
            <select value={newPlatform} onChange={(e) => setNewPlatform(e.target.value)} className="rounded-lg border border-border bg-surface px-2 py-1.5 text-xs text-cream">
              {PLATFORMS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
            <input type="url" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://..." className="flex-1 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-cream placeholder:text-muted" onKeyDown={(e) => e.key === "Enter" && addLink()} />
            <button type="button" onClick={addLink} className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25"><Plus className="size-4" /></button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave} disabled={isPending}><Save className="size-4" /> {isPending ? "جاري الحفظ..." : "حفظ"}</Button>
          <Button size="sm" variant="secondary" onClick={() => setIsEditing(false)}>إلغاء</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="card-luxury rounded-xl p-4 hover:border-border/80 transition">
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="card-luxury rounded-2xl p-6 max-w-sm mx-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-red-500/15 mx-auto">
              <Trash2 className="size-6 text-red-500" />
            </div>
            <h3 className="mt-4 text-center text-lg font-bold text-cream">حذف العضو</h3>
            <p className="mt-2 text-center text-sm text-muted">هل أنت متأكد من حذف "{member.name}"؟ لا يمكن التراجع عن هذا الإجراء.</p>
            <div className="mt-6 flex gap-3">
              <button onClick={confirmDelete} disabled={isPending} className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-600 disabled:opacity-50">
                {isPending ? "جاري الحذف..." : "نعم، حذف"}
              </button>
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-cream transition hover:bg-white/5">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        {member.image_url ? <img src={member.image_url} alt={member.name} className="size-12 shrink-0 rounded-full object-cover" /> : <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-lg font-bold text-ink">{member.name.charAt(0)}</div>}
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold text-cream">{member.name}</p>
          <p className="truncate text-xs text-gold-500">{member.role}</p>
        </div>
      </div>
      {member.description && <p className="mt-3 text-xs text-muted line-clamp-2">{member.description}</p>}
      {member.links.length > 0 && (
        <div className="mt-3 flex gap-1.5">
          {member.links.map((link) => <SocialIcon key={link.id} platform={link.platform} className="size-7" />)}
        </div>
      )}
      <div className="mt-3 flex gap-2">
        <button onClick={() => setIsEditing(true)} className="flex items-center gap-1 rounded-lg bg-gold-500/10 px-3 py-1.5 text-xs font-medium text-gold-500 transition hover:bg-gold-500/20"><Edit className="size-3" /> تعديل</button>
        <button onClick={handleDelete} className="flex items-center gap-1 rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-500/20"><Trash2 className="size-3" /> حذف</button>
      </div>
    </div>
  );
}

export function AddTeamMemberCard() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleAdd() {
    setError("");
    const fd = new FormData();
    fd.append("name", "عضو جديد");
    fd.append("role", "الدور");
    fd.append("description", "");
    startTransition(async () => {
      const result = await addTeamMember(fd);
      if (result.error) setError(result.error);
    });
  }

  return (
    <div>
      {error && <div className="mb-2 rounded-lg bg-red-500/10 p-2 text-xs text-red-500">{error}</div>}
      <button onClick={handleAdd} disabled={isPending} className="card-luxury flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-6 transition hover:border-gold-500/50 hover:bg-gold-500/5 w-full min-h-[180px]">
        <div className="flex size-12 items-center justify-center rounded-full bg-white/5 text-3xl text-muted">+</div>
        <span className="text-sm font-medium text-muted">{isPending ? "جاري الإضافة..." : "إضافة عضو جديد"}</span>
      </button>
    </div>
  );
}
