import React, { useEffect, useState } from "react"
import Modal from "react-modal"
import { sendScansToSheet } from "./SendToSheet"
import { convertTimeStamp } from "./timestampConverter"
import "./App.scss"

export const VehicleModal = ({
  vehicleModalOpen,
  handleCancel,
  currentScan,
  closeModals,
  setUserMessage,
  user,
}) => {
  // vehicle designator/type | vehicle number/license plate | time | milage

  const [vehicleType, setVehicleType] = useState("")
  const [vehicleIdentifier, setVehicleIdentifier] = useState("")
  const [vehicleMilage, setVehicleMilage] = useState("")
  const [vehicleDriver, setVehicleDriver] = useState("")
  const [vehicleCheckedOut, setVehicleCheckedOut] = useState(false)
  const [localVehicle, setLocalVehicle] = useState(null)

  useEffect(() => {
    console.log("currentScan: ", currentScan)

    setVehicleType(currentScan.product)
    setVehicleIdentifier(currentScan.batch)
    setVehicleDriver(user)
    setVehicleMilage("")
  }, [currentScan])

  useEffect(() => {
    confirmLocalVehicle()
  }, [vehicleIdentifier])
  

  const updateMilage = (event) => {
    event.preventDefault()
    setVehicleMilage(event.target.value)
  }

  const clearData = () => {
    setVehicleType("")
    setVehicleIdentifier("")
    setVehicleMilage("")
    setVehicleDriver("")
    setVehicleCheckedOut(false)
    setLocalVehicle(null)
  }

  const confirmLocalVehicle = () => {
    const storedVehicle = localStorage.getItem("vehicleData")
    const parsedVehicle = JSON.parse(storedVehicle)
    setLocalVehicle(parsedVehicle)

    console.log(parsedVehicle, " || ", vehicleIdentifier)

    if (
      parsedVehicle &&
      parsedVehicle.vehicleIdentifier === vehicleIdentifier
    ) {
      console.log("vehicle already checked out")
      setVehicleCheckedOut(true)
    }
  }

  const queryLocalStorage = () => {
    if (!localVehicle) {
      // check in - save vehicle data
      const checkoutTime = Date.now()
      const checkoutData = {
        checkoutTime,
        checkoutType: vehicleType,
        vehicleIdentifier,
        checkoutMilage: vehicleMilage,
        checkoutDriver: vehicleDriver,
      }

      localStorage.setItem("vehicleData", JSON.stringify(checkoutData))
    } else {
      const parsedLocalVehicle = JSON.parse(localVehicle)
      // math milage and time
      const {
        checkoutTime,
        checkoutType,
        vehicleIdentifier,
        checkoutMilage,
        checkoutDriver,
      } = parsedLocalVehicle

      if (parsedLocalVehicle.vehicleIdentifier != vehicleIdentifier) {
        setUserMessage(
          "Please check out of the previous vehicle before checking in a new one!"
        )
        return
      }

      const checkInTime = Date.now()
      const elapsedTime = checkInTime - checkoutTime
      const checkInMilage = vehicleMilage
      const elapsedMilage = checkInMilage - checkoutMilage

      // format data
      const vehicleReturnData = [
        [
          checkoutType,
          vehicleIdentifier,
          convertTimeStamp(checkoutTime),
          convertTimeStamp(checkInTime),
          formatElapsedTime(elapsedTime),
          checkoutMilage,
          checkInMilage,
          elapsedMilage,
          checkoutDriver,
        ],
      ]

      // submit directly to G sheets (page 2)
      console.log("vehicleReturnData:", vehicleReturnData)
      sendScansToSheet(vehicleReturnData, setUserMessage, 2)
      localStorage.removeItem("vehicleData")
    }
  }

  const formatElapsedTime = (elapsedTime) => {
    // Calculate hours, minutes, and seconds
    const totalSeconds = Math.floor(elapsedTime / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)

    // Format hours, minutes, and seconds with leading zeros if needed
    const formattedHours = String(hours).padStart(2, "0")
    const formattedMinutes = String(minutes).padStart(2, "0")

    return `${formattedHours}:${formattedMinutes}`
  }

  const submitData = (event) => {
    event.preventDefault()
    queryLocalStorage()
    closeModals()
    clearData()
  }

  const cancelVehicleEdit = (event) => {
    event.preventDefault()
    closeModals()
    clearData()
  }

  return (
    <Modal
      isOpen={vehicleModalOpen}
      onRequestClose={handleCancel}
      contentLabel="Vehicle Info"
    >
      <form className="modal-form center" onSubmit={(e) => submitData(e)}>
        <h2> {vehicleCheckedOut ? "Check In Vehicle" : "Check Out Vehicle" }</h2>
        <p>Vehicle: {vehicleType}</p>
        <p>Identifier: {vehicleIdentifier}</p>
        <p>Driver: {vehicleDriver}</p>
        {vehicleCheckedOut ? (
          <p>Checkout Milage: {localVehicle.checkoutMilage}</p>
        ) : null}
        <div className="milage-adjust">
          <label htmlFor="milage">
            <p>Enter current milage:</p>
          </label>
          <input
            autoFocus
            type="number"
            name="milage"
            id="milage"
            value={vehicleMilage}
            onChange={(e) => updateMilage(e)}
          />
        </div>
        <button type="submit" className="positive">
          {vehicleCheckedOut ? "Check In" :"Check Out"  }
        </button>
        <button className="negative" onClick={(e) => cancelVehicleEdit(e)}>
          Cancel
        </button>
      </form>
    </Modal>
  )
}
