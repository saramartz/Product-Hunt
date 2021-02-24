import React, { useState, useContext } from 'react'
import { css } from '@emotion/react'
import { Form, Field, InputSubmit, Error } from '../components/shared/form'
import Router, { useRouter } from 'next/router'
import FileUploader from 'react-firebase-file-uploader'
import Layout from '../components/layout/Layout'
import { FirebaseContext } from '../firebase'

// Validation
import useValidate from '../components/resources/hooks/useValidate'
import validateProduct from '../components/resources/validation/validateProduct'
import Error404 from '../components/shared/404'

const NewProduct = () => {
    const INITIAL_STATE = {
        name: '',
        company: '',
        image: '',
        url: '',
        description: '',
    }

    // Images state
    const [imagename, setImageName] = useState('')
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [urlimage, setUrlImage] = useState('')

    const [error, setError] = useState(false)

    const { values, errors, handleInputChange, handleSubmit, handleBlur } = useValidate(
        INITIAL_STATE,
        validateProduct,
        createProduct
    )

    const { name, company, image, url, description } = values

    // Hook to Redirect
    const router = useRouter()

    // Context with firebase CRUD operations
    const { user, firebase } = useContext(FirebaseContext)

    async function createProduct() {
        if (!user) {
            return router.push('/login')
        }

        // Create product object schema
        const product = {
            name,
            company,
            url,
            urlimage,
            description,
            votes: 0,
            reviews: [],
            created: Date.now(),
            author: {
                id: user.uid,
                name: user.displayName,
            },
            voted: []
        }

        // Add to database
        firebase.db.collection('products').add(product)

        return router.push('/')
    }

    const handleUploadStart = () => {
        setProgress(0)
        setLoading(true)
    }

    const handleProgress = (progress) => setProgress({ progress })

    const handleUploadError = (error) => {
        setLoading(error)
        console.error(error)
    }

    const handleUploadSuccess = (filename) => {
        setProgress(100)
        setLoading(false)
        setImageName(filename)
        firebase.storage
            .ref('products')
            .child(filename)
            .getDownloadURL()
            .then((url) => setUrlImage(url))
    }

    return (
        <>
            <Layout>
                {!user ? (
                    <Error404 />
                ) : (
                    <>
                        <h1
                            css={css`
                                text-align: center;
                                margin-top: 5rem;
                            `}
                        >
                            NEW PRODUCT
                        </h1>
                        <Form onSubmit={handleSubmit} noValidate>
                            <fieldset>
                                <legend>General Information</legend>

                                <Field>
                                    <label htmlFor='name'>Name</label>
                                    <input
                                        type='text'
                                        id='name'
                                        name='name'
                                        placeholder='Product name'
                                        value={name}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                    />
                                </Field>
                                <Field>
                                    <label htmlFor='company'>Company</label>
                                    <input
                                        type='text'
                                        id='company'
                                        name='company'
                                        placeholder='Company'
                                        value={company}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                    />
                                </Field>
                                <Field>
                                    <label htmlFor='image'>Image</label>
                                    <FileUploader
                                        accept='image/*'
                                        id='image'
                                        name='image'
                                        randomizeFilename
                                        storageRef={firebase.storage.ref('products')}
                                        onUploadStart={handleUploadStart}
                                        onUploadError={handleUploadError}
                                        onUploadSuccess={handleUploadSuccess}
                                        onProgress={handleProgress}
                                    />
                                </Field>
                            </fieldset>
                            <fieldset>
                                <legend>About your product</legend>
                                <Field>
                                    <label htmlFor='url'>URL</label>
                                    <input
                                        type='url'
                                        id='url'
                                        name='url'
                                        placeholder='Url'
                                        value={url}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                    />
                                </Field>
                                <Field>
                                    <label htmlFor='description'>Description</label>
                                    <textarea
                                        id='description'
                                        name='description'
                                        value={description}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                    />
                                </Field>
                            </fieldset>

                            {/* Errors */}

                            {errors.name && <Error>{errors.name}</Error>}
                            {errors.company && <Error>{errors.company}</Error>}
                            {errors.url && <Error>{errors.url}</Error>}
                            {errors.description && <Error>{errors.description}</Error>}

                            {error && <Error>{error}</Error>}

                            <InputSubmit type='submit' value='ADD' />
                        </Form>
                    </>
                )}
            </Layout>
        </>
    )
}

export default NewProduct
