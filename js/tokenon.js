export function checkTokenOn() {
    if (isTokenExpired()) {
        window.location.href = "index.html"
    }
}
