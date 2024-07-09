import React, { useEffect, useState } from "react"
import Modal from "react-modal"
import "./App.scss"
Modal.setAppElement("#root")

export const DeleteItemModal = ({
  currentScan,
  deleteModalOpen,
  editIndex,
  deleteItem,
  closeModals,
}) => {
  const handleSubmit = (event) => {
    event.preventDefault()

    deleteItem(editIndex)
    closeModals() // Close the modal after submission
  }

  const handleCancel = () => {
    closeModals() // Just close the modal without saving changes
  }

  return (
    <Modal
      isOpen={deleteModalOpen}
      onRequestClose={handleCancel}
      contentLabel="Edit Scan"
    >
      <form className="modal-form center" onSubmit={(e) => handleSubmit(e)}>
        <span style={{ fontWeight: "bold", fontSize: "25px" }}>
          Product: {currentScan[1]}
        </span>
        <span style={{ fontWeight: "bold", fontSize: "25px" }}>
          Batch: {currentScan[2]}
        </span>
        <span style={{ fontWeight: "bold", fontSize: "25px" }}>
          Size: {currentScan[3]}ml
        </span>
        <span style={{ fontWeight: "bold", fontSize: "25px" }}>
          Quantity: {currentScan[4]}ct
        </span>
        <h2>Are you sure you want to delete this scan?</h2>
        <div className="modal-options">
          <button
            className="cancel-quantity button positive"
            type="button"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button className="submit-quantity button negative" type="submit">
            Delete
          </button>
        </div>
      </form>
    </Modal>
  )
}
