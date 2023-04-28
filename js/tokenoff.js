export function checkTokenOff() {
    if (isTokenExpired()) {
        window.location.href = "index.html"
    }
}