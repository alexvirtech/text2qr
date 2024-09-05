import { useEffect, useRef, useState } from "preact/hooks"
import QrScanner from "qr-scanner"
import { decrypt } from "../utils/crypto"
import { styles } from "../utils/styles"

export default function Scanner({ password, onDecrypted }) {
    const videoRef = useRef(null) // Reference for the video element
    const passwordRef = useRef(password) // Ref to hold the latest password value
    const [error, setError] = useState("")
    const [cameras, setCameras] = useState([])
    const [selectedCamera, setSelectedCamera] = useState("") // Store the selected camera
    const [qrScanner, setQrScanner] = useState(null)

    // Update the password ref whenever the password changes
    useEffect(() => {
        passwordRef.current = password
    }, [password])

    useEffect(() => {
        // Fetch available cameras
        navigator.mediaDevices.enumerateDevices().then((devices) => {
            const videoDevices = devices.filter((device) => device.kind === "videoinput")
            setCameras(videoDevices) // Set available cameras
            if (videoDevices.length > 0) {
                setSelectedCamera(videoDevices[0].deviceId) // Set default camera
            }
        })
    }, [])

    useEffect(() => {
        if (!selectedCamera || !videoRef.current) return

        // Initialize QR Scanner with the selected camera
        const startScanner = async () => {
            if (qrScanner) {
                await qrScanner.stop() // Stop any previous scanner instance
            }
            const newQrScanner = new QrScanner(videoRef.current, (result) => handleScanResult(result), {
                highlightScanRegion: true,
                preferredCamera: selectedCamera, // Set the selected camera as the preferred one
            })
            newQrScanner.start() // Start the QR scanner
            setQrScanner(newQrScanner) // Save the scanner instance
        }

        startScanner()

        // Cleanup the QR scanner on component unmount
        return () => {
            if (qrScanner) {
                qrScanner.stop()
            }
        }
    }, [selectedCamera]) // Only run when selectedCamera changes

    const handleScanResult = (result) => {
        try {
            const decryptedText = decrypt(result.data, passwordRef.current) // Use the latest password from the ref
            onDecrypted(decryptedText) // Send decrypted text back to QR2Text component
        } catch (e) {
            setError("Failed to decrypt the QR code. Please check your password.")
        }
    }

    const handleCameraChange = (event) => {
        setSelectedCamera(event.target.value) // Update the selected camera
    }

    return (
        <div class="pt-4 text-center">
            <video ref={videoRef} style={{ width: "100%" }}></video>
            {error && <p class={styles.error}>{error}</p>}

            {/* Show camera select dropdown if more than one camera */}
            {cameras.length > 1 && (
                <div class="mt-2">
                    <label for="cameraSelect" class="block text-gray-700">
                        Select Camera:
                    </label>
                    <select
                        id="cameraSelect"
                        value={selectedCamera}
                        onChange={handleCameraChange}
                        class="border border-gray-400 rounded p-1"
                    >
                        {cameras.map((camera) => (
                            <option key={camera.deviceId} value={camera.deviceId}>
                                {camera.label || `Camera ${camera.deviceId}`}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    )
}
