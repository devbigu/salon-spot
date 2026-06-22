/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Modal,
  ModalBody,
  ModalHeader,
  Spinner,
} from "reactstrap";
import { Button } from "@/components/Component";
import PageShell from "@/components/salon/PageShell";
import DataGrid from "@/components/salon/DataGrid";
import SchemaModal from "@/components/salon/SchemaModal";
import StatusBadge from "@/components/salon/StatusBadge";
import { useAuth } from "@/auth/AuthContext";
import { salonApi } from "@/services/salonApi";
import { formatDate, labelize } from "@/utils/salonFormat";

const CATEGORIES = [
  "LOGIN_ISSUE",
  "CUSTOMER_MODULE",
  "APPOINTMENT_MODULE",
  "STAFF_MODULE",
  "SERVICE_MODULE",
  "BILLING_INVOICE",
  "PAYMENT_MODULE",
  "REPORTS",
  "PERFORMANCE",
  "BUG",
  "OTHER",
];

const TRANSITIONS = {
  OPEN: ["IN_PROGRESS", "WAITING_FOR_USER", "REJECTED"],
  IN_PROGRESS: ["WAITING_FOR_USER", "RESOLVED", "REJECTED"],
  WAITING_FOR_USER: ["IN_PROGRESS"],
  RESOLVED: ["CLOSED"],
  CLOSED: [],
  REJECTED: [],
};

