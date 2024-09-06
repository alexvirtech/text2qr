import { useState, useContext, useEffect, useRef } from "preact/hooks"
import { styles } from "../utils/styles"
import Context from "../utils/context"
import { copyText } from "../utils/lib"
import Error from "../components/error"
import FileUploader from "../components/fileUploader"
import Scanner from "../components/scanner"

export default function QR2Text() {
    const { state, dispatch } = useContext(Context)
    const [created, setCreated] = useState(false)
    const [error, setError] = useState("")
    const [text, setText] = useState("")
    const [fromFile, setFromFile] = useState(true)
    const [password, setPassword] = useState("") // Manage password state
    const divRef = useRef(null)

    useEffect(() => {
        reset()
    }, [fromFile])

    const handleDecrypted = (decryptedText) => {
        setText(decryptedText) // Set the decrypted text in state
        setCreated(true)
    }

    const reset = () => {
        setText("")
        setPassword("") // Reset password state
        setCreated(false)
        setError("") // Clear error when resetting
    }

    const copy = (e) => {
        copyText(e, divRef, "Decrypted text")
    }

    // Effect for requesting camera permissions when switching to scanner mode
    useEffect(() => {
        if (!fromFile && !created) {
            navigator.mediaDevices
                .getUserMedia({ video: true })
                .then((stream) => {
                    console.log("Camera access granted")
                    // You can also handle the stream here if needed for setup
                })
                .catch((err) => {
                    console.error("Error accessing camera: ", err)
                    setError("Unable to access camera. Please check your permissions.")
                })
        }
    }, [fromFile, created])

    return (
        <>
            <div class="w-full max-w-[800px] mx-auto px-8">
                <form onReset={() => reset()}>
                    <div>
                        <div class="tablet:flex tablet:justify-between gap-2 pt-4 tablet:h-16 tablet:items-center">
                            <div class="text-3xl">QR to Text</div>
                            <div class="mt-4 mb-2 tablet:my-0">
                                <button
                                    type="button"
                                    onClick={() => setFromFile(true)}
                                    class={(fromFile ? styles.button : styles.buttonS) + " rounded-r-none"}
                                >
                                    From File
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFromFile(false)}
                                    class={(fromFile ? styles.buttonS : styles.button) + " rounded-l-none"}
                                >
                                    From Scan
                                </button>
                            </div>
                        </div>
                        <div class="pt-2">
                            <div class={styles.labelB}>Password</div>
                            <input
                                type="password"
                                class={styles.textInput + " rounded-none"}
                                placeholder="Enter password"
                                required
                                disabled={created}
                                value={password} // Bind password state to input
                                onInput={(e) => setPassword(e.target.value)} // Update password state on change
                            />
                        </div>
                        {fromFile && !created && <FileUploader password={password} onDecrypted={handleDecrypted} />}
                        {!fromFile && !created && <Scanner password={password} onDecrypted={handleDecrypted} />}
                        {/* Scanner component now handles camera permissions */}
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
                        <div class="mt-4 flex justify-center gap-2">
                            {created && (
                                <button type="reset" class={styles.button}>
                                    Reset
                                </button>
                            )}
                        </div>
                        <Error text={error} clear={() => setError("")} />
                    </div>
                </form>
            </div>
        </>
    )
}
