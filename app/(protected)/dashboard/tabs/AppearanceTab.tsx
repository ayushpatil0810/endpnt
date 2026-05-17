import { ThemePicker } from "@/components/ThemePicker";

interface AppearanceTabProps {
  background: string;
  setBackground: (val: string) => void;
}

export function AppearanceTab({ background, setBackground }: AppearanceTabProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-6">Theme & Appearance</h2>
      <ThemePicker currentBackground={background} onBackgroundChange={setBackground} />
    </div>
  );
}
