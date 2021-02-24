import React, { useState, useEffect } from 'react'
import firebase from '../../../firebase'

const useAuth = () => {
    const [loggedUser, setLoggedUser] = useState(null)

    useEffect(() => {
        const unsuscribe = firebase.auth.onAuthStateChanged((user) => {
            user ? setLoggedUser(user) : setLoggedUser(null)
        })
        return () => unsuscribe()
    }, [])

    return loggedUser
}

export default useAuth
