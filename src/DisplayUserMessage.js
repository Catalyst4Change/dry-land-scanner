import React, { useEffect } from "react"
import "./App.scss"

export const DisplayUserMessage = ({ userMessage, setUserMessage }) => {
  useEffect(() => {
    setTimeout(() => {
      setUserMessage("")
    }, 10000)
  }, [userMessage])

  return userMessage && <h2 className="user-message center">{userMessage}</h2>
}
