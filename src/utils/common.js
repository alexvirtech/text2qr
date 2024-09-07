export const pages = {
    "/text2qr": "Text to QR",
    "/qr2text": "QR to Text",    
    "/enctext": "Encrypt Text",
    "/dectext": "Decrypt Text",
    //"/home": "About",
}

export const items = [
    {
        title: "Text to QR",
        text: "Securely convert your sensitive text with a password into a QR code that can be saved or shared for easy access",
        href: "/text2qr",
    },
    {
        title: "QR to Text",
        text: "Upload a QR code and provide the correct password to decrypt and retrieve your original text",
        href: "/qr2text",
    },
    {
        title: "Encrypt Text",
        text: "Convert simple text into an encrypted string using a password for secure storage or sharing",
        href: "/enctext",
    },
    {
        title: "Decrypt Text",
        text: "Restore an encrypted string to its original text by entering the correct password",
        href: "/dectext",
    },
]

export const getHost = () => window.location.origin