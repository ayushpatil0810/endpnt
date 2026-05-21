import {
  IconBrandFacebook,
  IconBrandX,
  IconBrandInstagram,
  IconBrandTelegram,
  IconBrandYoutube,
  IconMail,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandWhatsapp,
  IconLink,
} from "@tabler/icons-react";

interface LinkIconProps {
  title: string;
  url: string;
  className?: string;
}

export function LinkIcon({ title, url, className = "" }: LinkIconProps) {
  const t = title.toLowerCase();
  const u = url.toLowerCase();

  const iconProps = { className: `w-5 h-5 shrink-0 ${className}` };

  if (t.includes("facebook") || u.includes("facebook.com"))
    return <IconBrandFacebook {...iconProps} />;
  if (
    t === "x" ||
    t.includes("twitter") ||
    u.includes("twitter.com") ||
    u.includes("x.com")
  )
    return <IconBrandX {...iconProps} />;
  if (t.includes("instagram") || u.includes("instagram.com"))
    return <IconBrandInstagram {...iconProps} />;
  if (t.includes("telegram") || u.includes("t.me"))
    return <IconBrandTelegram {...iconProps} />;
  if (
    t.includes("youtube") ||
    u.includes("youtube.com") ||
    u.includes("youtu.be")
  )
    return <IconBrandYoutube {...iconProps} />;
  if (t.includes("email") || u.includes("mailto:"))
    return <IconMail {...iconProps} />;
  if (t.includes("github") || u.includes("github.com"))
    return <IconBrandGithub {...iconProps} />;
  if (t.includes("linkedin") || u.includes("linkedin.com"))
    return <IconBrandLinkedin {...iconProps} />;
  if (t.includes("whatsapp") || u.includes("wa.me"))
    return <IconBrandWhatsapp {...iconProps} />;

  let hostname = "";
  let isUrlValid = false;

  try {
    if (u.startsWith("http://") || u.startsWith("https://")) {
      hostname = new URL(url).hostname;
      isUrlValid = true;
    }
  } catch {
    // Ignore error, handle via check below
  }

  if (!isUrlValid) {
    return <IconLink {...iconProps} />;
  }

  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=64`}
      alt=""
      className={`w-5 h-5 shrink-0 rounded-none object-cover bg-white/10 ${className}`}
    />
  );
}
