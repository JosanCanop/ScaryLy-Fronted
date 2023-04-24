function isTokenExpired() {
    const token = localStorage.getItem("token")
    try {
        if (!token)
            return true
        const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
        const now = (Math.floor((new Date).getTime() / 1000))
        return now >= expiry;
    } catch (error) {
        return true
    }
}