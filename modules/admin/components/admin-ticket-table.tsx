"use client";

import { useMemo, useState } from "react";
import {
  createColumnHelper,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { MessageCircleIcon } from "lucide-react";
import {
  resolveTicket,
  sendHumanReply,
} from "@/modules/admin/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HumanReplyComposer } from "@/modules/admin/components/human-reply-composer";

export type AdminTicket = {
  id: string;
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  user: { name: string; email: string };
  conversation: { title: string };
};

const features = tableFeatures({});
const columnHelper = createColumnHelper<typeof features, AdminTicket>();

type AdminTicketTableProps = {
  tickets: AdminTicket[];
};

export function AdminTicketTable({ tickets }: AdminTicketTableProps) {
  const [rows, setRows] = useState(tickets);
  const [selectedTicket, setSelectedTicket] = useState<AdminTicket | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  async function handleReply(content: string) {
    if (!selectedTicket || !content.trim()) return;

    setIsSaving(true);
    try {
      const result = await sendHumanReply(selectedTicket.id, content);
      setRows((current) =>
        current.map((ticket) =>
          ticket.id === selectedTicket.id
            ? { ...ticket, status: "IN_PROGRESS" }
            : ticket,
        ),
      );
      setNotification(
        result.emailSent
          ? null
          : "Reply saved, but the customer notification email could not be sent. Check the server logs and email configuration.",
      );
      setSelectedTicket(null);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleResolve(ticketId: string) {
    try {
      const result = await resolveTicket(ticketId);
      setRows((current) => current.filter((ticket) => ticket.id !== ticketId));
      setNotification(
        result.emailSent
          ? null
          : "Ticket resolved, but the customer notification email could not be sent. Check the server logs and email configuration.",
      );
    } catch (error) {
      console.error("Failed to resolve support ticket:", error);
      setNotification("Could not resolve the ticket. Please try again.");
    }
  }

  const columns = useMemo(
    () => columnHelper.columns([
      columnHelper.accessor("title", {
        header: "Ticket",
        cell: ({ row }) => (
          <div className="min-w-48">
            <p className="font-medium">{row.original.title}</p>
            <p className="max-w-72 truncate text-xs text-muted-foreground">
              {row.original.description}
            </p>
          </div>
        ),
      }),
      columnHelper.display({
        id: "customer",
        header: "Customer",
        cell: ({ row }) => (
          <div>
            <p>{row.original.user.name}</p>
            <p className="text-xs text-muted-foreground">
              {row.original.user.email}
            </p>
          </div>
        ),
      }),
      columnHelper.display({
        id: "conversation",
        header: "Conversation",
        cell: ({ row }) => row.original.conversation.title,
      }),
      columnHelper.accessor("priority", {
        header: "Priority",
      }),
      columnHelper.accessor("status", {
        header: "Status",
      }),
      columnHelper.display({
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedTicket(row.original)}
            >
              <MessageCircleIcon />
              Reply
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleResolve(row.original.id)}
            >
              Resolve
            </Button>
          </div>
        ),
      }),
    ]),
    [],
  );

  const table = useTable({
    features,
    data: rows,
    columns,
  });

  return (
    <>
      {notification ? (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{notification}</AlertDescription>
        </Alert>
      ) : null}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : (
                      <table.FlexRender
                        header={header}
                      />
                    )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="py-10 text-center">
                No pending tickets.
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getAllCells().map((cell) => (
                  <TableCell key={cell.id}>
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {selectedTicket ? (
        <HumanReplyComposer
          key={selectedTicket.id}
          ticketTitle={selectedTicket.title}
          isSaving={isSaving}
          onClose={() => setSelectedTicket(null)}
          onSend={handleReply}
        />
      ) : null}
    </>
  );
}
