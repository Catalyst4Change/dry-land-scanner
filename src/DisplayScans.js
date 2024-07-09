import React from "react"
import "./App.scss"

export const DisplayScans = ({
  scannedData,
  setEditIndex,
  toggleEditModal,
  handleRemove,
  setCurrentScan,
}) => {
  const handleEdit = (index) => {
    setEditIndex(index)
    setCurrentScan(scannedData[index])
    toggleEditModal(false)
  }

  return (
    <div className="scan-display center">
      {scannedData.map((scan, index) => {
        const readableString = `${scan[1]} - batch ${scan[2]} - ${scan[3]}ml - ${scan[4]}ct`
        return (
          <div className="display-scan-option center" key={index}>
            <span>{readableString}</span>
            <div className="option-buttons ">
              <button
                className="button neutral"
                type="button"
                onClick={() => handleEdit(index)}
              >
                Edit
              </button>
              <button
                className="button negative"
                type="button"
                onClick={() => handleRemove(index)}
              >
                Delete
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
