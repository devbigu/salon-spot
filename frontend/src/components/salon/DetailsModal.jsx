/* eslint-disable react/prop-types */
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { labelize } from "@/utils/salonFormat";

const renderValue = (value) => {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
};

const DetailsModal = ({ isOpen, toggle, title, data }) => (
  <Modal isOpen={isOpen} toggle={toggle} size="lg" centered scrollable>
    <ModalHeader toggle={toggle}>{title}</ModalHeader>
    <ModalBody>
      <div className="row g-3">
        {Object.entries(data || {}).map(([key, value]) => (
          <div className="col-md-6" key={key}>
            <div className="border rounded p-3 h-100">
              <div className="overline-title text-soft mb-1">{labelize(key)}</div>
              {typeof value === "object" && value !== null ? (
                <pre className="small mb-0 salon-json">{renderValue(value)}</pre>
              ) : (
                <div>{renderValue(value)}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </ModalBody>
  </Modal>
);

export default DetailsModal;
