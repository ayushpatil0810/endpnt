import { ThemePicker } from "@/components/ThemePicker";
import { LayoutPicker } from "@/components/LayoutPicker";
import type { ThemeId } from "@/lib/themes";
import type { LayoutId } from "@/lib/layouts";

interface AppearanceTabProps {
  theme: ThemeId | string;
  setTheme: (val: ThemeId) => void;
  layout: LayoutId | string;
  setLayout: (val: LayoutId) => void;
}

export function AppearanceTab({ theme, setTheme, layout, setLayout }: AppearanceTabProps) {
  return (
    <div className="flex flex-col gap-12">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-6">Theme &amp; Appearance</h2>
        <ThemePicker currentTheme={theme} onThemeChange={setTheme} />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-6">Layout Structure</h2>
        <LayoutPicker currentLayout={layout} onLayoutChange={setLayout} />
      </div>
    </div>
  );
}
