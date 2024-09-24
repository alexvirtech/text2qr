import { Link } from "preact-router"
import { items } from "../utils/common"
import { styles } from "../utils/styles"

export default function Home() {
    const ItemComponent = ({ item }) => {
        return (
            <Link
                href={item.href}
                class="w-1/2 min-h-[120px] border border-slate-300 rounded bg-white p-4 cursor-pointer shadow hover:shadow-md"
            >
                <div class="font-bold text-xl">{item.title}</div>
                <div class="text-sm">{item.text}</div>
            </Link>
        )
    }

    return (
        <div class="w-full max-w-[800px] mx-auto px-8 py-8 ">
            <div class="tablet:flex tablet:justify-start gap-4 w-full">
                <div class="tablet:w-1/2 p-4">
                    <img src="./qr_logo2.png" class="max-h-[200px] w-auto mx-auto" alt="" />
                </div>
                <div class="grow pt-4">
                    <div class="text-2xl font-bold pb-4">
                        Create an additional layer of security for your sensitive data using password protected QR code
                    </div>
                    <div class="pl-8">
                        <ul class="list-disc">
                            <li>Mnemonic phrase of your cryptocurrency HD wallet</li>
                            <li>List of your passwords</li>
                            <li>Small sensitive files</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="flex justify-start gap-4 w-full pt-4">
                <ItemComponent item={items[0]} />
                <ItemComponent item={items[1]} />
            </div>
            <div class="flex justify-start gap-4 w-full pt-4">
                <ItemComponent item={items[2]} />
                <ItemComponent item={items[3]} />
            </div>
            <div class="pt-4">
                <div class="min-h-[120px] border border-slate-300 rounded bg-white p-4 shadow hover:shadow-md">
                    <div class="font-bold text-xl">Restore Text from Scan</div>
                    <div class="text-sm">
                        Scan a QR code with your mobile device camera to open a page. After entering the correct
                        password, the protected text will be restored.
                    </div>
                </div>
            </div>
            <div class="pt-4 text-sm">
                <div class="font-bold">This project is 100% open-source code</div>
                <div>
                    The source code may be explored, downloaded and used locally from the repository{" "}
                    <a href="https://github.com/alexvirtech/text2qr" class={styles.link} target="_blank">
                        https://github.com/alexvirtech/text2qr
                    </a>
                </div>
            </div>
        </div>
    )
}