const Support = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [action, setAction] = useState(null);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const isSuper = user?.role === "SUPER_ADMIN";

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = isSuper
        ? await salonApi.support.list()
        : await salonApi.support.mine();
      setTickets(response.data || []);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, [isSuper]);

  useEffect(() => {
    load();
  }, [load]);

  const viewTicket = async (ticket) => {
    setDetailLoading(true);
    setDetail(ticket);
    try {
      const response = await salonApi.support.get(ticket.id);
      setDetail(response.data);
    } catch (viewError) {
      setError(viewError.message);
    } finally {
      setDetailLoading(false);
    }
  };

  const form = useMemo(() => {
    if (action === "message") {
      return {
        title: `Reply · ${selected?.ticketCode}`,
        submitLabel: "Add message",
        fields: [
          {
            name: "message",
            label: "Message",
            type: "textarea",
            fullWidth: true,
            required: true,
            rows: 5,
          },
          ...(isSuper
            ? [
                {
                  name: "isInternalNote",
                  label: "Internal support note",
                  type: "checkbox",
                },
              ]
            : []),
        ],
        submit: (values) => salonApi.support.addMessage(selected.id, values),
      };
    }
    if (action === "status") {
      return {
        title: `Update ticket · ${selected?.ticketCode}`,
        submitLabel: "Update status",
        fields: [
          {
            name: "status",
            label: "New status",
            type: "select",
            required: true,
            options: (TRANSITIONS[selected?.status] || []).map((value) => ({
              value,
              label: labelize(value),
            })),
          },
          { name: "note", label: "Transition note", type: "textarea", fullWidth: true },
          { name: "resolutionNotes", label: "Resolution notes", type: "textarea", fullWidth: true },
        ],
        submit: (values) => salonApi.support.setStatus(selected.id, values),
      };
    }
    if (action === "assign") {
      return {
        title: `Assign ticket · ${selected?.ticketCode}`,
        submitLabel: "Assign ticket",
        fields: [
          {
            name: "assignedToId",
            label: "Platform support admin user ID",
            required: true,
            fullWidth: true,
            help: "The backend currently has no API that lists platform support admins, so enter the target SUPER_ADMIN UUID.",
          },
        ],
        submit: (values) =>
          salonApi.support.assign(selected.id, values.assignedToId),
      };
    }
    return {
      title: "Raise support ticket",
      submitLabel: "Create ticket",
      fields: [
        { name: "title", label: "Title", required: true, fullWidth: true },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          required: true,
          fullWidth: true,
          rows: 6,
        },
        {
          name: "category",
          label: "Category",
          type: "select",
          defaultValue: "OTHER",
          options: CATEGORIES.map((value) => ({
            value,
            label: labelize(value),
          })),
        },
        {
          name: "priority",
          label: "Priority",
          type: "select",
          defaultValue: "MEDIUM",
          options: ["LOW", "MEDIUM", "HIGH", "URGENT"].map((value) => ({
            value,
            label: labelize(value),
          })),
        },
        { name: "errorMessage", label: "Error message", type: "textarea", fullWidth: true },
      ],
      submit: (values) =>
        salonApi.support.create({
          ...values,
          pageUrl: window.location.href,
          browserInfo: navigator.userAgent,
        }),
    };
  }, [action, isSuper, selected]);

  return (
    <PageShell
      title="Support"
      description={
        isSuper
          ? "Platform support queue, assignment, conversation, and status workflow."
          : "Raise tickets and follow the conversation with platform support."
      }
      actionLabel="Raise ticket"
      onAction={() => {
        setSelected(null);
        setAction("create");
      }}
    >
      {error && <Alert color="danger">{error}</Alert>}
      <DataGrid
        rows={tickets}
        loading={loading}
        onView={viewTicket}
        columns={[
          { key: "ticketCode", label: "Ticket" },
          { key: "title", label: "Title" },
          ...(isSuper ? [{ key: "reporterEmail", label: "Reporter" }] : []),
          { key: "category", label: "Category", render: labelize },
          { key: "priority", label: "Priority", render: (value) => <StatusBadge value={value} /> },
          { key: "status", label: "Status", render: (value) => <StatusBadge value={value} /> },
          { key: "updatedAt", label: "Updated", render: (value) => formatDate(value, true) },
        ]}
        renderActions={(row) => (
          <>
            <Button
              size="sm"
              color="info"
              outline
              onClick={() => {
                setSelected(row);
                setAction("message");
              }}
            >
              Reply
            </Button>
            {isSuper && TRANSITIONS[row.status]?.length > 0 && (
              <Button
                size="sm"
                color="primary"
                outline
                className="ms-1"
                onClick={() => {
                  setSelected(row);
                  setAction("status");
                }}
              >
                Status
              </Button>
            )}
            {isSuper && (
              <Button
                size="sm"
                color="light"
                className="ms-1"
                onClick={() => {
                  setSelected(row);
                  setAction("assign");
                }}
              >
                Assign
              </Button>
            )}
          </>
        )}
      />
      <SchemaModal
        isOpen={Boolean(action)}
        toggle={() => setAction(null)}
        title={form.title}
        fields={form.fields}
        submitLabel={form.submitLabel}
        onSubmit={async (values) => {
          await form.submit(values);
          await load();
          if (detail?.id) await viewTicket(detail);
        }}
      />
      <Modal
        isOpen={Boolean(detail)}
        toggle={() => setDetail(null)}
        size="lg"
        centered
        scrollable
      >
        <ModalHeader toggle={() => setDetail(null)}>
          {detail?.ticketCode} · {detail?.title}
        </ModalHeader>
        <ModalBody>
          {detailLoading ? (
            <div className="text-center py-5"><Spinner color="primary" /></div>
          ) : (
            <>
              <div className="d-flex flex-wrap gap-2 mb-3">
                <StatusBadge value={detail?.status} />
                <StatusBadge value={detail?.priority} />
                <span className="badge badge-dim bg-light">
                  {labelize(detail?.category)}
                </span>
              </div>
              <div className="card card-bordered mb-3">
                <div className="card-inner">
                  <p className="mb-0">{detail?.description}</p>
                  {detail?.errorMessage && (
                    <pre className="salon-json mt-3 mb-0">{detail.errorMessage}</pre>
                  )}
                </div>
              </div>
              <h6 className="title mb-3">Conversation</h6>
              <div className="d-flex flex-column gap-3">
                {(detail?.messages || []).map((message) => (
                  <div
                    className={`border rounded p-3 ${
                      message.isInternalNote ? "bg-warning-dim" : "bg-light"
                    }`}
                    key={message.id}
                  >
                    <div className="d-flex justify-content-between gap-2 mb-1">
                      <strong>
                        {message.sender?.name || message.senderEmail || "Support user"}
                      </strong>
                      <small className="text-soft">
                        {formatDate(message.createdAt, true)}
                      </small>
                    </div>
                    <p className="mb-0">{message.message}</p>
                    {message.isInternalNote && (
                      <small className="text-warning">Internal note</small>
                    )}
                  </div>
                ))}
                {detail?.messages?.length === 0 && (
                  <p className="text-center text-soft py-3">No messages yet.</p>
                )}
              </div>
            </>
          )}
        </ModalBody>
      </Modal>
    </PageShell>
  );
};

export default Support;
