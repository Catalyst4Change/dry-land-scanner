import React, { useEffect, useState, startTransition, Suspense } from "react"
import { convertTimeStamp } from "./timestampConverter"
import "./App.scss"

const QrReader = React.lazy(() => import("react-qr-scanner"))

export const QRScanner = ({
  user,
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
    /^[A-Za-z0-9 -:]+\|[A-Za-z0-9 -]+\|[A-Za-z0-9 -]+\|[A-Za-z0-9 -]+$/
  // product | batch | size | quantity
  // vehicle designator | vehicle number/license plate | time | milage

  const handleScan = (data) => {
    if (data) {
      const currentTimeStamp = convertTimeStamp(new Date())
      parseScanData(data.text, currentTimeStamp)
      updateScannerKey()
    }
  }

  const parseScanData = (data, timeStamp) => {
    if (validQRCodePattern.test(data)) {
      const parts = data.split("|")
      const [product, batch, bottleSize, quantity] = parts

      const sanitizedProduct = sanitizeInput(product) // vehicle
      const sanitizedBatch = sanitizeInput(batch) // lic. plate
      const sanitizedBottleSize = sanitizeInput(bottleSize) // check in/out
      const sanitizedQuantity = sanitizeInput(quantity) // milage

      const scanItem = [
        timeStamp,
        sanitizedProduct,
        sanitizedBatch,
        sanitizedBottleSize,
        sanitizedQuantity,
        user,
      ]

      setCurrentScan(scanItem)
      if (sanitizedProduct.includes("Vehicle")) {
        toggleEditModal(true)
      } else {
        toggleEditModal(false)
      }
    } else {
      handleScanError("Invalid QR code data format!")
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
