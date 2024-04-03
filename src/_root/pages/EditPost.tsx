import { useParams } from "react-router"
import PostForm from "../../components/forms/PostForm"
import { useGetPostById } from "../../lib/react-query/queriesAndMutations";
import Loader from "../../components/shared/Loader";
import { useUserContext } from "../../context/AuthConext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const EditPost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: post, isPending } = useGetPostById(id || '');
  const { user } = useUserContext();

  useEffect(() => {
    if (user.id != post?.creator.$id) {
      navigate('/');
    }
  }, [])

  if (isPending) return (
    <div className="flex-center w-full h-full">
      <Loader />
    </div>
  );
  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img src="/assets/icons/add-post.svg" alt="add" width={36} height={36} />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit post</h2>
        </div>

        {isPending ? <Loader /> : <PostForm action='Update' post={post} />}

      </div>

    </div>)
}

export default EditPost