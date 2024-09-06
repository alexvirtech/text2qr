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
    const [stream, setStream] = useState(null) // Store the media stream
    const [permissionsGranted, setPermissionsGranted] = useState(false) // Track camera permissions
    const [isSwitching, setIsSwitching] = useState(false) // Track camera switching

    // Update the password ref whenever the password changes
    useEffect(() => {
        passwordRef.current = password
    }, [password])

    // Fetch available cameras on mount
    useEffect(() => {
        navigator.mediaDevices.enumerateDevices().then((devices) => {
            const videoDevices = devices.filter((device) => device.kind === "videoinput")
            setCameras(videoDevices) // Set available cameras
            if (videoDevices.length > 0) {
                setSelectedCamera(videoDevices[0].deviceId) // Set default camera
            }
        })
    }, [])

    // Stop any running video stream
    const stopVideoStream = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop()) // Stop all tracks
            videoRef.current.srcObject = null // Detach the stream from the video element
            setStream(null)
        }
    }

    // Function to handle permission check and video stream retry for iOS
    const retryVideoStream = (retryCount = 0) => {
        if (retryCount >= 3) return // Limit retries to 3 attempts

        setTimeout(() => {
            startVideoStream(true) // Attempt to reinitialize the video stream
        }, 500 * retryCount) // Delay each retry progressively
    }

    // Start the video stream with the selected camera
    const startVideoStream = async (retry = false) => {
        if (!selectedCamera || !videoRef.current || isSwitching) return

        try {
            // Stop any existing stream before starting a new one
            stopVideoStream()

            const newStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    deviceId: { exact: selectedCamera },
                },
            })

            setStream(newStream) // Save the new stream
            videoRef.current.srcObject = newStream // Attach the stream to the video element
            videoRef.current.play() // Ensure the video is playing

            console.log("Started video stream with camera:", selectedCamera)
            setPermissionsGranted(true) // Mark permissions as granted once the stream starts
            setIsSwitching(false) // Reset camera switching status
        } catch (err) {
            setError(`Error accessing camera: ${err.message}`)
            console.error("Error starting video stream:", err)

            if (!retry) {
                console.log("Retrying video stream initialization...")
                retryVideoStream(1) // Retry initialization if it fails
            }
        }
    }

    // Handle QR scanner once the video stream is ready
    const startQrScanner = () => {
        if (!videoRef.current) return

        const qrScanner = new QrScanner(videoRef.current, (result) => handleScanResult(result), {
            highlightScanRegion: true,
        })

        qrScanner.start().catch((err) => {
            setError(`Error starting QR scanner: ${err.message}`)
        })

        return qrScanner
    }

    // Handle the first access (iOS permission granting issue)
    useEffect(() => {
        if (permissionsGranted && selectedCamera) {
            startVideoStream() // Start video stream only when permission is granted
        }
    }, [permissionsGranted, selectedCamera])

    // When the selected camera changes or the component mounts, restart the video stream
    useEffect(() => {
        if (selectedCamera && !isSwitching) {
            console.log("Selected camera changed, restarting video stream...")
            setIsSwitching(true) // Mark as switching cameras
            startVideoStream() // Start the video stream and allow retry if needed
        }

        return () => {
            stopVideoStream() // Stop the video stream when the component unmounts
        }
    }, [selectedCamera])

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
            <video ref={videoRef} playsinline autoPlay style={{ width: "100%", height: "auto" }}></video>
            {error && <p class={styles.error}>{error}</p>}

            {/* Show camera select dropdown if more than one camera */}
            {cameras.length > 1 && (
                <div class="mt-2">
                    <label htmlFor="cameraSelect" class="block text-gray-700">
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
