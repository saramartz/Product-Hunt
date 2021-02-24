import React, { useState } from 'react'
import { css } from '@emotion/react'
import { Form, Field, InputSubmit, Error } from '../components/shared/form'
import Router from 'next/router'
import Layout from '../components/layout/Layout'
import firebase from '../firebase'

// Validation
import useValidate from '../components/resources/hooks/useValidate'
import validateSignup from '../components/resources/validation/validateSignup'

const Signup = () => {
    
    const initialState = {
        name: '',
        email: '',
        password: '',
    }
    const [error, setError] = useState(false)

    const { values, errors, handleInputChange, handleSubmit, handleBlur } = useValidate(
        initialState,
        validateSignup,
        signUp
    )

    const { name, email, password } = values

    async function signUp() {
        try {
            await firebase.signup(name, email, password)
            Router.push('/')
        } catch (error) {
            console.error('Error saving user', error.message)
            setError(error.message)
        }
    }

    return (
        <>
            <Layout>
                <h1
                    css={css`
                        text-align: center;
                        margin-top: 5rem;
                    `}
                >
                    SIGNUP
                </h1>
                <Form onSubmit={handleSubmit} noValidate>
                    <Field>
                        <label htmlFor='name'>Name</label>
                        <input
                            type='text'
                            id='name'
                            name='name'
                            placeholder='Your name'
                            value={name}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                        />
                    </Field>
                    <Field>
                        <label htmlFor='email'>Email</label>
                        <input
                            type='email'
                            id='email'
                            name='email'
                            placeholder='Your email'
                            value={email}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                        />
                    </Field>
                    <Field>
                        <label htmlFor='password'>Password</label>
                        <input
                            type='password'
                            id='password'
                            name='password'
                            placeholder='Your password'
                            value={password}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                        />
                    </Field>

                    {/* Errors */}

                    {errors.name && <Error>{errors.name}</Error>}
                    {errors.email && <Error>{errors.email}</Error>}
                    {errors.password && <Error>{errors.password}</Error>}

                    {error && <Error>{ error }</Error>}

                    <InputSubmit type='submit' value='SEND' />
                </Form>
            </Layout>
        </>
    )
}

export default Signup
