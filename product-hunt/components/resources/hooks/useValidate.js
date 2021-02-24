import React, { useState, useEffect } from 'react'

const useValidate = (initialState, validate, fn) => {
    const [values, setValues] = useState(initialState)
    const [errors, setErrors] = useState({})
    const [submit, setSubmit] = useState(false)

    useEffect(() => {
        if (submit) {
            const noErrors = Object.keys(errors).length === 0

            if (noErrors) {
                fn()
            }

            setSubmit(false)
        }
    }, [errors])

    const handleInputChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const validationErrors = validate(values)

        setErrors(validationErrors)
        setSubmit(true)
    }

    // Blur event
    const handleBlur = () => {
        const validationErrors = validate(values)
        setErrors(validationErrors)
    }

    return {
        values,
        errors,   
        handleInputChange,
        handleSubmit,
        handleBlur
    }
}

export default useValidate
