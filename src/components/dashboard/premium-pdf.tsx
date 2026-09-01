"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaywallPopup } from "./paywall-popup";
import type { Tables } from "@/lib/supabase/database.types";

interface PremiumPdfProps {
  studentName: string;
  projectTitle: string;
  university: string;
  major: string;
  weapons: Tables<"weapons">[];
  answers: Record<number, string>;
  isPremium: boolean;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function PremiumPdf({
  studentName,
  projectTitle,
  university,
  major,
  weapons,
  answers,
  isPremium,
}: PremiumPdfProps) {
  const [showPaywall, setShowPaywall] = useState(false);
  const [generating, setGenerating] = useState(false);

  async function generatePdf() {
    if (!isPremium) {
      setShowPaywall(true);
      return;
    }

    setGenerating(true);

    // Build the HTML content
    const today = new Date().toLocaleDateString("ar-DZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const docId = `UP-${Date.now().toString(36).toUpperCase()}`;

    const weaponRows = weapons
      .map(
        (w) => `
      <tr>
        <td style="font-weight:800;color:#e8720c;font-size:12px;white-space:nowrap;width:30px">${String(w.number).padStart(2, "0")}</td>
        <td style="font-weight:700;color:#0f5132;font-size:11px;white-space:nowrap;width:140px">${w.title}</td>
        <td style="color:#333;line-height:1.5">${escapeHtml(answers[w.number] || "—")}</td>
      </tr>`
      )
      .join("");

    const html = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<style>
  @page { size: A4; margin: 15mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Cairo', sans-serif; color: #1a1a1a; line-height: 1.6; background: white; }
  .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #0f5132; padding-bottom: 16px; margin-bottom: 24px; }
  .header-right { display: flex; align-items: center; gap: 12px; }
  .logo { width: 56px; height: 56px; border-radius: 50%; overflow: hidden; }
  .logo img { width: 100%; height: 100%; object-fit: cover; }
  .header-text h1 { font-size: 18px; font-weight: 800; color: #0f5132; }
  .header-text p { font-size: 11px; color: #666; }
  .header-left { text-align: left; font-size: 11px; color: #888; }
  .doc-title { text-align: center; margin: 24px 0; padding: 20px; background: linear-gradient(135deg, #f0faf3, #e9f3ec); border-radius: 12px; border: 1px solid #c8e6d0; }
  .doc-title h2 { font-size: 22px; font-weight: 800; color: #0f5132; }
  .doc-title .subtitle { font-size: 13px; color: #666; margin-top: 4px; }
  .info-box { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; padding: 16px; background: #fafafa; border-radius: 10px; border: 1px solid #eee; }
  .info-item { font-size: 12px; }
  .info-item .label { font-weight: 600; color: #888; font-size: 10px; }
  .info-item .value { font-weight: 700; color: #1a1a1a; margin-top: 2px; }
  .weapons-title { font-size: 16px; font-weight: 700; color: #0f5132; margin: 20px 0 12px; padding-bottom: 8px; border-bottom: 2px solid #0f5132; }
  table { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 16px; }
  thead th { background: #0f5132; color: white; padding: 8px 10px; text-align: right; font-weight: 600; font-size: 10px; }
  tbody td { padding: 8px 10px; border-bottom: 1px solid #eee; vertical-align: top; text-align: right; word-wrap: break-word; overflow-wrap: break-word; }
  tbody tr:nth-child(even) { background: #f9f9f9; }
  .footer { margin-top: 24px; padding-top: 12px; border-top: 2px solid #0f5132; display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #888; }
  .footer-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; background: #0f5132; color: white; border-radius: 6px; font-size: 9px; font-weight: 600; }
  .note { margin-top: 16px; padding: 12px 16px; background: #fff8e1; border-radius: 8px; border: 1px solid #ffe082; font-size: 10px; color: #8d6e00; }
</style>
</head>
<body>
<div class="header">
  <div class="header-right">
    <div class="logo"><img src="${window.location.origin}/icons/icon-512.png" alt="U-Pioneers"></div>
    <div class="header-text">
      <h1>U-Pioneers Digital Accelerator</h1>
      <p>مسرعة أعمال رقمية — متوافقة مع القرار الوزاري 1275</p>
    </div>
  </div>
  <div class="header-left">
    <div>التاريخ: ${today}</div>
    <div>رقم المستند: ${docId}</div>
  </div>
</div>

<div class="doc-title">
  <h2>الملف التنفيذي للمشروع</h2>
  <p class="subtitle">مسار الأسلحة الـ16 — ${escapeHtml(projectTitle)}</p>
</div>

<div class="info-box">
  <div class="info-item"><div class="label">المؤسس</div><div class="value">${escapeHtml(studentName)}</div></div>
  <div class="info-item"><div class="label">المشروع</div><div class="value">${escapeHtml(projectTitle)}</div></div>
  <div class="info-item"><div class="label">الجامعة</div><div class="value">${escapeHtml(university)}</div></div>
  <div class="info-item"><div class="label">التخصص</div><div class="value">${escapeHtml(major)}</div></div>
</div>

<div class="weapons-title">مسار الأسلحة الـ16</div>
<table>
  <thead><tr><th style="width:30px">#</th><th style="width:140px">السلاح</th><th>الإجابة</th></tr></thead>
  <tbody>${weaponRows}</tbody>
</table>

<div class="note">
  <strong>ملاحظة:</strong> هذا المستند تم إعداده تلقائياً عبر مسار الأسلحة الـ16 في منصة U-Pioneers.
</div>

<div class="footer">
  <div class="footer-badge">U-Pioneers Digital Accelerator</div>
  <div>© 2026 U-Pioneers — جميع الحقوق محفوظة</div>
  <div>صفحة 1 من 1</div>
</div>
</body>
</html>`;

    // Open in new window and trigger print
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      // Wait for content to render, then trigger print
      setTimeout(() => {
        printWindow.print();
        setGenerating(false);
      }, 500);
    } else {
      // Fallback: download as HTML file
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `الملف-التنفيذي-${projectTitle}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setGenerating(false);
    }
  }

  return (
    <div className="card-luxury rounded-2xl p-6 sm:p-8 print:border-0 print:bg-white print:text-black print:shadow-none">
      <PaywallPopup open={showPaywall} onClose={() => setShowPaywall(false)} />
      <div className="flex items-center justify-between print:hidden">
        <h2 className="text-lg font-bold text-cream">الملف التنفيذي للمشروع</h2>
        <Button size="sm" onClick={generatePdf} disabled={generating}>
          <Download className="size-4" />
          {generating ? "جاري التجهيز..." : "تحميل PDF"}
        </Button>
      </div>

      {/* Preview of first 3 weapons */}
      <div className="mt-4 flex flex-col gap-3">
        {weapons.slice(0, 3).map((w) => (
          <div key={w.number} className="border-b border-border pb-3 last:border-0">
            <p className="text-xs font-bold text-gold-500">
              {String(w.number).padStart(2, "0")} — {w.title}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-cream-dim">
              {answers[w.number] || "—"}
            </p>
          </div>
        ))}
        {weapons.length > 3 && (
          <p className="text-center text-xs text-muted">
            + {weapons.length - 3} أسلحاً أخرى في الملف الكامل
          </p>
        )}
      </div>
    </div>
  );
}
