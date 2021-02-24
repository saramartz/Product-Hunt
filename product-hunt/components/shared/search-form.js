import React, {useState} from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import Router from 'next/router'

const InputText = styled.input`
    border: 1px solid var(--grey3);
    padding: 1rem;
    min-width: 300px;
`
const InputSubmit = styled.button`
    height: 3rem;
    width: 3rem;
    display: block;
    background-size: 4rem;
    background-image: url('/static/img/buscar.png');
    background-repeat: no-repeat;
    position: absolute;
    right: 1rem;
    top: 1px;
    background-color: white;
    border: none;
    /* text-indent: -9999px; */

    &:hover {
        cursor: pointer;
    }
`

const SearchForm = () => {

    const [search, setSearch] = useState('')

    const searchProduct = (e) => {
        e.preventDefault()

        if (search.trim() === '') return

        // Redirect to /search
        Router.push({
            pathname: '/search',
            query: { q: search },
        })
    }

    return (
        <form
            css={css`
                position: relative;
            `}
            onSubmit={searchProduct}
        >
            <InputText
                type='text'
                placeholder='Search products'
                // value={search} not necessary
                onChange={(e) => setSearch(e.target.value)}
            />
            <InputSubmit type='submit'></InputSubmit>
        </form>
    )
}

export default SearchForm
