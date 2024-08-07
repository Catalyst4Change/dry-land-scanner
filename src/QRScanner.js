import React, { useEffect, useState, startTransition, Suspense } from "react"
import { convertTimeStamp } from "./timestampConverter"
import "./App.scss"

const QrReader = React.lazy(() => import("react-qr-scanner"))

export const QRScanner = ({
  setCurrentScan,
  setUserMessage,
  toggleEditModal,
}) => {
  const [qrReaderKey, setQrReaderKey] = useState(0)
  const [scanPressed, setScanPressed] = useState(false)

  const sanitizeInput = (input) => {
    // Remove script tags to prevent XSS attacks
    return input.replace(/<script.*?>.*?<\/script>/gi, "")
  }

  const validQRCodePattern =
    /^[A-Za-z0-9 -:]+\|[A-Za-z0-9 -:]+(\|[A-Za-z0-9 -:]+\|[A-Za-z0-9 -:]+)?$/ // vehicle type | identifier/license plate
  // or
  // product | batch | size | quantity

  const handleScan = (data) => {
    updateScannerKey()
    if (data) {
      console.log(data.text)
      const timeStamp = convertTimeStamp(new Date())
      if (validQRCodePattern.test(data.text)) {
        const parts = data.text.split("|")
        const [product, batch, bottleSize = "", quantity = ""] = parts

        const sanitizedProduct = sanitizeInput(product) // vehicle
        const sanitizedBatch = sanitizeInput(batch) // identifier
        const sanitizedBottleSize = sanitizeInput(bottleSize)
        const sanitizedQuantity = sanitizeInput(quantity)

        const currentScan = {
          timeStamp: timeStamp,
          product: sanitizedProduct,
          batch: sanitizedBatch,
          size: sanitizedBottleSize,
          quantity: sanitizedQuantity,
        }

        setCurrentScan(currentScan)
        if (quantity > 0) {
          // is batch
          toggleEditModal(false)
        } else {
          // is vehicle
          toggleEditModal(true)
        }
      } else {
        handleScanError("Invalid QR code data format!")
      }
    }
  }

  const handleScanError = (err) => {
    setUserMessage("Scan Error: " + err)
  }

  const updateScannerKey = () => {
    setQrReaderKey((prevKey) => prevKey + 1)
  }

  const handleTouchStart = (e) => {
    e.preventDefault() // Prevent default action
    startTransition(() => {
      setScanPressed(true)
    })
  }

  const handleTouchEnd = (e) => {
    e.preventDefault() // Prevent default action
    startTransition(() => {
      setScanPressed(false)
    })
    updateScannerKey()
  }

  return (
    <main className="center">
      <div className={"scanner-window"}>
        <div className="qr-scanner-container">
          <Suspense fallback={<div>Loading...</div>}>
            {scanPressed ? (
              <QrReader
                key={qrReaderKey}
                delay={1000}
                constraints={{ video: { facingMode: "environment" } }}
                onError={handleScanError}
                onScan={handleScan}
              />
            ) : null}
          </Suspense>
        </div>
      </div>
      <button
        onTouchStart={handleTouchStart} // Use touch events for mobile
        onTouchEnd={handleTouchEnd} // Use touch events for mobile
        onMouseDown={handleTouchStart} // Optional: for desktop compatibility
        onMouseUp={handleTouchEnd} // Optional: for desktop compatibility
        className="scan-now-button positive"
        style={{
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none",
          userSelect: "none",
          WebkitTapHighlightColor: "transparent",
          WebkitTouchCallout: "none",
        }}
      >
        <span>HOLD TO SCAN</span>
      </button>
    </main>
  )
}
