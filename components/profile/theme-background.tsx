/**
 * Per-theme decorative background elements.
 *
 * Rendered once per profile page, beneath the content layer (z-0).
 * Each theme that needs ambient decoration defines it here. Themes without
 * decoration return null, keeping the DOM clean.
 */
export function ThemeBackground({ themeId }: { themeId: string }) {
  let content = null;

  if (themeId === "glassmorphism") {
    content = (
      <>
        <div
          className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none z-0 opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(138, 43, 226, 0.5) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none z-0 opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(0, 200, 255, 0.4) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute bottom-[5%] left-[20%] w-[400px] h-[400px] rounded-full pointer-events-none z-0 opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(255, 100, 200, 0.3) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </>
    );
  } else if (themeId === "neo-brutalism") {
    content = (
      <>
        {/* Halftone dot grid */}
        <div
          className="absolute inset-0 pointer-events-none z-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #1a1a1a 1.5px, transparent 1.5px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Bold accent stripe */}
        <div
          className="absolute top-0 left-0 right-0 h-2 pointer-events-none z-0"
          style={{ background: "#ff6b35" }}
        />
      </>
    );
  } else if (themeId === "neumorphism") {
    content = (
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />
    );
  } else if (themeId === "claymorphism") {
    content = (
      <>
        <div
          className="absolute top-[-15%] right-[-5%] w-[500px] h-[500px] rounded-full pointer-events-none z-0 opacity-40"
          style={{
            background:
              "radial-gradient(circle, rgba(249, 168, 212, 0.6) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full pointer-events-none z-0 opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(167, 139, 250, 0.5) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </>
    );
  }

  if (!content) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {content}
    </div>
  );
}
