import React, { useState } from 'react'
import { css } from '@emotion/react'
import { Form, Field, InputSubmit, Error } from '../components/shared/form'
import Router from 'next/router'
import Layout from '../components/layout/Layout'
import firebase from '../firebase'

// Validation
import useValidate from '../components/resources/hooks/useValidate'
import validateLogin from '../components/resources/validation/validateLogin'

const Login = () => {
    const initialState = {
        email: '',
        password: '',
    }
    const [error, setError] = useState(false)

    const { values, errors, handleInputChange, handleSubmit, handleBlur } = useValidate(
        initialState,
        validateLogin,
        login
    )

    const { email, password } = values

    async function login() {
        try {
            const user = await firebase.login(email, password)
            Router.push('/')
        } catch (error) {
            console.error('Error while login', error.message)
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
                    LOGIN
                </h1>
                <Form onSubmit={handleSubmit} noValidate>              
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

                    {errors.email && <Error>{errors.email}</Error>}
                    {errors.password && <Error>{errors.password}</Error>}

                    {error && <Error>{error}</Error>}

                    <InputSubmit type='submit' value='SEND' />
                </Form>
            </Layout>
        </>
    )
}

export default Login
