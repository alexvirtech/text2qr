import Layout from "./layouts/main"
import { useState, useEffect, useReducer } from "preact/hooks"
import Context from "./utils/context"
import { initialState, reducer } from "./utils/reducer"
import Router, { route } from 'preact-router'
import EncText from "./pages/encText"
import Text2QR from "./pages/text2qr"
import QR2Text from "./pages/qr2text"
import DecText from "./pages/decText"
import About from "./pages/about"

export function App() {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [loaded, setLoaded] = useState(false)

    return (
        <Context.Provider value={{ state, dispatch }}>
            <Layout>
            <Router>
                <Text2QR path="/" />         
                <QR2Text path="/qr2text" />
                <EncText path="/enctext" />      
                <DecText path="/dectext" />
                <About path="/about" />
            </Router>    
            </Layout>
        </Context.Provider>
    )
}
