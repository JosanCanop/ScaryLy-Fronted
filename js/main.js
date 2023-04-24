function checkTokenOn() {
    if (!isTokenExpired()) {
        window.location.href = "home.html"
    }
}
checkTokenOn()