import { Link } from "react-router-dom"
import { Button } from "../ui/button"
import { Models } from "appwrite";
import { useUserContext } from "../../context/AuthConext";

type UserCardProps = {
  followingState: string;
  user: Models.Document;
  handleFollowButton: () => void;
  index: number;
};

const UserCard = ({ followingState, user, handleFollowButton, index }: UserCardProps) => {
  const { user: currentUser } = useUserContext();



  return (
    <div className="user-card">

      <Link to={`/profile/${user?.$id}`} className="gap-2 flex flex-col justify-center items-center">
        <img src={user.imageUrl || "/assets/icons/profile-placeholder.svg"} alt="user"
          className="rounded-full w-14 h-14" />


        <h3 className="base-medium text-light-1 text-center line-clamp-1">{user?.name}</h3>


        <p className="small-regular text-light-3 text-center line-clamp-1">@{user.username}</p>
      </Link>
      {currentUser?.username == user.username ? ''
        : <Button onClick={() => {
          handleFollowButton(index)
        }} type="button" size="sm" className="shad-button_primary px-5">
          {followingState}
        </Button>}




    </div >
  )
}

export default UserCard