import { useState, useContext, useEffect, useRef } from "preact/hooks"
import { styles } from "../utils/styles"
import Context from "../utils/context"
import { copyText } from "../utils/lib"
import { encrypt, decrypt } from "../utils/crypto"
import ReactGA from "react-ga4"

export default function EncText() {
    const { state, dispatch } = useContext(Context)
    const [created, setCreated] = useState(false)
    const [error, setError] = useState("")
    const [ciphertext, setCiphertext] = useState("")
    const divRef = useRef(null)

    const plainText = useRef("")
    const password = useRef("")
    const repPassword = useRef("")

    useEffect(() => {
        ReactGA.initialize("G-0N9NNKXL5Y") 
        setCreated(false)
        plainText.current.focus()
    }, [])

    useEffect(() => {
        if (error !== "") {
            setTimeout(() => {
                setError("")
            }, 5000)
        }
    }, [error])

    const validatePassword = () => {
        if (password.current.value !== repPassword.current.value) {
            repPassword.current.setCustomValidity("Passwords do not match")
        } else {
            repPassword.current.setCustomValidity("") // Reset custom validity if they match
        }
    }

    const validateAndExecute = (e) => {
        e.preventDefault()

        if (repPassword.current.reportValidity()) {
            const ciphertext = encrypt(plainText.current.value, password.current.value)
            setCiphertext(ciphertext)
            setCreated(true)
            ReactGA.event('encrypt_text', {
                action: "encrypt",
                page_location: window.location.href
            })
        } else {
            setError("Passwords do not match")
            return
        }
    }

    const reset = () => {
        plainText.current.value = ""
        password.current.value = ""
        repPassword.current.value = ""
        setCiphertext("")
        setCreated(false)
        setTimeout(() => {
            plainText.current.focus()
        }, 200)
    }

    const copy = (e) => {
        copyText(e, divRef, "Encrypted text")
    }

    return (
        <div class="w-full max-w-[800px] mx-auto px-8">
            <form onSubmit={(e) => validateAndExecute(e)} onReset={() => reset()}>
                <div>
                    <div class="text-3xl pt-4">Text Encryption</div>
                    <div class="pt-2">
                        <div class={styles.labelB}>You sensitive text</div>
                        <textarea
                            ref={plainText}
                            class={styles.textInput + " rounded-none"}
                            placeholder="Enter your sensitive text for encryption"
                            required
                            rows="3"
                            disabled={created}
                        ></textarea>
                        <div class={styles.comments}>The recommended maximum length is 1000 Latin characters.</div>
                    </div>
                    <div class="pt-2">
                        <div class={styles.labelB}>Password</div>
                        <input
                            ref={password}
                            onInput={validatePassword}
                            type="password"
                            class={styles.textInput + " rounded-none"}
                            placeholder="Enter password"
                            required
                            disabled={created}
                        ></input>
                    </div>
                    <div class="pt-2">
                        <div class={styles.labelB}>Confirm Password</div>
                        <input
                            ref={repPassword}
                            onInput={validatePassword}
                            type="password"
                            class={styles.textInput + " rounded-none"}
                            placeholder="Enter password"
                            required
                            disabled={created}
                        ></input>
                    </div>
                    {created && (
                        <div class="pt-2">
                            <div class={styles.labelB}>Encrypted text</div>
                            <textarea
                                name="text"
                                ref={divRef}
                                readOnly
                                class={styles.textInput + " rounded-none"}
                                placeholder=""
                                rows="3"
                                value={ciphertext}
                                onClick={copy}
                                title={ciphertext === "" ? "" : "Click to copy to clipboard"}
                            ></textarea>
                            <div class={styles.comments + " text-right"}>Click text for copy to clipboard</div>
                        </div>
                    )}

                    <div class="mt-4 flex justify-center gap-2">
                        {created ? (
                            <button type="reset" class={styles.button}>
                                Reset
                            </button>
                        ) : (
                            <button type="submit" class={styles.button}>
                                Encrypt
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </div>
    )
}
