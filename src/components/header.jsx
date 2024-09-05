import { useContext, useState } from "preact/hooks"
import Context from "../utils/context"
import { EthereumIcon, ExitIcon, MainMenuIcon, QRIcon } from "../utils/icons"
import TopMenu from "./topMenu"
//import { HandleRemember } from "../utils/portfolio"
//import MainMenu from "./mainMenu"
//import Settings from "../modals/settings"
//import AddNewWallet from "../modals/addNewWallet"
//import AddExistingWallet from "../modals/addExistingWallet"

export default function Header() {
    const { state, dispatch } = useContext(Context)
    const [showMainMenu, setShowMain] = useState(false)

    const exit = () => {
        //HandleRemember(null, true)
        //dispatch({ type: "SET_PORTFOLIO", payload: null })
    }

    return (
        <div class="bg-slate-200  border-b border-slate-300  flex justify-between relative items-center h-16 px-4">
            <div class="flex justify-start gap-4 items-center">
                <div class="py-3 pl-3 pr-0 cursor-pointer" onClick={() => setShowMain(true)}>
                    {/* <MainMenuIcon /> */}
                    <QRIcon />
                </div>
                <div class="text-3xl">Text2QR Tools</div>
            </div>
            <div class="flex justify-end gap-2 items-center">
                <TopMenu />
                {/* <div class="cursor-pointer" onClick={exit}>
                    <ExitIcon />
                </div> */}
            </div>
            {/* {showMainMenu && <MainMenu close={() => setShowMain(false)} />}
            {state.modal === 'Settings' && <Settings />}
            {state.modal === 'AddNewWallet' && <AddNewWallet />}
            {state.modal === 'AddExistingWallet' && <AddExistingWallet />}    */}
        </div>
    )
}
