import { useState,useContext } from "preact/hooks"
import Context from "../utils/context"

export default function Footer() {
    const { state, dispatch } = useContext(Context)
    
    return (
        <div class="h-[50px] p-3 bg-slate-200 border-t border-slate-300 text-sm flex items-center justify-center gap-1">            
            <div>All rights reserved to</div>            
            <div class="font-bold">&copy;AK</div>
            {/* <div>GitHub:</div>
            <a href="https://github.com/alexvirtech/text2qr/tree/main" target="_blank">https://github.com/alexvirtech/text2qr/tree/main</a> */}
        </div>
    )
}