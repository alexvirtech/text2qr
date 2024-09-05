import { Link } from "preact-router"
import { useEffect, useState } from "preact/hooks"
import { styles } from "../utils/styles"
import { pages } from "../utils/common" 

const TopMenu = () => {    
    const [activePath, setActivePath] = useState(window.location.pathname)

    useEffect(() => {
        const handleRouteChange = () => {
            setActivePath(window.location.pathname)
        }

        // Listen to popstate events for back/forward navigation
        window.addEventListener("popstate", handleRouteChange)

        // Cleanup the event listener
        return () => {
            window.removeEventListener("popstate", handleRouteChange)
        }
    }, [])

    const handleLinkClick = (path) => {
        setActivePath(path) // Update activePath when a link is clicked
    }

    return (
        <div class="flex justify-end gap-4">
            {
                Object.keys(pages).map((path) => (
                    <div>
                        <Link href={path} class={`${styles.link} ${activePath === path ? "underline underline-offset-8 decoration-4" : ""}`} onClick={() => handleLinkClick(path)}>
                            {pages[path]}
                        </Link>
                    </div> 
                ))
            }          
        </div>
    )
}

export default TopMenu
