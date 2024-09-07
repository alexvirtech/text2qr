import { useEffect, useRef, useState, useContext } from "preact/hooks"
import Context from "../utils/context"
import { decrypt } from "../utils/crypto"
import jsQR from "jsqr" // Import jsQR for decoding the QR code
import Error from "./error"
import { getHost } from "../utils/common"

export default function FileUploader({ password, onDecrypted, onFileUploaded, onReset }) {
    const { state, dispatch } = useContext(Context)
    const fileInput = useRef(null)
    const [error, setError] = useState("")
    const [fileData, setFileData] = useState(null) // Store file data for decryption
    const [isReadyToDecrypt, setIsReadyToDecrypt] = useState(false) // Track if file is ready for decryption

    useEffect(() => {
        if (state.startDec) {
            handleDecrypt().then(() => {
                dispatch({ type: "START_DECRYPT", payload: false })
            })
        }
    }, [state.startDec])

    const handleFileChange = (event) => {
        const file = selectFile(event)
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                const imageSrc = e.target.result
                setFileData(imageSrc) // Save the image source for decryption
                setIsReadyToDecrypt(true) // Ready to decrypt once file is uploaded
                onFileUploaded(file.name) // Notify parent with file name
            }
            reader.readAsDataURL(file) // Read file as DataURL for image loading
        }
    }

    const handleDecrypt = async () => {
        if (!fileData || !password) {
            setError("Please upload a file and enter a password.")
            return
        }

        try {
            const image = new Image()
            image.src = fileData

            image.onload = () => {
                const canvas = document.createElement("canvas")
                const context = canvas.getContext("2d")
                canvas.width = image.width
                canvas.height = image.height
                context.drawImage(image, 0, 0)

                const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
                const qrCode = jsQR(imageData.data, canvas.width, canvas.height)

                if (qrCode) {
                    const data = qrCode.data.replace(`${getHost()}/?ds=`, "") // Clean the data URL if needed
                    const decryptedText = decrypt(data, password) // Use the decrypt function from utils/crypto

                    if (decryptedText) {
                        onDecrypted(decryptedText) // Pass decrypted text to the parent component
                    } else {
                        setError("Decryption failed. Please check the password.")
                    }
                } else {
                    setError("No QR code found in the image.")
                }
            }

            image.onerror = () => {
                setError("Failed to load the image. Please try a different file.")
            }
        } catch (e) {
            console.error("Error while decrypting the file:", e)
            setError("An error occurred while decrypting the file.")
        }
    }

    const selectFile = (event) => {
        let file = event.target.files ? event.target.files[0] : null
        if (!file) file = event.dataTransfer && event.dataTransfer.files ? event.dataTransfer.files[0] : null
        return file
    }

    const preventDefault = (e) => {
        e.preventDefault()
    }

    const execute = () => {
        fileInput.current.click()
    }

    const reset = () => {
        setFileData(null) // Reset file data
        setIsReadyToDecrypt(false) // Reset decryption status
        setError("") // Clear error messages
        if (fileInput.current) {
            fileInput.current.value = "" // Clear the file input field
        }
        onReset() // Notify parent component to reset
    }

    return (
        <>
            {!isReadyToDecrypt && (
                <div
                    onDrop={handleFileChange}
                    onDragOver={preventDefault}
                    class="border-dashed border h-[200px] border-gray-400 rounded-lg p-4 text-center mt-6 flex flex-col justify-center items-center"
                >
                    <div class="cursor-pointer" onClick={execute}>
                        <label class="dark:text-m-gray-light-2">
                            Drag and drop an encrypted file here or click to select it from file explorer.
                        </label>
                        <input type="file" ref={fileInput} onChange={handleFileChange} style={{ display: "none" }} />
                    </div>
                </div>
            )}

            {/* Decrypt Button will only appear if file is ready and password is provided */}
            {isReadyToDecrypt && (
                <div class="flex justify-center mt-4 gap-2">
                    <button type="button" class="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleDecrypt}>
                        Decrypt
                    </button>
                    <button type="button" class="bg-blue-500 text-white px-4 py-2 rounded" onClick={reset}>
                        Reset
                    </button>
                </div>
            )}

            <Error text={error} clear={() => setError("")} />
        </>
    )
}
