import React from "react";
import Modal from "./Modal";
import Button from "./Button";

const ConfirmDialog = ({ open, onClose, onConfirm, title = "Are you sure?", description, confirmLabel = "Confirm", tone = "danger", loading }) => (
  <Modal open={open} onClose={onClose} title={title} size="sm">
    {description && <p className="text-sm text-navy-500">{description}</p>}
    <div className="mt-6 flex justify-end gap-3">
      <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
      <Button variant={tone === "danger" ? "danger" : "primary"} onClick={onConfirm} loading={loading}>
        {confirmLabel}
      </Button>
    </div>
  </Modal>
);

export default ConfirmDialog;
