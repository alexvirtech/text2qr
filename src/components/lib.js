export const setVh = () => {
    // Use window.innerHeight directly
    let vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty("--vh", `${vh}px`)
}
