"use client";

import { useRef, useState } from "react";
import { Field, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/providers/toast-provider";
import { updateSetting } from "@/app/actions/admin";

export function SettingField({
  settingKey,
  label,
  defaultValue,
  hint,
}: {
  settingKey: string;
  label: string;
  defaultValue: string;
  hint?: string;
}) {
  const [pending, setPending] = useState(false);
  const { showToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    const value = inputRef.current?.value || "";
    const result = await updateSetting(settingKey, value);
    setPending(false);
    if (result?.error) {
      showToast(result.error, "error");
      return;
    }
    showToast("تم حفظ الإعداد بنجاح.", "success");
  }

  return (
    <form onSubmit={handleSubmit} className="card-luxury flex flex-col gap-3 rounded-xl p-5">
      <Field label={label} hint={hint}>
        <Input ref={inputRef} name="value" defaultValue={defaultValue} required />
      </Field>
      <Button type="submit" size="sm" disabled={pending} className="self-start">
        {pending ? "جارٍ الحفظ..." : "حفظ"}
      </Button>
    </form>
  );
}
