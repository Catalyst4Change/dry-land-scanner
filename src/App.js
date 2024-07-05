import React, { useEffect, useState } from "react"
import { QRScanner } from "./QRScanner"
import { LogIn } from "./LogIn"
import { DisplayUserMessage } from "./DisplayUserMessage"
import { EditScanModal } from "./EditScanModal"
import { DisplayScans } from "./DisplayScans"
import { sendScansToSheet } from "./SendToSheet"
import { SentScansList } from "./SentScansList"
import "./App.scss"
import { VehicleModal } from "./VehicleModal"

export const App = () => {
  // state
  const [user, setUser] = useState(null)
  const [userMessage, setUserMessage] = useState("")
  const [editIndex, setEditIndex] = useState(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [currentScan, setCurrentScan] = useState([])
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false)

  // local storage
  const [scannedData, setScannedData] = useState(() => {
    const storedScannedData = localStorage.getItem("scannedData")
    return storedScannedData !== null ? JSON.parse(storedScannedData) : []
  })
  const [sentScans, setSentScans] = useState(() => {
    const storedSentScans = localStorage.getItem("sentScans")
    return storedSentScans !== null ? JSON.parse(storedSentScans) : []
  })

  useEffect(() => {
    localStorage.setItem("scannedData", JSON.stringify(scannedData))
    localStorage.setItem("sentScans", JSON.stringify(sentScans))
  }, [scannedData, sentScans])

  useEffect(() => {
    clearLocalStorageIfExpired()
  }, [])

  const toggleEditModal = (isVehicle) => {
    if (isVehicle) {
      setVehicleModalOpen(true)
      setEditModalOpen(false)
    } else {
      setEditModalOpen(true)
      setVehicleModalOpen(false)
    }
    setScanning(false)
  }

  const submitScans = (event) => {
    event.preventDefault()
    sendScansToSheet(scannedData, setUserMessage, 1)
    closeModals()
    clearScannedData()
  }

  const closeModals = () => {
    setVehicleModalOpen(false)
    setEditModalOpen(false)
    setScanning(true)
  }

  const setUserName = (userName) => {
    setUser(userName)
    setScanning(true)
  }

  const handleRemove = (index) => {
    const updatedScans = [...scannedData]
    updatedScans.splice(index, 1)
    setScannedData(updatedScans)
  }

  const clearScannedData = () => {
    setSentScans([...sentScans, ...scannedData])
    setScannedData([])
  }

  const clearCurrentData = () => {
    setCurrentScan([])
    setEditIndex(null)
    setScanning(false)
  }

  const clearLocalStorageIfExpired = () => {
    const storedSentScans = JSON.parse(localStorage.getItem("sentScans"))

    if (storedSentScans) {
      const currentTime = new Date().getTime()

      // Filter scans to keep those within the last 24 hours
      const updatedScans = storedSentScans.filter((scan) => {
        const scanTime = new Date(scan[0]).getTime()
        return currentTime - scanTime <= 24 * 60 * 60 * 1000 // 24 hours in milliseconds
      })
      setSentScans(updatedScans)
    }
  }

  const handleSignOutClick = () => {
    gapi.auth2.getAuthInstance().signOut()
    setUserName(null)
    setScanning(false)
  }

  return (
    <main className="App">
      {user ? null : (
        <LogIn
          user={user}
          setUserName={setUserName}
          setUserMessage={setUserMessage}
        />
      )}

      {scanning ? (
        <QRScanner
          user={user}
          setCurrentScan={setCurrentScan}
          userMessage={userMessage}
          setUserMessage={setUserMessage}
          scannedData={scannedData}
          toggleEditModal={toggleEditModal}
        />
      ) : null}
      {/* edit data and quantity (modal) */}

      <EditScanModal
        editModalOpen={editModalOpen}
        closeModals={closeModals}
        scannedData={scannedData}
        setScannedData={setScannedData}
        scanItem={currentScan}
        editIndex={editIndex}
      />

      <VehicleModal
        vehicleModalOpen={vehicleModalOpen}
        handleCancel={toggleEditModal}
        scanItem={currentScan}
        closeModals={closeModals}
        setUserMessage={setUserMessage}
      />

      <DisplayUserMessage
        userMessage={userMessage}
        setUserMessage={setUserMessage}
      />
      {user ? (
        <>
          <DisplayScans
            scannedData={scannedData}
            setEditIndex={setEditIndex}
            toggleEditModal={toggleEditModal}
            handleRemove={handleRemove}
            setCurrentScan={setCurrentScan}
          />

          {/* send verified data to sheet */}
          <div className="send-to-sheet center">
            {scannedData.length > 0 ? (
              <button
                className="button positive"
                type="button"
                onClick={(e) => submitScans(e)}
              >
                Submit Scans
              </button>
            ) : null}
          </div>
          <SentScansList sentScans={sentScans} />

          <div className="log-out-button center">
            <button className="negative" onClick={handleSignOutClick}>
              LOG OUT
            </button>
          </div>
        </>
      ) : null}
    </main>
  )
}
