"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaywallPopup } from "./paywall-popup";

export function CertificateCanvas({
  studentName,
  projectTitle,
  isPremium,
}: {
  studentName: string;
  projectTitle: string;
  isPremium: boolean;
}) {
  const [showPaywall, setShowPaywall] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = (canvas.width = 1200);
    const h = (canvas.height = 850);

    ctx.fillStyle = "#fdfbf7";
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "#0f5132";
    ctx.lineWidth = 15;
    ctx.strokeRect(20, 20, w - 40, h - 40);

    ctx.strokeStyle = "#c5a03c";
    ctx.lineWidth = 3;
    ctx.strokeRect(38, 38, w - 76, h - 76);

    ctx.textAlign = "center";

    ctx.beginPath();
    ctx.arc(w / 2, 130, 48, 0, 2 * Math.PI);
    ctx.fillStyle = "#0b2e1b";
    ctx.fill();
    ctx.strokeStyle = "#c5a03c";
    ctx.lineWidth = 3.5;
    ctx.stroke();

    ctx.fillStyle = "#c5a03c";
    ctx.beginPath();
    ctx.moveTo(w / 2, 98);
    ctx.lineTo(w / 2 + 13, 124);
    ctx.lineTo(w / 2 + 6, 138);
    ctx.lineTo(w / 2 - 6, 138);
    ctx.lineTo(w / 2 - 13, 124);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#20c997";
    ctx.beginPath();
    ctx.arc(w / 2, 108, 3, 0, 2 * Math.PI);
    ctx.arc(w / 2 - 18, 125, 2, 0, 2 * Math.PI);
    ctx.arc(w / 2 + 18, 125, 2, 0, 2 * Math.PI);
    ctx.fill();

    ctx.font = "bold 12px Cairo, sans-serif";
    ctx.fillStyle = "#fdfbf7";
    ctx.fillText("U-Pioneers", w / 2, 155);

    ctx.fillStyle = "#0f5132";
    ctx.font = "bold 44px Cairo, sans-serif";
    ctx.fillText("شهــــادة إنجــــاز رقميــــة", w / 2, 240);

    ctx.fillStyle = "#c5a03c";
    ctx.font = "600 19px Cairo, sans-serif";
    ctx.fillText("ممنوحة من مسرعة الأعمال الرقمية الرسمية U-Pioneers", w / 2, 280);

    ctx.fillStyle = "#071e12";
    ctx.font = "bold 36px Cairo, sans-serif";
    ctx.fillText(studentName, w / 2, 380);

    ctx.strokeStyle = "rgba(197, 160, 60, 0.4)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 150, 410);
    ctx.lineTo(w / 2 + 150, 410);
    ctx.stroke();

    ctx.fillStyle = "#648170";
    ctx.font = "400 16px Cairo, sans-serif";
    ctx.fillText(
      "تقديراً لالتزامه وإتمامه بنجاح كافة الأسلحة الـ16 في مسار التطوير والتسريع التفاعلي،",
      w / 2,
      455
    );
    ctx.fillText(
      "وتطوير خطة عمل استراتيجية جاهزة لطلب وسم \"مشروع مبتكر\" متوافقة مع القرار الوزاري 1275 لمشروعه:",
      w / 2,
      490
    );

    ctx.fillStyle = "#0f5132";
    ctx.font = "bold 24px Cairo, sans-serif";
    ctx.fillText(`" ${projectTitle} "`, w / 2, 545);

    ctx.fillStyle = "#a3bdae";
    ctx.font = "600 14px Cairo, sans-serif";
    const today = new Date().toLocaleDateString("ar-DZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    ctx.fillText(`صدرت بتاريخ: ${today}`, w / 2, 780);
  }, [studentName, projectTitle]);

  function download() {
    if (!isPremium) {
      setShowPaywall(true);
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `شهادة-${studentName}.png`;
    a.click();
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <PaywallPopup open={showPaywall} onClose={() => setShowPaywall(false)} />
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full max-w-2xl rounded-xl border border-gold-500/30 shadow-2xl"
        />
        {!isPremium && (
          <div
            onClick={() => setShowPaywall(true)}
            className="absolute top-4 left-4 flex cursor-pointer items-center gap-2 rounded-lg bg-black/50 px-3 py-2 backdrop-blur-sm transition hover:bg-black/70"
          >
            <Lock className="size-4 text-gold-400" />
            <span className="text-xs font-semibold text-white">مقفل</span>
          </div>
        )}
      </div>
      <Button onClick={download}>
        {isPremium ? (
          <><Download className="size-4" /> تحميل الشهادة</>
        ) : (
          <><Lock className="size-4" /> تحميل الشهادة</>
        )}
      </Button>
    </div>
  );
}
