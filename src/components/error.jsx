import { useEffect, useState } from "preact/hooks"

export default function Error({text, clear}) {    
    useEffect(() => {
        if (text !== "") {
            setTimeout(() => {
                clear()
            }, 5000)
        }
    }, [text])
    return (
        <div class="mt-4 flex justify-center gap-2 text-red-600">{text}</div>
    )
}