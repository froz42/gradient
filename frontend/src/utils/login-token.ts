class LoginToken {
    private static extractTokenFromUrl(): string | undefined {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        return token || undefined;
    }

    public static getToken(): string | undefined {
        const token = LoginToken.extractTokenFromUrl();
        if (token) {
            localStorage.setItem('token', token);
            window.history.replaceState({}, document.title, window.location.pathname);
            return token;
        }
        return localStorage.getItem('token') || undefined;
    }
}

export default LoginToken;