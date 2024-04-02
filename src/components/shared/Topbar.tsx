import { Link, useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { useSignOutAccount } from "../../lib/react-query/queriesAndMutations"
import { useEffect } from "react";
import { useUserContext } from "../../context/AuthConext";

const Topbar = () => {
    const navigate = useNavigate();

    const { mutate: signOut, isSuccess } = useSignOutAccount();

    const { user } = useUserContext();

    useEffect(() => {
        if (isSuccess) {
            navigate(0);
        }
    }, [isSuccess])
    return (
        <section className="topbar">
            <div className="flex-between py-4 px-4">
                <Link to='/' className="flex gap-3 items-center">
                    <div className="flex justify-center items-center">
                        <img src="/assets/images/logo.svg" width={40} height={40} alt="logo" />
                        <h1 className="h3-bold">Momentgram</h1>
                    </div>
                </Link>

                <div className="flex gap-4">
                    <Button
                        variant='ghost'
                        className="shad-button_ghost"
                        onClick={() => signOut()}
                    >
                        <img src="/assets/icons/logout.svg" alt="logout" />
                    </Button>
                    <Link to={`/profile/${user.id}`} className="flex-center gap-3">
                        <img
                            src={user.imageUrl || '/assets/icons/profile-placeholder.svg'}
                            alt="profile"
                            className="h-8 w-8 rounded-full"
                        />
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default Topbar