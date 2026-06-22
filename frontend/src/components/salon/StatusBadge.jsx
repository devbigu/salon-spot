/* eslint-disable react/prop-types */
import { labelize } from "@/utils/salonFormat";

const colorMap = {
  ACTIVE: "success",
  PAID: "success",
  COMPLETE: "success",
  COMPLETED: "success",
  CONFIRMED: "info",
  CHECKED_IN: "primary",
  PREMIUM: "primary",
  ISSUED: "info",
  RESOLVED: "success",
  CLOSED: "dark",
  OPEN: "warning",
  IN_PROGRESS: "info",
  WAITING_FOR_USER: "warning",
  SCHEDULED: "light",
  REGULAR: "light",
  UNPAID: "danger",
  PARTIALLY_PAID: "warning",
  CANCELLED: "danger",
  NO_SHOW: "danger",
  IRREGULAR: "danger",
  REJECTED: "danger",
  URGENT: "danger",
  HIGH: "warning",
  MEDIUM: "info",
  LOW: "light",
};

const StatusBadge = ({ value }) => {
  const normalized =
    typeof value === "boolean" ? (value ? "ACTIVE" : "INACTIVE") : value;
  return (
    <span className={`badge badge-dim bg-${colorMap[normalized] || "light"}`}>
      {labelize(normalized || "Unknown")}
    </span>
  );
};

export default StatusBadge;
