import CryptoJS from "crypto-js"
import { useState, useEffect } from "preact/hooks"

export default function Home() {
    const [ciphertext, setCiphertext] = useState("")
    const [decryptedText, setDecryptedText] = useState("")
    const [error, setError] = useState("")
    
    /* useEffect(() => {
        // Encrypt
        const ciphertext = CryptoJS.AES.encrypt
    }, []) */

    return (
        <div class="w-full max-w-[800px] mx-auto px-8">
            <div>
                <div class="text-3xl pt-4">Home Page - temp</div>
            </div>
        </div>
    )
}
