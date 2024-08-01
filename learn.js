const updateTheme = () => {
    const colorMode = window.matchMedia("(prefers-color-scheme: dark)").matches ?
        "dark" :
        "light";
    document.querySelector("html").setAttribute("data-bs-theme", colorMode);
}

updateTheme()

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme)
