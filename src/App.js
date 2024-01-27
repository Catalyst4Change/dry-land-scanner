import React, { useState } from "react"
import { QRScanner } from "./QRScanner"
import { LogIn } from "./LogIn"
import { DisplayUserMessage } from "./DisplayUserMessage"
import { EditScanModal } from "./EditScanModal"
import { DisplayScans } from "./DisplayScans"
import { SendToSheet } from "./SendToSheet"
import logo from "./Assets/DrylandLogo.png"
import "./App.css"

export const App = () => {
  const [user, setUser] = useState(null)
  const [userMessage, setUserMessage] = useState("")
  const [scannedData, setScannedData] = useState([])
  const [editIndex, setEditIndex] = useState(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [scanning, setScanning] = useState(false)

  const toggleEditModal = () => {
    setEditModalOpen((editModalOpen) => !editModalOpen)
  }

  const setUserName = (userName) => {
    setUser(userName)
    setScanning(true)
  }

  const changeEditIndex = (target) => {
    setEditIndex(target)
  }

  const clearScannedData = () => {
    setScannedData([])
  }

  return (
    <main className="App">
      <div className="logo_container">
        <img src={logo} alt="Dry Land Distillery Logo" />
      </div>

      <LogIn
        user={user}
        setUserName={setUserName}
        setUserMessage={setUserMessage}
      />

      {scanning ? (
        <QRScanner
          user={user}
          userMessage={userMessage}
          setUserMessage={setUserMessage}
          scannedData={scannedData}
          setScannedData={setScannedData}
          setEditIndex={setEditIndex}
          toggleEditModal={toggleEditModal}
          setScanning={setScanning}
        />
      ) : (
        <></>
      )}

      <DisplayUserMessage
        userMessage={userMessage}
        setUserMessage={setUserMessage}
      />

      <DisplayScans
        scannedData={scannedData}
        setScannedData={setScannedData}
        changeEditIndex={changeEditIndex}
        toggleEditModal={toggleEditModal}
      />

      {/* edit data and quantity (modal) */}

      <EditScanModal
        editModalOpen={editModalOpen}
        toggleEditModal={toggleEditModal}
        scannedData={scannedData}
        editIndex={editIndex}
        setEditIndex={setEditIndex}
        setScannedData={setScannedData}
        setScanning={setScanning}
      />

      {/* send verified data to sheet */}

      <SendToSheet
        scannedData={scannedData}
        setUserMessage={setUserMessage}
        clearScannedData={clearScannedData}
      />
    </main>
  )
}
// space bar causing invalid qr error
// sending to sheet clears scannedData
// need cancel edit quantity button
// deny camera error loop
// confirm scans before submission
// login > scan > prompt edit quantity > save > display removable list items > re-scan... > submit

// added matt √
// changed target sheet √
// make quantity editable √
// add no access error handling √
// make sure multiple scans display √
// remove scanned data on sendToSheet √

// add reload prompt if scanning stops X
