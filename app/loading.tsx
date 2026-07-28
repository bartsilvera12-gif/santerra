export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] bg-santerra-black text-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="text-[22px] font-bold tracking-wide">SANTERRA</div>
        <div className="w-40 h-[2px] bg-white/10 overflow-hidden">
          <div className="h-full bg-santerra-red animate-[loading_1.2s_ease-in-out_infinite]" />
        </div>
      </div>
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
