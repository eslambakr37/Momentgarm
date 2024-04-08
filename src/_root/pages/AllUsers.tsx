import { useEffect, useState } from "react";
import Loader from "../../components/shared/Loader";
import UserCard from "../../components/shared/UserCard"
import { useFollowUser, useGetCurrentUser, useGetUsers } from "../../lib/react-query/queriesAndMutations";
import { checkIsFollowed } from "../../lib/utils";

const AllUsers = () => {
  const { data: currentUser } = useGetCurrentUser();
  const { data: users, isPending: isLoadingUsers } = useGetUsers();
  const [following, setFollowing] = useState(['']);
  const { mutate: followUser, isPending: isFollowing } = useFollowUser();
  useEffect(() => {
    if (currentUser && following[0] == '') {
      setFollowing(currentUser?.following);
    }
  }, [currentUser])
  const handleFollowButton = (userindex: number) => {
    let newFollowing = [...following];
    let newFollowers = [...users?.documents[userindex].followers];

    if (newFollowing.includes(users?.documents[userindex].$id!)) {
      newFollowing = newFollowing.filter((id) => id != users?.documents[userindex].$id);
      newFollowers = newFollowers.filter((id) => id != currentUser?.$id);

    }
    else {
      newFollowing.push(users?.documents[userindex].$id!);
      newFollowers.push(currentUser?.$id);
    }
    setFollowing(newFollowing);
    followUser({ userId: currentUser?.$id!, followedId: users?.documents[userindex].$id!, followingArray: newFollowing, followersArray: newFollowers });
  }

  return (
    <div className="common-container">
      <div className="user-container">
        <div className="flex gap-2">
          <img src="/assets/icons/people.svg" alt="all users" width={36} height={36} />
          <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        </div>

        {isLoadingUsers && !users ? (<Loader />)
          : (
            <ul className="user-grid">
              {
                users?.documents.map((user, index) => (
                  <li key={user?.username} className="flex-1 min-w-[200px] w-full">
                    <UserCard followingState={checkIsFollowed(currentUser?.following, user.$id) ? 'Unfollw' : 'Follow'} user={user} handleFollowButton={handleFollowButton} index={index} isFollowing={isFollowing} />
                  </li>
                ))
              }
            </ul>
          )}
      </div>
    </div>

  )
}

export default AllUsers