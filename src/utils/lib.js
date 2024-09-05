export const setVh = () => {
    // Use window.innerHeight directly
    let vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty("--vh", `${vh}px`)
}

// copy to clipboard
export const copyText = async (e, divRef = null, parentLabel = null) => {
    const o = divRef ? divRef.current : e.target
    if (o) {
        const textToCopy = o.innerText || o.value
        if (textToCopy === '') return
        navigator.clipboard
            .writeText(textToCopy)
            .then(async () => {
                const top = o.getBoundingClientRect().top
                //let lbl = parentLabel ? `${parentLabel}->${label}` : label
                let lbl = parentLabel ?? 'Text'
                //const { showPopup } = await import('../utils/utils') // Dynamic import
                showPopup(`${lbl} is copied to clipboard`, top - 40)
                console.log('Text is copied to clipboard')
            })
            .catch(err => console.error('Failed to copy text: ', err))
    }
}

// popup wondows
export const showPopup = (message, topPosition) => {
    // Create a popup message element
    const popup = document.createElement('div')
    popup.className = 'popup'
    popup.textContent = message //'QR code copied to clipboard'
    if (topPosition) popup.style.top = `${topPosition}px`

    // Append the popup to the body
    document.body.appendChild(popup)

    // Remove the popup after a certain duration (e.g., 2 seconds)
    setTimeout(() => {
        popup.remove()
    }, 2000)
}
