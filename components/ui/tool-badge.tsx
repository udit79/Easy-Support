export function ToolBadgeList({ tools }: { tools: string[] }) {
  if (tools.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {tools.map((tool) => (
        <span
          key={tool}
          className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground"
        >
          {tool}
        </span>
      ))}
    </div>
  );
}
