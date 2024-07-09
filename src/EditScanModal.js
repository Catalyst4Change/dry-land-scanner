import React, { useEffect, useState } from "react"
import Modal from "react-modal"
import "./App.scss"
Modal.setAppElement("#root")

export const EditScanModal = ({
  editModalOpen,
  closeModals,
  scanItem,
  setScannedData,
  editIndex,
}) => {
  const [quantity, setQuantity] = useState(null)

  useEffect(() => {
    if (scanItem.length > 0) {
      const parsedQuantity = parseInt(scanItem[4])
      if (!isNaN(parsedQuantity)) {
        setQuantity(parsedQuantity)
      } else {
        setQuantity(0)
      }
    }
  }, [scanItem])

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

    const updatedItem = [...scanItem]
    updatedItem[4] = quantity // Update the quantity in the item

    if (editIndex !== null && editIndex >= 0) {
      // Update an existing item
      setScannedData((currentScannedData) =>
        currentScannedData.map((item, index) =>
          index === editIndex ? updatedItem : item
        )
      )
    } else {
      // Add a new item
      setScannedData((currentScannedData) => [
        updatedItem,
        ...currentScannedData
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
          Product: {scanItem[1]}
        </span>
        <span style={{ fontWeight: "bold", fontSize: "25px" }}>
          Batch: {scanItem[2]}
        </span>
        <span style={{ fontWeight: "bold", fontSize: "25px" }}>
          Size: {scanItem[3]}ml
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
