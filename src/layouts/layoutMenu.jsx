import { createPortal } from 'preact/compat'

export default function LayoutMenu({ children, close = ()=>{} }) { 
    return createPortal( 
        <><div class="fixed inset-0 bg-gray-500 bg-opacity-50 transition-opacity" aria-hidden="true" onClick={close}></div>{children}</>,
        document.body
    )
}


