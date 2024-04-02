import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../lib/appwrite/api";
import { IContextType, IUser } from "../types";

export const INITIAL_USER = {
    id: '',
    name: '',
    username: '',
    email: '',
    imageUrl: '',
    bio: '',
};
const INITIAL_STATE = {
    user: INITIAL_USER,
    isLoading: false,
    isAuth: false,
    setUser: () => { },
    setIsAuth: () => { },
    checkAuthUser: async () => false as boolean,
}

const AuthContext = createContext<IContextType>(INITIAL_STATE);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<IUser>(INITIAL_USER);

    const [isAuth, setIsAuth] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const checkAuthUser = async () => {
        setIsLoading(true);
        try {
            const currentAccount = await getCurrentUser();

            if (currentAccount) {
                setUser({
                    id: currentAccount.$id,
                    name: currentAccount.name,
                    username: currentAccount.username,
                    email: currentAccount.email,
                    imageUrl: currentAccount.imageUrl,
                    bio: currentAccount.bio,
                });
                setIsAuth(true);
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const cookieFallback = localStorage.getItem('cookieFallback');
        if (
            cookieFallback === "[]" ||
            cookieFallback === null ||
            cookieFallback === undefined
        ) {
            navigate('/sign-in');
        }
        checkAuthUser();
    }, [])

    const value = {
        user,
        setUser,
        isLoading,
        isAuth,
        setIsAuth,
        checkAuthUser,
    }
    return (<AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>)
}

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext);