import Layout from "./layouts/main"
import { useState, useEffect, useReducer } from "preact/hooks"
import Context from "./utils/context"
import { initialState, reducer } from "./utils/reducer"
import Router, { route } from "preact-router"
import EncText from "./pages/encText"
import Text2QR from "./pages/text2qr"
import QR2Text from "./pages/qr2text"
import DecText from "./pages/decText"
import Home from "./pages/home"
import DecScan from "./pages/decScan"

export function App() {
    const [state, dispatch] = useReducer(reducer, initialState)
    //const location = useLocation()

    useEffect(() => {
        // Manually get the query params from the URL
        const searchParams = new URLSearchParams(window.location.search)
        const dsParam = searchParams.get("ds")

        if (dsParam) {
            // Dispatch the action with the 'ds' value
            dispatch({ type: "SET_ENC_TEXT", payload: dsParam })

            // Redirect to '/decscan' without reloading the page
            route("/decscan")
        }
    }, [dispatch])

    return (
        <Context.Provider value={{ state, dispatch }}>
            <Layout>
                <Router>
                    <Home path="/" />
                    <Text2QR path="/text2qr" />
                    <QR2Text path="/qr2text" />
                    <EncText path="/enctext" />
                    <DecScan path="/decscan" />
                    <DecText path="/dectext" />
                </Router>
            </Layout>
        </Context.Provider>
    )
}
