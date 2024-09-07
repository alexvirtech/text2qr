import { useState, useContext, useRef } from "preact/hooks"
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

    const handleDecrypted = (decryptedText) => {
        setText(decryptedText) // Set the decrypted text in state
        setCreated(true)
    }

    const handleFileUploaded = (uploadedFileName) => {
        setFileName(uploadedFileName) // Store the uploaded file name
        setError("") // Clear any previous errors
    }

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

    return (
        <>
            <div class="w-full max-w-[800px] mx-auto px-8">
                <form onReset={reset}>
                    <div>
                        <div class="tablet:flex tablet:justify-between gap-2 pt-4 tablet:h-16 tablet:items-center">
                            <div class="text-3xl">QR to Text - From File</div>
                        </div>

                        {/* Show File Name, Password Input, and Reset Button After File Upload */}
                        {fileName && !created && (
                            <div class="pt-4">
                                <div class="pb-2">Uploaded File: {fileName}</div>
                                <div class="pb-4">
                                    <div class={styles.labelB}>Password</div>
                                    <input
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
                            />
                        )}

                        {/* Show Decrypted Text After Successful Decryption */}
                        {created && (
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
                        )}

                        {/* Error Message */}
                        <Error text={error} clear={() => setError("")} />
                    </div>
                </form>
            </div>
        </>
    )
}
