import React from "react"

export const SentScansList = ({ sentScans }) => {
  return (
    <div className="sent-scans-display center">
      {sentScans.length > 0 ? (
        <>
          <h3>Scans submitted in the last 24 hours:</h3>
        </>
      ) : null}
      {sentScans.map((scan, index) => {
        const readableString = scan.join(" - ") // Create a readable string for the inner array
        return (
          <div className="display-scan-option" key={index}>
            <span>{readableString}</span>
          </div>
        )
      })}
    </div>
  )
}
