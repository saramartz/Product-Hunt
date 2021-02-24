import React, { useState, useEffect, useContext } from 'react'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { useRouter } from 'next/router'
import { FirebaseContext } from '../../firebase'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Error404 from '../../components/shared/404'
import Layout from '../../components/layout/Layout'
import { InputSubmit, Field } from '../../components/shared/form'
import Button from '../../components/shared/button'

const Container = styled.div`
    @media (min-width: 768px) {
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
    }
`
const ProductAuthor = styled.p`
    padding: 0.5rem 2rem;
    background-color: #da552f;
    color: #fff;
    text-transform: uppercase;
    font-weight: bold;
    display: inline-block;
    text-align: center;
`

const Product = () => {
    // State
    const [product, setProduct] = useState({})
    const [error, setError] = useState(false)
    const [review, setReview] = useState({})
    const [fetchDB, setFetchDB] = useState(true)

    // Routing to get id
    const router = useRouter()
    const {
        query: { id },
    } = router

    // Firebase Context
    const { firebase, user } = useContext(FirebaseContext)

    // GET PRODUCT
    useEffect(() => {
        if (id && fetchDB) {
            const getProduct = async () => {
                const query = await firebase.db.collection('products').doc(id)
                const product = await query.get()

                if (product.exists) {
                    setProduct(product.data())
                    setFetchDB(false)
                } else {
                    setError(true)
                    setFetchDB(false)
                }
            }
            getProduct()
        }
    }, [id])

    if (Object.keys(product).length === 0 && !error) return 'Loading...'

    const { reviews, created, description, company, name, url, urlimage, votes, author, voted } = product

    // VOTES
    const addVote = () => {
        const totalVotes = votes + 1

        // Check if current user voted
        if (voted.includes(user.uid)) return

        // Save user's who voted
        const whoVoted = [...voted, user.uid]

        //  Update BD
        firebase.db.collection('products').doc(id).update({
            votes: totalVotes,
            voted: whoVoted,
        })

        // Update State
        setProduct({
            ...product,
            votes: totalVotes,
        })

        setFetchDB(true) // Fetch DB because component changes
    }

    // REVIEWS
    const handleInputChange = (e) => {
        setReview({
            ...review,
            [e.target.name]: e.target.value,
        })
    }

    const addReview = (e) => {
        e.preventDefault()

        // Add more fields to review (state)
        review.userId = user.uid
        review.userName = user.displayName

        // Add review to product schema
        const newReviews = [...reviews, review]

        // Update BD
        firebase.db.collection('products').doc(id).update({
            reviews: newReviews,
        })

        // Update state
        setProduct({
            ...product,
            reviews: newReviews,
        })

        setFetchDB(true) // Fetch DB because component changes
    }

    // Identify author review
    const isAuthor = (id) => {
        if (author.id == id) {
            return true
        }
    }

    // DELETE PRODUCT
    const checkAuthor = () => {
        if (!user) return false

        if (author.id === user.uid) {
            return true
        }
    }

    const deleteProduct = async () => {
        if (!user) {
            return router.push('/login')
        }

        if (author.id !== user.uid) {
            return router.push('/')
        }

        try {
            await firebase.db.collection('products').doc(id).delete()
            router.push('/')
        } catch (error) {
            console.error('Error while deleting', error.message)
        }
    }

    return (
        <Layout>
            {error ? (
                <Error404 />
            ) : (
                <div className='container'>
                    <h1
                        css={css`
                            text-align: center;
                            margin-top: 5rem;
                        `}
                    >
                        {name}{' '}
                    </h1>

                    <Container>
                        <div>
                            <p>Posted: {formatDistanceToNow(new Date(created))} </p>
                            <p>
                                By: {author.name} from {company}{' '}
                            </p>

                            <img src={urlimage} />
                            <p>{description}</p>

                            {user && (
                                <>
                                    <h2>Add your review</h2>
                                    <form onSubmit={addReview}>
                                        <Field>
                                            <input type='text' name='message' onChange={handleInputChange} />
                                        </Field>
                                        <InputSubmit type='submit' value='Add' />
                                    </form>
                                </>
                            )}

                            <h2
                                css={css`
                                    margin: 2rem 0;
                                `}
                            >
                                Reviews
                            </h2>

                            {reviews.length === 0 ? (
                                'No reviews yet'
                            ) : (
                                <ul>
                                    {reviews.map((review, idx) => (
                                        <li
                                            key={`${review.userId}-${idx}`}
                                            css={css`
                                                border: 1px solid #e1e1e1;
                                                padding: 2rem;
                                            `}
                                        >
                                            <p>{review.message}</p>
                                            <p>
                                                Escrito por:
                                                <span
                                                    css={css`
                                                        font-weight: bold;
                                                    `}
                                                >
                                                    {' '}
                                                    {review.userName}
                                                </span>
                                            </p>
                                            {isAuthor(review.userId) && <ProductAuthor>Author</ProductAuthor>}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <aside>
                            <Button
                                target='_blank'
                                bgColor='true'
                                href={url}
                                css={css`
                                    margin-top: 10rem;
                                `}
                            >
                                Visit URL
                            </Button>

                            <div
                                css={css`
                                    margin-top: 5rem;
                                `}
                            >
                                <p
                                    css={css`
                                        text-align: center;
                                    `}
                                >
                                    {votes} Votos
                                </p>

                                {user && <Button onClick={addVote}>Vote</Button>}
                            </div>
                        </aside>
                    </Container>

                    {checkAuthor() && <Button onClick={deleteProduct}>Delete Product</Button>}
                </div>
            )}
        </Layout>
    )
}

export default Product
