export default function autoREM(baseSiteWidth: number, baseFontSize: number) {
    const htmlElement = document.documentElement;
    const widthFactor = 1;

    function updateFontSize() {
        const screenWidth = window.innerWidth;

        const scaleFactor = (screenWidth * widthFactor) / baseSiteWidth;
        const newFontSize = baseFontSize * scaleFactor;

        if (screenWidth >= baseSiteWidth) {
            htmlElement.style.fontSize = `${newFontSize}px`;
        } else {
            htmlElement.style.fontSize = `1rem`;
        }
    }

    window.addEventListener("resize", updateFontSize);

    updateFontSize();

    // чтобы React мог почистить listener
    return () => {
        window.removeEventListener("resize", updateFontSize);
    };
}