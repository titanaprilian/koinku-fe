import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { Check, X, AlertTriangle, Info, Loader2 } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <div className="flex items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/40 p-1.5 text-emerald-600 dark:text-emerald-400">
            <Check className="size-5 stroke-[2.5]" />
          </div>
        ),
        error: (
          <div className="flex items-center justify-center rounded-full bg-rose-50 dark:bg-rose-950/40 p-1.5 text-rose-600 dark:text-rose-400">
            <X className="size-5 stroke-[2.5]" />
          </div>
        ),
        warning: (
          <div className="flex items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950/40 p-1.5 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="size-5 stroke-[2.5]" />
          </div>
        ),
        info: (
          <div className="flex items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/40 p-1.5 text-blue-600 dark:text-blue-400">
            <Info className="size-5 stroke-[2.5]" />
          </div>
        ),
        loading: (
          <div className="flex items-center justify-center rounded-full bg-muted p-1.5 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
          </div>
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:!rounded-3xl group-[.toaster]:!px-6 group-[.toaster]:!py-4.5 group-[.toaster]:!items-center !gap-6",
          title: "group-[.toast]:font-bold group-[.toast]:text-foreground group-[.toast]:text-sm",
          description: "group-[.toast]:!text-foreground/90 group-[.toast]:text-xs group-[.toast]:mt-0.5",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-lg",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-lg",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
