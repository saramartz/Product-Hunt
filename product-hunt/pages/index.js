import React from 'react'
import Layout from '../components/layout/Layout'
import useProducts from '../components/resources/hooks/useProducts'
import ProductCard from '../components/shared/product-card'

const Home = () => {
    const { products } = useProducts('created')

    return (
        <>
            <Layout>
                <div className='products-list'>
                    <div className='container'>
                        <ul className='bg-white'>
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </ul>
                    </div>
                </div>
            </Layout>
        </>
    )
}
export default Home
