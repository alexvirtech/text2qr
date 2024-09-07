import { useState, useContext, useRef, useEffect } from "preact/hooks"
import { styles } from "../utils/styles"
import Context from "../utils/context"
import { copyText } from "../utils/lib"
import Error from "../components/error"
import FileUploader from "../components/fileUploader"

export default function QR2Text() {
    const { state, dispatch } = useContext(Context)
    const [created, setCreated] = useState(false)
    const [error, setError] = useState("")
    const [text, setText] = useState("")
    const [password, setPassword] = useState("")
    const [fileName, setFileName] = useState("") // Track uploaded file name
    const divRef = useRef(null)
    const passwordRef = useRef(null)

    const handleDecrypted = (decryptedText) => {
        setText(decryptedText) // Set the decrypted text in state
        setCreated(true)
    }

    const handleFileUploaded = (uploadedFileName) => {
        setFileName(uploadedFileName) // Store the uploaded file name
        setError("") // Clear any previous errors
        console.log('111')
        
    }

    useEffect(() => {
        if(!created && fileName) {
            passwordRef.current.focus() // Focus on the password input
        }

    }, [fileName,created])

    const reset = () => {
        setText("")
        setPassword("")
        setCreated(false)
        setError("")
        setFileName("") // Reset file name
    }

    const copy = (e) => {
        copyText(e, divRef, "Decrypted text")
    }

    const decrypt = (e) => {
        e.preventDefault()
        dispatch({ type: "START_DECRYPT", payload: true })
        return false
    }

    return (
        <>
            <div class="w-full max-w-[800px] mx-auto px-8">
                <form onReset={reset} onSubmit={decrypt}>
                    <div>
                        <div class="pt-4">
                            <div class="text-3xl">QR to Text</div>
                            <div>Use a file containig the QR code</div>
                        </div>

                        {/* Show File Name, Password Input, and Reset Button After File Upload */}
                        {fileName && !created && (
                            <div class="pt-4">
                                <div class="pb-2">Uploaded File: {fileName}</div>
                                <div class="pb-4">
                                    <div class={styles.labelB}>Password</div>
                                    <input
                                        ref={passwordRef}
                                        type="password"
                                        class={styles.textInput + " rounded-none"}
                                        placeholder="Enter password"
                                        required
                                        value={password}
                                        onInput={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        {/* File Upload Area */}
                        {!created && (
                            <FileUploader
                                password={password}
                                onFileUploaded={handleFileUploaded}
                                onDecrypted={handleDecrypted}
                                onReset={reset}
                            />
                        )}

                        {/* Show Decrypted Text After Successful Decryption */}
                        {created && (
                            <>
                                <div class="pt-2">
                                    <div class={styles.labelB}>Plain text</div>
                                    <textarea
                                        readOnly
                                        ref={divRef}
                                        name="text"
                                        class={styles.textInput + " rounded-none"}
                                        onClick={copy}
                                        title={text === "" ? "" : "Click to copy to clipboard"}
                                        value={text}
                                        rows="3"
                                    ></textarea>
                                    <div class={styles.comments + " text-right"}>Click text for copy to clipboard</div>
                                </div>
                                <div class="flex justify-center mt-4 gap-2">                                    
                                    <button
                                        type="button"
                                        class="bg-blue-500 text-white px-4 py-2 rounded"
                                        onClick={reset}
                                    >
                                        Reset
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Error Message */}
                        <Error text={error} clear={() => setError("")} />
                    </div>
                </form>
            </div>
        </>
    )
}
