import * as React from "react"
import { cn } from "@/lib/utils"

const TableWrapper = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("bg-card text-card-foreground shadow-sm border rounded-xl overflow-hidden", className)}
      {...props}
    />
  )
)
TableWrapper.displayName = "TableWrapper"

const TableWrapperHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("p-6 border-b border-border", className)}
      {...props}
    />
  )
)
TableWrapperHeader.displayName = "TableWrapperHeader"

const TableWrapperContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("w-full overflow-auto", className)}
      {...props}
    />
  )
)
TableWrapperContent.displayName = "TableWrapperContent"

const TableWrapperFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-t border-border bg-card", className)}
      {...props}
    />
  )
)
TableWrapperFooter.displayName = "TableWrapperFooter"

export {
  TableWrapper,
  TableWrapperHeader,
  TableWrapperContent,
  TableWrapperFooter,
}
