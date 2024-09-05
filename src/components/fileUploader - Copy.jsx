import { useRef } from "preact/hooks"
import { styles } from "../utils/styles"
import { decrypt } from "../utils/crypto"
import qrcode from "qrcode"

export default function FileUploader({ password }) {
    const fileInput = useRef(null)

    const handleDecrypt = async (event) => {
        event.preventDefault()
        const file = selectFile(event)
        if (file) {
            const reader = new FileReader()
            reader.onload = async (e) => {
                try {
                    const encryptedObj = JSON.parse(e.target.result)
                    const decryptedContentBase64 = decryptA(encryptedObj.content)
                    const uint8ArrayDecrypted = Uint8Array.from(atob(decryptedContentBase64), (c) => c.charCodeAt(0))
                    const blob = new Blob([uint8ArrayDecrypted], { type: encryptedObj.fileType })
                    const href = URL.createObjectURL(blob)
                    downloadFile(file, false, href)
                } catch (e) {
                    console.error(e)
                    setErrorD(dispatch, "error - see more in dev console")
                }
            }
            reader.readAsText(file)
        }
    }

    const selectFile = (event) => {
        let file = event.target.files ? event.target.files[0] : null
        if (!file) file = (event.dataTransfer && event.dataTransfer.files) ? event.dataTransfer.files[0] : null
        return file
    }


    const decryptA = (ciphertext) => {
        const txt = decrypt(ciphertext, password) //Text(ciphertext, publicKey, privateKey)
        return txt
    }

    const downloadFile = (file, isEnc, href) => {
        const downloadName = getFileName(file, isEnc)
        const downloadLink = document.createElement("a")
        downloadLink.href = href
        downloadLink.download = downloadName
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
    }

    const getFileName = (file, isEnc) => {
        const unixTime = Math.floor(Date.now() / 1000)
        if (isEnc) {
            const baseName = file.name.substring(0, file.name.lastIndexOf("."))
            const fileExtension = file.name.substring(file.name.lastIndexOf("."))
            return `${baseName}_${unixTime}${fileExtension}.mtw_enc`
        } else {
            const nameParts = file.name.match(/(.*?)(?:_\d+)?(\..*?)\.mtw_enc$/)
            if (!nameParts) {
                console.error("File name format is incorrect.")
                return
            }
            const originalBaseName = nameParts[1]
            const originalExtension = nameParts[2]
            return `${originalBaseName}_${unixTime}${originalExtension}`
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
                    <span class={styles.comments + " border-t border-m-gray-light-1 mt-4 text-xs"}>
                        The encrypted file will be downloaded automatically.
                    </span>
                </div>
            </div>
        </div>
    )
}
