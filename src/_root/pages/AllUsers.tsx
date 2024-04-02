import Loader from "../../components/shared/Loader";
import UserCard from "../../components/shared/UserCard"
import { useGetUsers } from "../../lib/react-query/queriesAndMutations";

const AllUsers = () => {
  const { data: users, isPending: isLoadingUsers } = useGetUsers();
  return (
    <div className="common-container">
      <div className="user-container">
        <div className="flex gap-2">
          <img src="/assets/icons/people.svg" alt="all users" width={36} height={36} className="invert-white"/>
          <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        </div>

        {isLoadingUsers && !users ? (<Loader />)
          : (
            <ul className="user-grid">
              {users?.documents.map((user) => (
                <li key={user?.username} className="flex-1 min-w-[200px] w-full">
                  <UserCard user={user} />
                </li>
              ))}
            </ul>
          )}
      </div>
    </div>

  )
}

export default AllUsers