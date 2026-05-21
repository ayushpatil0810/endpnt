import Link from "next/link";

/**
 * Minimal branded footer rendered on every public profile page.
 * Kept intentionally lightweight — just a separator and an "Endpoint" backlink.
 */
export function ProfileFooter() {
  return (
    <footer
      className="mt-24 pt-12 pb-12 w-full flex flex-col items-center gap-4 text-[11px] font-mono tracking-widest uppercase relative z-10"
      style={{ color: "var(--theme-text-secondary)" }}
    >
      <div
        className="w-12 h-px"
        style={{ background: "var(--theme-separator)" }}
      />
      <Link
        href="/"
        className="font-bold transition-colors hover:opacity-80"
        style={{ color: "var(--theme-text-primary)" }}
      >
        Endpoint
      </Link>
    </footer>
  );
}
