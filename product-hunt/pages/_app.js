import App from 'next/app'
import useAuth from '../components/resources/hooks/useAuth'
import firebase, { FirebaseContext } from '../firebase'

const MyApp = (props) => {
    const user = useAuth()

    const { Component, pageProps } = props
    
    return (
        <FirebaseContext.Provider
            value={{
                firebase,
                user                
            }}
        >
            <Component {...pageProps} />
        </FirebaseContext.Provider>
    )
}

export default MyApp
