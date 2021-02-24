import React, { useEffect, useState } from 'react'
import Layout from '../components/layout/Layout'
import { useRouter } from 'next/router'
import ProductCard from '../components/shared/product-card'
import useProducts from '../components/resources/hooks/useProducts'

const Search = () => {
    const router = useRouter()
    const { query: { q }} = router

    // Get filtered products
    const { products } = useProducts('created')
    const [result, setResult] = useState([])

    useEffect(() => {

        const search = q.toLowerCase()
        const filtered = products.filter((product) => {
            return (
                product.name.toLowerCase().includes(search) ||
                product.description.toLowerCase().includes(search)
            )
        })

        setResult(filtered)

    }, [q, products])

    return (
        <div>
            <Layout>
                <div className='products-list'>
                    <div className='container'>
                        <ul className='bg-white'>
                            {result.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </ul>
                    </div>
                </div>
            </Layout>
        </div>
    )
}

export default Search
