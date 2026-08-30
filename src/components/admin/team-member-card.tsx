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

import { PLATFORMS, SocialIcon } from "@/components/ui/social-icons";

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
  const [links, setLinks] = useState(member.links.map((l: { id: string; platform: string; url: string }) => ({ ...l })));
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
