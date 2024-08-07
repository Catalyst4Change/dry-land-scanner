import React, { useEffect, useState } from "react"
import Modal from "react-modal"
import "./App.scss"
Modal.setAppElement("#root")

export const EditScanModal = ({
  editModalOpen,
  closeModals,
  currentScan,
  setScannedData,
  editIndex,
}) => {
  const [quantity, setQuantity] = useState(null)

  useEffect(() => {
    if (currentScan) {
      const parsedQuantity = parseInt(currentScan.quantity)
      if (!isNaN(parsedQuantity)) {
        setQuantity(parsedQuantity)
      } else {
        setQuantity(0)
      }
    }
  }, [currentScan])

  const handleQuantityChange = (value) => {
    setQuantity(value)
  }

  const stepDown = () => {
    if (quantity > 0) {
      handleQuantityChange(quantity - 1)
    }
  }
  const stepUp = () => {
    handleQuantityChange(quantity + 1)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (editIndex !== null && editIndex >= 0) {
      // Update an existing item
      setScannedData((currentScannedData) =>
        currentScannedData.map((item, index) =>
          index === editIndex ? { ...item, quantity } : item
        )
      )
    } else {
      // Add a new item
      setScannedData((currentScannedData) => [
        updatedItem,
        ...currentScannedData,
      ])
    }
    closeModals() // Close the modal after submission
    setQuantity(0)
  }

  const handleCancel = () => {
    closeModals() // Just close the modal without saving changes
  }

  return (
    <Modal
      isOpen={editModalOpen}
      onRequestClose={handleCancel}
      contentLabel="Edit Scan"
    >
      <form className="modal-form center" onSubmit={(e) => handleSubmit(e)}>
        <span style={{ fontWeight: "bold", fontSize: "25px" }}>
          Product: {currentScan.product}
        </span>
        <span style={{ fontWeight: "bold", fontSize: "25px" }}>
          Batch: {currentScan.batch}
        </span>
        <span style={{ fontWeight: "bold", fontSize: "25px" }}>
          Size: {currentScan.size}ml
        </span>

        <h2>Edit Quantity:</h2>
        <div className="quantity-adjust">
          <button
            type="button"
            className="stepper button positive"
            onClick={stepDown}
          >
            -
          </button>
          <div>
            <p className="quantity-display">{quantity}</p>
          </div>
          <button
            type="button"
            className="stepper button positive"
            onClick={stepUp}
          >
            +
          </button>
        </div>

        <div className="modal-options">
          <button
            className="cancel-quantity button negative"
            type="button"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button className="submit-quantity button positive" type="submit">
            Save
          </button>
        </div>
      </form>
    </Modal>
  )
}
