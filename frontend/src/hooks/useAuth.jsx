import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export function useAuth() {
    const [user, setUser] = useState(() =>
    {
        const token = localStorage.getItem("token");
        if(!token) return null;
        try {
            const payload = jwtDecode(token);
            return {
                username: payload.sub, 
                role: payload.role, 
                token
            };
        }
        catch(e) {
            return null;
        }
    });

    useEffect(() => {
        const onStorage = () =>
        {
            const token = localStorage.getItem("token");
            if(!token) return setUser(null);
            try {
                const payload = jwtDecode(token);
                setUser(
                    {
                        username: payload.sub,
                        role: payload.role,
                        token
                    }
                );
            }
            catch {setUser(null);}
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    const login = (token) => {
        localStorage.setItem("token", token);
        const payload = jwtDecode(token);
        setUser(
            {
                username: payload.sub,
                role: payload.role,
                token
            }
        )
    };
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return {user, login, logout};
}