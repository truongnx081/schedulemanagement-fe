import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    sub: string;
    exp: number;
    scope: string[];
    userId: number;
}

export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        if (decodedToken.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            return false;
        }
        return true;
    } catch (error) {
        return false;
    }
};

export const getUserScope = (): string | null => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        return decodedToken.scope;
    } catch (error) {
        return null;
    }
};

export const getUserId = (): number | null => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        return decodedToken.userId;
    } catch (error) {
        return null;
    }
};

export const getRole = (role): boolean | null => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    let isRole = false;
    getUserScope()?.forEach(scope => {
        if (scope === role) {
            return isRole = true;
        }

    })
    return isRole;
};

