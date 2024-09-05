//import { mStyles } from "../../../../utils/styles"
//import { useState, useContext, useEffect, useRef } from "preact/hooks"
//import Context from "../../../../utils/context"
//import { setErrorD, copyText } from '../../../../utils/utils'
//import { decryptText } from "../../../../utils/encdec"
//import { decrypt } from "../../../../utils/crypto"

import { useState, useContext, useEffect, useRef } from "preact/hooks"
import { styles } from "../utils/styles"
import Context from "../utils/context"
import { copyText } from "../utils/lib"
import { encrypt, decrypt } from "../utils/crypto"

export default function DecText() {
    const { state, dispatch } = useContext(Context)
    const [created, setCreated] = useState(false)
    const [error, setError] = useState("")
    const [text, setText] = useState("")
    const [ciphertext, setCiphertext] = useState("")
    const divRef = useRef(null)

    const encText = useRef("")
    const password = useRef("")

    useEffect(() => {
        //
    }, [])

    useEffect(() => {
        if (error !== "") {
            setTimeout(() => {
                setError("")
            }, 5000)
        }
    }, [error])

    const validateAndExecute = (e) => {
        e.preventDefault()
        try {
            const txt = decrypt(encText.current.value, password.current.value)
            setText(txt)
            setCreated(true)
        } catch (e) {
            console.error(e)
            setErrorD(dispatch, "error - see more in dev console")
        }
    }

    const reset = () => {
        setText("")
        setCreated(false)
    }

    const copy = (e) => {
        copyText(e, divRef, "Decrypted text")
    }

    return (
        <>
            <div class="w-full max-w-[1000px] mx-auto px-8">
                <form onSubmit={(e) => validateAndExecute(e)} onReset={() => reset()}>
                    <div>
                        <div class="text-3xl pt-4">Text Decryption</div>
                        <div class="pt-2">
                            <div class={styles.labelB}>Encrypted text</div>
                            <textarea
                                ref={encText}
                                class={styles.textInput + " rounded-none"}
                                rows="3"
                                value={ciphertext}
                                placeholder="Enter your encrypted text for decryption"
                                required
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

                        <div class="mt-4 xs:flex justify-center gap-2">
                            <div class="gap-2 sm:flex w-full pb-2">
                                <button type="submit" class={styles.button}>
                                    Decrypt
                                </button>
                                {created && (
                                    <button type="reset" class={styles.button}>
                                        Reset
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}
