import Loader from "../../components/shared/Loader";
import { useGetPosts } from "../../lib/react-query/queriesAndMutations";
import PostCard from "../../components/shared/PostCard";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

const Home = () => {

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  // const { data: posts, isPending: isPostLoading, isError: isErrorPost } = userGetRecentPosts();

  const { data: posts, isPending: isPostLoading, fetchNextPage, hasNextPage } = useGetPosts();
  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            // <ul className="flex flex-col flex-1 gap-9 w-full">
            //   {posts?.documents.map((post: Models.Document) => (
            //     <PostCard key={post.caption} post={post} />
            //   ))}
            // </ul>
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {posts?.pages.length === 0 ? (
                <p className="text-light-4 text-center">No available posts</p>
              ) : (
                posts?.pages.map((page) => (
                  page?.documents.map((post) => (
                    <PostCard key={post.caption} post={post} $id={""} $collectionId={""} $databaseId={""} $createdAt={""} $updatedAt={""} $permissions={[]} likes={[]} />
                  ))
                ))
              )}

            </ul>
          )}
        </div>
        {hasNextPage && (
          <div ref={ref} className="mt-10">
            <Loader />
          </div>
        )}
      </div>
    </div>

  )
}

export default Home