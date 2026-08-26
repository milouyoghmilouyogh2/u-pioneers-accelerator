"use client";

import { useState, useTransition } from "react";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/providers/toast-provider";
import { updateWeapon } from "@/app/actions/admin";
import type { Tables } from "@/lib/supabase/database.types";

export function WeaponsCmsEditor({ weapons }: { weapons: Tables<"weapons">[] }) {
  const [selectedNumber, setSelectedNumber] = useState(weapons[0]?.number ?? 1);
  const [pending, startTransition] = useTransition();
  const { showToast } = useToast();

  const selected = weapons.find((w) => w.number === selectedNumber) ?? weapons[0];

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await updateWeapon(formData);
      if (result?.error) {
        showToast(result.error, "error");
        return;
      }
      showToast(`تم تحديث محتوى السلاح ${selectedNumber} بنجاح!`, "success");
    });
  }

  if (!selected) return null;

  return (
    <div className="card-luxury rounded-2xl p-6">
      <Field label="اختر السلاح للتعديل">
        <Select
          value={selectedNumber}
          onChange={(e) => setSelectedNumber(Number(e.target.value))}
        >
          {weapons.map((w) => (
            <option key={w.number} value={w.number}>
              {w.number}. {w.title}
            </option>
          ))}
        </Select>
      </Field>

      <form key={selected.number} action={handleSubmit} className="mt-5 flex flex-col gap-4">
        <input type="hidden" name="number" value={selected.number} />
        <Field label="العنوان">
          <Input name="title" defaultValue={selected.title} required />
        </Field>
        <Field label="الملخص القصير">
          <Input name="summary" defaultValue={selected.summary} required />
        </Field>
        <Field label="المعرفة الموجهة">
          <Textarea name="knowledge" defaultValue={selected.knowledge} rows={4} required />
        </Field>
        <Field label="نص المهمة التطبيقية">
          <Textarea name="task_prompt" defaultValue={selected.task_prompt} rows={2} required />
        </Field>
        <Field label="نص توضيحي (placeholder)">
          <Textarea name="placeholder" defaultValue={selected.placeholder} rows={2} required />
        </Field>
        <Button type="submit" disabled={pending} className="self-start">
          {pending ? "جارٍ الحفظ..." : "حفظ التعديلات"}
        </Button>
      </form>
    </div>
  );
}
