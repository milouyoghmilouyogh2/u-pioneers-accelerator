import { z } from "zod";

// Helper: validate data against a zod schema
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);
  if (result.success) return { success: true, data: result.data };
  const issues = result.error.issues;
  return { success: false, error: issues[0]?.message || "خطأ في البيانات" };
}

// Auth schemas
export const signUpSchema = z.object({
  full_name: z.string().min(1, "الرجاء إدخال الاسم الكامل").max(100),
  university: z.string().min(1, "الرجاء اختيار الجامعة"),
  major: z.string().min(1, "الرجاء إدخال التخصص").max(100),
  whatsapp: z.string().min(1, "الرجاء إدخال رقم الواتساب").max(20),
  project_title: z.string().min(1, "الرجاء إدخال عنوان المشروع").max(200),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string()
    .min(8, "كلمة المرور يجب أن تتكون من 8 خانات على الأقل")
    .regex(/[A-Z]/, "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل")
    .regex(/[0-9]/, "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل"),
});

export const signInSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(1, "الرجاء إدخال كلمة المرور"),
});

export const passwordResetSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح"),
});

export const updatePasswordSchema = z.object({
  password: z.string()
    .min(8, "كلمة المرور يجب أن تتكون من 8 خانات على الأقل")
    .regex(/[A-Z]/, "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل")
    .regex(/[0-9]/, "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل"),
});

// Weapon answer
export const weaponAnswerSchema = z.object({
  weaponNumber: z.number().int().min(1).max(16),
  answer: z.string().min(1, "الرجاء كتابة إجابتك").max(10000),
});

// Support ticket
export const supportTicketSchema = z.object({
  name: z.string().min(1, "الرجاء إدخال الاسم").max(100),
  whatsapp: z.string().min(1, "الرجاء إدخال رقم الواتساب").max(20),
  ticket_type: z.string().min(1, "الرجاء اختيار نوع الطلب"),
  message: z.string().min(10, "الرسالة قصيرة جداً (10 أحرف على الأقل)").max(2000),
});

// Admin: weapon update
export const weaponUpdateSchema = z.object({
  number: z.number().int().min(1).max(16),
  title: z.string().max(200),
  summary: z.string().max(500),
  knowledge: z.string().max(10000),
  task_prompt: z.string().max(2000),
  placeholder: z.string().max(200),
});

// Admin: setting update
export const settingUpdateSchema = z.object({
  key: z.string().min(1).max(100),
  value: z.string().max(5000),
});

// UUID validation
export const uuidSchema = z.string().uuid("المعرف غير صحيح");
