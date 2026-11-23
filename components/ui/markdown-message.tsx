import { cn } from "@/lib/utils";

export function MarkdownMessage({
  content,
  isAnimating = false,
  className,
}: {
  content: string;
  isAnimating?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("whitespace-pre-wrap", isAnimating && "animate-pulse", className)}>
      {content}
    </span>
  );
}
