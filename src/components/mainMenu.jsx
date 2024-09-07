import LayoutMenu from "../layouts/layoutMenu"
import { useState, useEffect, useContext } from "preact/hooks"
import Context from "../utils/context"
import { pages } from "../utils/common"
import { SelectedIcon } from "../utils/icons"
import { Link } from "preact-router"
import { styles } from "../utils/styles"

const MainMenu = ({ close }) => {
    const { state, dispatch } = useContext(Context)
    const [menu, setMenu] = useState(pages)

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
        close()
    }

    return (
        <LayoutMenu close={() => close()}>
            <div class="no-scrollbar max-h-[100vh] left-0 top-0 z-10 bottom-0 absolute bg-gray-800">
                <div class="flex flex-col w-[300px] h-full">
                    <div class="flex items-center justify-between h-16 border-b border-gray-700 px-4 mb-2">
                        <Link href={"/"} onClick={() => handleLinkClick("/")} 
                        class="text-blue-200 font-bold text-2xl cursor-pointer">Text2QR Tools</Link>
                        <div class="text-blue-300 font-semibold cursor-pointer text-3xl" onClick={close}>
                            &times;
                        </div>
                    </div>
                    {Object.keys(pages).map((path,index) => (
                        <div key={index} class="px-8 py-2">
                            <Link
                                href={path}
                                class={activePath === path ? styles.linkMA : styles.linkM}
                                onClick={() => handleLinkClick(path)}
                            >
                                {pages[path]}
                            </Link>
                        </div>
                    ))}                    
                </div>
            </div>
        </LayoutMenu>
    )
}

export default MainMenu
