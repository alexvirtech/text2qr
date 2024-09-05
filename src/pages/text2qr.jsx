import { useState, useContext, useEffect, useRef } from "preact/hooks"
import { styles } from "../utils/styles"
import Context from "../utils/context"
import qrcode from "qrcode"
import { copyText } from "../utils/lib"
import { encrypt, decrypt } from "../utils/crypto"
import { showPopup } from "../utils/lib"

export default function Text2QR() {
    const { state, dispatch } = useContext(Context)
    const [created, setCreated] = useState(false)
    const [error, setError] = useState("")
    const [ciphertext, setCiphertext] = useState("")
    const divRef = useRef(null)

    const plainText = useRef("")
    const password = useRef("")
    const repPassword = useRef("")
    const qrCodeRef = useRef(null)

    useEffect(() => {
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

    useEffect(() => {
        if (ciphertext) {
            const canvas = qrCodeRef.current
            qrcode.toCanvas(canvas, ciphertext, { width: canvas.offsetWidth, height: canvas.offsetWidth, margin: 0 })
        }
    }, [ciphertext])

    const copyQRCodeToClipboard = () => {
        const canvas = qrCodeRef.current
        canvas.toBlob((blob) => {
            const item = new ClipboardItem({ "image/png": blob })
            navigator.clipboard.write([item])
            showPopup("QR code copied to clipboard", canvas.getBoundingClientRect().top - 20)
        })
    }

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

    const resetQRcode = () => {
        setText("")
        setPassword("")
        setCiphertext("")
        const canvas = qrCodeRef.current
        const context = canvas.getContext("2d")
        context.clearRect(0, 0, canvas.width, canvas.height)
    }

    const shareCanvas = async () => {
        const canvas = qrCodeRef.current
        const dataUrl = canvas.toDataURL()
        const blob = await (await fetch(dataUrl)).blob()
        const filesArray = [
            new File([blob], "qrcode.png", {
                type: blob.type,
                lastModified: new Date().getTime(),
            }),
        ]
        const shareData = {
            files: filesArray,
        }

        if (navigator.canShare && navigator.canShare(shareData)) {
            try {
                setCanShare(true)
                navigator.share(shareData)
            } catch (error) {
                setCanShare(false)
            }
        }
    }

    const printCanvas = () => {
        const canvas = qrCodeRef.current
        if (canvas) {
            const dataUrl = canvas.toDataURL() // Get the canvas content as a data URL
            const newWindow = window.open("", "_blank") // Open a new blank window

            // Write the canvas content into the new window
            newWindow.document.write(`
                <html>
                    <head>
                        <title>Print QR Code</title>
                    </head>
                    <body style="margin: 0; padding: 0; display: flex; justify-content: center; align-items: center;">
                        <img src="${dataUrl}" style="width: 100%; max-width: 260px;" />
                    </body>
                </html>
            `)

            // Wait for the image to load before printing
            newWindow.document.close()
            newWindow.onload = () => {
                newWindow.focus()
                newWindow.print()
                newWindow.close()
            }
        }
    }

    return (
        <div class="w-full max-w-[800px] mx-auto px-8">
            <form onSubmit={(e) => validateAndExecute(e)} onReset={() => reset()}>
                <div>
                    <div class="text-3xl pt-4">Text to QR Code</div>
                    <div class="pt-2">
                        <div class={styles.labelB}>You sensitive text</div>
                        <textarea
                            ref={plainText}
                            class={styles.textInput + " rounded-none"}
                            placeholder="Enter your sensitive text for encryption"
                            required
                            rows="3"
                            disabled={created}
                            maxLength="1000"
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
                            <div class="flex justify-center gap-0">
                                <div class="border border-blue-200 p-4 mx-8 mt-1 mb-0 cursor-pointer bg-white rounded-md">
                                    <canvas
                                        ref={qrCodeRef}
                                        style={{
                                            width: "100%",
                                            maxWidth: "400px",
                                            height: "auto",
                                            padding: "0px",
                                            margin: "0px",
                                        }}
                                        onClick={copyQRCodeToClipboard}
                                        title="click to copy"
                                    />
                                </div>
                            </div>
                            <div class={styles.comments + " text-center"}>Click QR code for copy to clipboard</div>
                        </div>
                    )}

                    <div class="mt-4 flex justify-center gap-2">
                        {created ? (
                             <>
                                 <button type="button" onClick={printCanvas} class={styles.button}>
                                    Print QR Code 
                                </button>
                                <button type="reset" class={styles.button}>
                                    Reset
                                </button>
                             </>
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
