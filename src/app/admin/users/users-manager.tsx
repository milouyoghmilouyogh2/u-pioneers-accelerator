"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/providers/toast-provider";
import { createUser } from "@/app/actions/admin";

type UserData = {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
};

export function UsersManager({ users }: { users: UserData[] }) {
  const [pending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  function handleCreate(formData: FormData) {
    startTransition(async () => {
      const result = await createUser(formData);
      if (result?.error) {
        showToast(result.error, "error");
        return;
      }
      showToast("تم إنشاء المستخدم بنجاح!", "success");
      setShowForm(false);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-cream">المستخدمون</h1>
          <p className="mt-1 text-sm text-muted">
            إنشاء وإدارة حسابات المستخدمين
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <UserPlus className="size-4" /> إنشاء مستخدم
        </Button>
      </div>

      {showForm && (
        <div className="card-luxury rounded-2xl p-6">
          <h2 className="mb-4 text-lg font-semibold text-cream">
            إنشاء مستخدم جديد
          </h2>
          <form action={handleCreate} className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="البريد الإلكتروني">
                <Input type="email" name="email" required placeholder="user@example.com" />
              </Field>
              <Field label="كلمة المرور" hint="8 خانات على الأقل">
                <Input type="password" name="password" required minLength={8} />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="الاسم (اختياري)">
                <Input name="full_name" placeholder="الاسم الكامل" />
              </Field>
              <Field label="الدور">
                <Select name="role" defaultValue="student">
                  <option value="student">طالب</option>
                  <option value="admin">مدير</option>
                </Select>
              </Field>
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={pending}>
                {pending ? "جارٍ الإنشاء..." : "إنشاء المستخدم"}
              </Button>
              <Button variant="ghost" onClick={() => setShowForm(false)}>
                إلغاء
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="card-luxury overflow-hidden rounded-2xl">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-sm font-semibold text-cream">
            جميع المستخدمين ({users.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-start text-xs text-muted">
                <th className="px-6 py-3 text-start font-medium">المستخدم</th>
                <th className="px-6 py-3 text-start font-medium">البريد</th>
                <th className="px-6 py-3 text-start font-medium">الدور</th>
                <th className="px-6 py-3 text-start font-medium">تاريخ الإنشاء</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-border/60 last:border-0">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      {u.role === "admin" ? (
                        <Shield className="size-4 text-gold-500" />
                      ) : (
                        <User className="size-4 text-muted" />
                      )}
                      <span className="text-cream">{u.full_name || "—"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-muted">{u.email}</td>
                  <td className="px-6 py-3">
                    <Badge tone={u.role === "admin" ? "gold" : "muted"}>
                      {u.role === "admin" ? "مدير" : "طالب"}
                    </Badge>
                  </td>
                  <td className="px-6 py-3 text-muted">
                    {new Date(u.created_at).toLocaleDateString("ar-DZ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
