import { useRef } from "preact/hooks"
import { decrypt } from "../utils/crypto"
import jsQR from "jsqr" // Import jsQR for decoding the QR code

export default function FileUploader({ password, onDecrypted }) {
    const fileInput = useRef(null)

    const handleDecrypt = async (event) => {
        event.preventDefault()
        const file = selectFile(event)
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                try {
                    const imageSrc = e.target.result
                    const image = new Image()
                    image.src = imageSrc

                    image.onload = () => {
                        const canvas = document.createElement("canvas")
                        const context = canvas.getContext("2d")
                        canvas.width = image.width
                        canvas.height = image.height
                        context.drawImage(image, 0, 0)

                        // Extract image data from the canvas
                        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

                        // Decode the QR code using jsQR
                        const qrCode = jsQR(imageData.data, canvas.width, canvas.height)

                        if (qrCode) {
                            const data = qrCode.data.replace('https://text2qr.com/?ds=', '') // Extract the encrypted data from the QR code 
                            // Proceed if QR code is found
                            const decryptedText = decryptFileText(data)
                            if (decryptedText) {
                                onDecrypted(decryptedText) // Pass the decrypted text back to the parent component
                            } else {
                                alert("Decryption failed. Please check the password.")
                            }
                        } else {
                            console.error("No QR code found in the image.")
                            alert("No QR code found in the image.")
                        }
                    }

                    image.onerror = () => {
                        console.error("Failed to load the image.")
                        alert("Failed to load the image. Please try a different file.")
                    }
                } catch (e) {
                    console.error("Error while processing the file:", e)
                    alert("Error occurred while processing the file.")
                }
            }
            reader.readAsDataURL(file) // Read file as DataURL for image loading
        }
    }

    const selectFile = (event) => {
        let file = event.target.files ? event.target.files[0] : null
        if (!file) file = event.dataTransfer && event.dataTransfer.files ? event.dataTransfer.files[0] : null
        return file
    }

    const decryptFileText = (ciphertext) => {
        try {
            return decrypt(ciphertext, password) // Decrypt the QR code data using the provided password
        } catch (error) {
            console.error("Decryption failed:", error)
            return null
        }
    }

    const preventDefault = (e) => {
        e.preventDefault()
    }

    const execute = async () => {
        fileInput.current.click()
    }

    return (
        <div
            onDrop={handleDecrypt}
            onDragOver={preventDefault}
            class="border-dashed border h-[200px] border-gray-400 rounded-lg p-4 text-center mt-6 flex flex-col justify-center items-center"
        >
            <div class="hidden">
                <input type="file" ref={fileInput} onChange={handleDecrypt} style={{ display: "none" }} />
                <button onClick={() => fileInput.current.click()}>Decrypt and Download</button>
            </div>

            <div class="cursor-pointer" onClick={execute}>
                <label class="dark:text-m-gray-light-2">
                    Drag and drop an encrypted file here or click to select it from file explorer.
                </label>
                <div>
                    <span class="border-t border-m-gray-light-1 mt-4 text-xs">
                        The encrypted file will be decrypted automatically.
                    </span>
                </div>
            </div>
        </div>
    )
}
