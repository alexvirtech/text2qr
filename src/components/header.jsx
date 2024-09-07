import { useContext, useState } from "preact/hooks"
import Context from "../utils/context"
import { EthereumIcon, ExitIcon, MainMenuIcon, QRIcon } from "../utils/icons"
import TopMenu from "./topMenu"
import MainMenu from "./mainMenu"
import { Link } from "preact-router"

export default function Header() {
    const { state, dispatch } = useContext(Context)
    const [showMainMenu, setShowMain] = useState(false)    

    return (
        <div class="bg-slate-200  border-b border-slate-300  flex justify-between relative items-center h-16 px-4 py-4">
            <div class="flex justify-start gap-4 items-center">
                <div class="tablet:hidden cursor-pointer" onClick={() => setShowMain(true)}>
                    <MainMenuIcon />
                </div>
                <Link href={"/"} class=" font-bold text-2xl cursor-pointer">Text2QR Tools</Link>
            </div>
            <div class="justify-end gap-2 items-center hidden tablet:flex">
                <TopMenu />
            </div>            
            {showMainMenu && <MainMenu close={() => setShowMain(false)} />}            
        </div>
    )
}
