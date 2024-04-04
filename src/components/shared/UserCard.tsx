import { Link } from "react-router-dom"
import { Button } from "../ui/button"
import { Models } from "appwrite";
import { useUserContext } from "../../context/AuthConext";
import { useEffect, useState } from "react";
import { useFollowUser, useGetCurrentUser } from "../../lib/react-query/queriesAndMutations";
import { checkIsFollowed } from "../../lib/utils";
import Loader from "./Loader";

type UserCardProps = {
  user: Models.Document;
  followingList: string[];
};

const UserCard = ({ user, followingList }: UserCardProps) => {
  // console.log(user);
  const { user: currentUser } = useUserContext();
  // const followingList = currentUser?.following;
  const [following, setFollowing] = useState(['']);
  const { mutate: followUser, isSuccess: isFollowed, isPending } = useFollowUser();
  // console.log(currentUser?.following);
  // console.log(followingList);


  const handleFollowButton = (e: React.MouseEvent) => {
    e.stopPropagation();
    let newFollowing = [...following];
    if (newFollowing.includes(user.$id)) {
      newFollowing = newFollowing.filter((id) => id != user.$id);
    }
    else {
      newFollowing.push(user.$id);
    }
    setFollowing(newFollowing);
    followUser({ userId: currentUser.id, followingArray: newFollowing })
  }

  // useEffect(() => {
  //   if (isPending) {
  //     return
  //   }
  //   if (isFollowed || following[0] == '') {
  //     setFollowing(currentUser?.following);
  //     console.log('here');
  //   }
  // }, [isPending])

  useEffect(() => {
    if (following && following.length <= 1) {
      setFollowing(followingList);
    }
  }, [followingList])

  return (
    <div className="user-card">

      <Link to={`/profile/${user?.$id}`} className="gap-2 flex flex-col justify-center items-center">
        <img src={user.imageUrl || "/assets/icons/profile-placeholder.svg"} alt="user"
          className="rounded-full w-14 h-14" />


        <h3 className="base-medium text-light-1 text-center line-clamp-1">{user?.name}</h3>


        <p className="small-regular text-light-3 text-center line-clamp-1">@{user.username}</p>
      </Link>
      {currentUser?.username == user.username ? ''
        : <Button onClick={handleFollowButton} type="button" size="sm" className="shad-button_primary px-5">
          {isPending ? <Loader /> : checkIsFollowed(followingList, user.$id) ? "Unfollow" : "Follow"}
          {/* Follow */}
        </Button>}




    </div>
  )
}

export default UserCard