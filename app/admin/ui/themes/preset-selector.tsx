import { Check, Palette } from 'lucide-react'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { themePresets, type ThemePreset } from './presets'
import { useThemePreset } from './theme-context'

export function PresetSelector() {
  const { preset, setPreset } = useThemePreset()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="scale-95 rounded-full"
          title="设计预设风格"
        >
          <Palette className="h-4 w-4" />
          <span className="sr-only">切换设计预设</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>设计预设 (Presets)</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(Object.keys(themePresets) as ThemePreset[]).map((key) => {
          const item = themePresets[key]
          const isSelected = preset === key
          return (
            <DropdownMenuItem
              key={key}
              onClick={() => setPreset(key)}
              className="flex cursor-pointer items-center justify-between"
            >
              <div>
                <div className="text-xs font-medium">{item.name}</div>
                <div className="text-muted-foreground text-[10px]">
                  {item.density === 'compact' ? '紧凑密度' : '适中密度'}
                </div>
              </div>
              {isSelected && <Check className="text-primary h-4 w-4" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
