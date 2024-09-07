import { useEffect, useContext } from "preact/hooks"
import Context from "../utils/context"
import Header from "../components/header"
import Footer from "../components/footer"
import { setVh } from "../utils/lib"

export default function Layout({ children, currentPath }) {
    const { state, dispatch } = useContext(Context)

    useEffect(() => {
        // Initial height calculation
        setVh()
        // Recalculate on window resize
        window.addEventListener("resize", setVh)
        return () => {
            window.removeEventListener("resize", setVh)
        }
    }, [])

    // Detect if the current URL is the home page
    const isHomePage = currentPath === "/" // Use the passed currentPath prop

    return (
        <Context.Provider value={{ state, dispatch }}>
            <div class={`flex flex-col ${isHomePage ? "bg-slate-200" : ""}`} style="height: calc(var(--vh) * 100)">
                <Header />
                <div class="grow pb-4">{children}</div>
                <Footer />
            </div>
        </Context.Provider>
    )
}
