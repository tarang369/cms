export default function ImagePlaceholder({ label = "Image coming soon" }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-zinc-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#e4e4e7_0,_#f4f4f5_45%,_#fafafa_100%)]" />
      <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="relative z-10 flex h-full items-center justify-center px-4 text-center text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
        {label}
      </div>
    </div>
  );
}

