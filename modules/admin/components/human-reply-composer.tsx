"use client";

import { useRef, useState } from "react";
import {
  BoldIcon,
  Code2Icon,
  FileTextIcon,
  Heading2Icon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  PaperclipIcon,
  XIcon,
} from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MarkdownMessage } from "@/components/ui/markdown-message";
import { Textarea } from "@/components/ui/textarea";

type HumanReplyComposerProps = {
  ticketTitle: string;
  isSaving: boolean;
  onClose: () => void;
  onSend: (content: string) => Promise<void>;
};

function fileKey(file: File) {
  return `${file.name}:${file.size}:${file.lastModified}`;
}

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function HumanReplyComposer({
  ticketTitle,
  isSaving,
  onClose,
  onSend,
}: HumanReplyComposerProps) {
  const [reply, setReply] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function addFiles(incomingFiles: FileList | File[]) {
    const newFiles = Array.from(incomingFiles);
    if (newFiles.length === 0) return;

    setFiles((current) => {
      const currentKeys = new Set(current.map(fileKey));
      return [
        ...current,
        ...newFiles.filter((file) => !currentKeys.has(fileKey(file))),
      ];
    });
  }

  function formatSelection(before: string, after = "", placeholder = "text") {
    const textarea = textareaRef.current;
    const start = textarea?.selectionStart ?? reply.length;
    const end = textarea?.selectionEnd ?? reply.length;
    const selected = reply.slice(start, end) || placeholder;
    const updated = `${reply.slice(0, start)}${before}${selected}${after}${reply.slice(end)}`;

    setReply(updated);
    setActiveTab("write");
    setError(null);
    requestAnimationFrame(() => {
      textarea?.focus();
      textarea?.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  }

  async function handleSend() {
    if (!reply.trim() || files.length > 0 || isSaving) return;

    setError(null);
    try {
      await onSend(reply.trim());
    } catch (sendError) {
      console.error("Failed to send human support reply:", sendError);
      setError("Could not send your reply. Please try again.");
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Reply as human support</DialogTitle>
          <DialogDescription className="truncate">
            {ticketTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-hidden rounded-lg border border-border">
          <div className="flex items-center justify-between border-b border-border bg-muted/40 px-2">
            <div className="flex items-center gap-1" role="tablist" aria-label="Reply editor mode">
              <Button
                type="button"
                role="tab"
                aria-selected={activeTab === "write"}
                variant={activeTab === "write" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("write")}
              >
                Write
              </Button>
              <Button
                type="button"
                role="tab"
                aria-selected={activeTab === "preview"}
                variant={activeTab === "preview" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("preview")}
              >
                Preview
              </Button>
            </div>

            {activeTab === "write" && (
              <div className="flex items-center gap-0.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  title="Bold"
                  aria-label="Bold"
                  onClick={() => formatSelection("**", "**")}
                >
                  <BoldIcon />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  title="Italic"
                  aria-label="Italic"
                  onClick={() => formatSelection("*", "*")}
                >
                  <ItalicIcon />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  title="Heading"
                  aria-label="Heading"
                  onClick={() => formatSelection("## ", "", "Heading")}
                >
                  <Heading2Icon />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  title="Code"
                  aria-label="Code"
                  onClick={() => formatSelection("`", "`")}
                >
                  <Code2Icon />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  title="Link"
                  aria-label="Link"
                  onClick={() => formatSelection("[", "](url)", "link text")}
                >
                  <LinkIcon />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  title="Bulleted list"
                  aria-label="Bulleted list"
                  onClick={() => formatSelection("- ", "", "List item")}
                >
                  <ListIcon />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  title="Numbered list"
                  aria-label="Numbered list"
                  onClick={() => formatSelection("1. ", "", "List item")}
                >
                  <ListOrderedIcon />
                </Button>
              </div>
            )}
          </div>

          <div
            className={isDragging ? "bg-primary/5" : ""}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              addFiles(event.dataTransfer.files);
            }}
            onPaste={(event) => {
              const pastedFiles = event.clipboardData.files;
              if (pastedFiles.length > 0) {
                event.preventDefault();
                addFiles(pastedFiles);
              }
            }}
          >
            {activeTab === "write" ? (
              <Textarea
                ref={textareaRef}
                value={reply}
                onChange={(event) => {
                  setReply(event.target.value);
                  setError(null);
                }}
                placeholder="Write your reply to the customer..."
                aria-label="Write your reply to the customer"
                className="min-h-40 resize-y rounded-none border-0 shadow-none focus-visible:ring-0"
              />
            ) : (
              <div className="min-h-40 px-4 py-3">
                {reply.trim() ? (
                  <MarkdownMessage content={reply} />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Nothing to preview yet.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {files.length > 0 ? (
          <AttachmentGroup className="flex-wrap overflow-visible">
            {files.map((file, index) => (
              <Attachment key={fileKey(file)} size="sm">
                <AttachmentMedia>
                  <FileTextIcon />
                </AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>{file.name}</AttachmentTitle>
                  <AttachmentDescription>
                    {formatFileSize(file.size)} · preview only
                  </AttachmentDescription>
                </AttachmentContent>
                <AttachmentActions>
                  <AttachmentAction
                    type="button"
                    size="icon-xs"
                    aria-label={`Remove ${file.name}`}
                    title={`Remove ${file.name}`}
                    onClick={() =>
                      setFiles((current) =>
                        current.filter((_, currentIndex) => currentIndex !== index),
                      )
                    }
                  >
                    <XIcon />
                  </AttachmentAction>
                </AttachmentActions>
              </Attachment>
            ))}
          </AttachmentGroup>
        ) : null}

        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <DialogFooter className="sm:justify-between">
          <div className="flex flex-col gap-1">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.txt,.csv,.doc,.docx,.xls,.xlsx"
              className="sr-only"
              tabIndex={-1}
              onChange={(event) => {
                addFiles(event.target.files ?? []);
                event.target.value = "";
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <PaperclipIcon />
              Attach files
            </Button>
            <span className="text-xs text-muted-foreground">
              Files are preview-only and won&apos;t be sent yet.
            </span>
          </div>
          <Button
            onClick={handleSend}
            disabled={isSaving || !reply.trim() || files.length > 0}
          >
            {isSaving ? "Sending..." : "Send reply"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
