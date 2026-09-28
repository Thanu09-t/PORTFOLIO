export default function Footer() {
  return (
    <footer className="flex justify-between items-end flex-wrap gap-5 px-6 md:px-24 py-11 border-t border-[#4C5665]">
      <div>
        <div className="font-display font-semibold text-base text-[#E1E3E4]">THANUSHREE S.</div>
        <div className="font-mono text-[10px] text-[#BBC6CF] tracking-wider mt-1.5">
          AI / ML ENGINEER — BANGALORE, INDIA — © 2026
        </div>
      </div>
      <div className="flex items-center gap-2.5 font-mono text-[10px] text-[#F4AEA8] tracking-wider">
        <span className="w-1.5 h-1.5 rounded-full bg-[#920513]" />
        AVAILABLE FOR OPPORTUNITIES
      </div>
    </footer>
  );
}
