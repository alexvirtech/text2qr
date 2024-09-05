import { useEffect, useContext } from "preact/hooks"
import Context from "../utils/context"
import Header from "../components/header"
import Footer from "../components/footer"
import { setVh } from "../utils/lib"

export default function Layout({ children }) {
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

  return (
    <Context.Provider value={{ state, dispatch }}>
      <div class="flex flex-col" style="height: calc(var(--vh) * 100)">
        <Header />
        <div class="grow">{children}</div>
        <Footer />
      </div>
    </Context.Provider>
  )
}
