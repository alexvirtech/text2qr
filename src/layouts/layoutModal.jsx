import { createPortal } from "preact/compat"
import { CancelIcon } from "../utils/icons"
import { useContext } from "preact/compat"
import Context from "../utils/context"

export default function LayoutModal({
    children,
    title,    
    close = ()=>{},
    width = "w-[99%] max-w-[700px]",
    mt = "mt-[1%]",
}) {
    const { state, dispatch } = useContext(Context)

    return createPortal(
        <div
            class="fixed z-[1000] inset-0 overflow-y-auto flex items-start justify-center"
            onClick={(e)=>e.stopPropagation()}
        >
            <div
                class="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity"
                aria-hidden="true"
                onClick={(e) => {
                    e.stopPropagation()
                    close()
                }}
            ></div>
            <div
                class={
                    "z-[1002] rounded-md text-left overflow-hidden shadow-xl transform transition-all " +
                    width +
                    " " +
                    mt
                }
            >
                <div class="bg-slate-600 pl-8 pr-6 py-3 flex justify-between rounded-t-md">
                    <div class="text-xl text-white">{title}</div>
                    <div>
                        <button
                            title="close"
                            class="items-center h-full text-white border-slate-300 border-0 rounded text-xl"
                            onClick={(e) => {
                                e.stopPropagation()
                                close()
                            }}
                        >
                            <CancelIcon />
                        </button>
                    </div>
                </div>
                <div class="bg-white py-4 px-8">{children}</div>
            </div>
        </div>,
        document.body,
    )
}
