//import { ethers } from 'ethers'
import CryptoJS from "crypto-js"
import nacl from 'tweetnacl'
import { Buffer } from 'buffer'
import elliptic from 'elliptic'
const ec = elliptic.ec

// common
const getSharedSecret = (publicKeyHex, privateKeyHex) => {
    const secp256k1 = new ec('secp256k1') // eslint-disable-line new-cap
    const senderEcKey = secp256k1.keyFromPrivate(privateKeyHex.slice(2), 'hex')
    const recipientEcKey = secp256k1.keyFromPublic(publicKeyHex.slice(2), 'hex')
    const sharedSecret = senderEcKey.derive(recipientEcKey.getPublic()) // Derive a shared secret
    // Transform the BN shared secret into a 32-byte buffer
    return Buffer.from(sharedSecret.toArray('be', 32))
}

export const encryptText = (text, recipientPublicKey, senderPrivateKey) => {
    const sharedSecret = getSharedSecret(recipientPublicKey, senderPrivateKey)
    const nonce = nacl.randomBytes(24)
    const encrypted = nacl.box.after(
        Buffer.from(text),
        nonce,
        sharedSecret
    )

    const encryptedObj = {
        nonce: Buffer.from(nonce).toString('hex'),
        encrypted: Buffer.from(encrypted).toString('hex')
    }

    return encryptedObj
}

export const decryptText = (encryptedMessage, senderPublicKey, recipientPrivateKey) => {
    const encryptedObj = JSON.parse(encryptedMessage)
    try {
        const sharedSecret = getSharedSecret(senderPublicKey, recipientPrivateKey)
        //console.log("Shared Secret (decryption):", Buffer.from(sharedSecret).toString('hex'))

        const { nonce, encrypted } = encryptedObj  // Use passed encryptedObj

        const decrypted = nacl.box.open.after(
            Uint8Array.from(Buffer.from(encrypted, 'hex')),
            Uint8Array.from(Buffer.from(nonce, 'hex')),
            sharedSecret
        )

        if (decrypted) {
            const decryptedMessage = Buffer.from(decrypted).toString()
            //console.log("Decrypted Message:", decryptedMessage)
            return decryptedMessage
        } else {
            console.error('Decryption failed. Check keys, nonce, and encrypted values.')
            return 'error'
        }
    } catch (error) {
        console.error('Decryption process error:', error)
        return 'error'
    }
}



export const encrypt = (text, password) => {
    return CryptoJS.AES.encrypt(text, password).toString()
}

export const decrypt = (text, password) => {
    try {
        return CryptoJS.AES.decrypt(text, password).toString(CryptoJS.enc.Utf8)
    } catch (e) {
        return JSON.stringify(e) // temp
        //return null
    }
} 