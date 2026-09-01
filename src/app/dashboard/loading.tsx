export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="size-10 animate-spin rounded-full border-4 border-gold-500/30 border-t-gold-500" />
        <p className="text-sm text-cream-dim">جاري تحميل لوحة التحكم...</p>
      </div>
    </div>
  );
}
