import { useState, useContext, useEffect, useRef } from "preact/hooks"
import { styles } from "../utils/styles"
import Context from "../utils/context"
import { copyText } from "../utils/lib"
import { encrypt, decrypt } from "../utils/crypto"
import Error from "../components/error"
import { route } from "preact-router"
import ReactGA from "react-ga4"
import { ethers } from "ethers"

export default function DecScan() {
    const { state, dispatch } = useContext(Context)
    const [created, setCreated] = useState(false)
    const [error, setError] = useState("")
    const [text, setText] = useState("")
    const divRef = useRef(null)
    const password = useRef("")
    const [shwoReset, setShowReset] = useState(false)

    useEffect(() => {
        ReactGA.initialize("G-0N9NNKXL5Y") 
        if (password.current) password.current.focus()
    }, [])

    const validateAndExecute = (e) => {
        e.preventDefault()
        try {
            const txt = decrypt(state.encText, password.current.value)
            if (txt) {
                setText(txt)
                setCreated(true)                
                ReactGA.event('restore_text_from_scan', {
                    action: "decrypt",
                    page_location: window.location.href
                })
                setTimeout(() => {
                    setShowReset(true)
                }, 5000)
            } else {
                //setError("Error decrypting text")
                const wallet = ethers.Wallet.createRandom()
                const mnemonic = wallet.mnemonic?.phrase
                setText(mnemonic)
                setCreated(true)                
                // to add error to GA
                ReactGA.event('restore_text_from_scan', {
                    action: "decrypt",
                    page_location: window.location.href
                })
                setTimeout(() => {
                    setShowReset(true)
                }, 5000)
            }
        } catch (e) {
            console.error(e)
            setError("Error - see more in dev console")
        }
    }

    const reset = () => {
        dispatch({ type: "SET_ENC_TEXT", payload: null })
        setText("")
        password.current.value = ""
        setCreated(false)  
        route("/")      
    }

    const copy = (e) => {
        copyText(e, divRef, "Decrypted text")
    }

    return (
        <>
            <div class="w-full max-w-[800px] mx-auto px-8">
                {state.encText || true ? (
                    <form onSubmit={(e) => validateAndExecute(e)}>
                        <div>
                            <div class="text-3xl pt-4">QR to Text - From Scan</div>

                            <div class="pt-2">
                                <div class={styles.labelB}>Encrypted text from QR</div>
                                <textarea
                                    disabled
                                    class={styles.textInput + " rounded-none"}
                                    rows="3"
                                    value={'*****************************************'}
                                ></textarea>
                            </div>
                            <div class="pt-2">
                                <div class={styles.labelB}>Password</div>
                                <input
                                    ref={password}
                                    type="password"
                                    class={styles.textInput + " rounded-none"}
                                    placeholder="Enter password"
                                    required
                                    disabled={created}
                                ></input>
                            </div>

                            {created && (
                                <div class="pt-2">
                                    <div class={styles.labelB}>Plain text</div>
                                    <textarea
                                        readOnly
                                        ref={divRef}
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
                                {created && shwoReset && (
                                    <button type="button" class={styles.button} onClick={() => reset()}>
                                        Reset
                                    </button>
                                )}
                                {!created && (
                                    <button type="submit" class={styles.button}>
                                        Decrypt
                                    </button>
                                )}
                            </div>
                            <Error text={error} clear={() => setError("")} />
                        </div>
                    </form>
                ) : (
                    <div class="pt-4">No data for decryption</div>
                )}
            </div>
        </>
    )
}
