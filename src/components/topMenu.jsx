import { Router, Link } from "preact-router"
import {styles} from "../utils/styles"

const TopMenu = () => (
    
        <div class="flex justify-end gap-4">
            <div>
                <Link href="/" class={styles.link}>Text to QR</Link>
            </div>
            <div>
                <Link href="/qr2text" class={styles.link}>QR to Text</Link>
            </div>
            <div>
                <Link href="/dectext" class={styles.link}>Decrypt Text</Link>
            </div>
            <div>
                <Link href="/about" class={styles.link}>About</Link>
            </div>
        </div>
   
)

export default TopMenu
