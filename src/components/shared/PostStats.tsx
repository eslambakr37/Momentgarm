import { Models } from "appwrite";
import { useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavePost } from "../../lib/react-query/queriesAndMutations"
import { PoststatsProps } from "../../types"
import React, { useEffect, useState } from "react";
import { checkIsLiked } from "../../lib/utils";
import Loader from "./Loader";



const PostStats = ({ post, userId }: PoststatsProps) => {
    const likesList = post.likes.map((user: any) => user.$id);
    const [likes, setLikes] = useState(likesList);
    const [isSaved, setIsSaved] = useState(false);
    
    const { mutate: likePost } = useLikePost();
    const { mutate: savePost, isPending: isSavingPost } = useSavePost();
    const { mutate: deleteSavedPost, isPending: isDeletingSaved } = useDeleteSavedPost();
    const { data: currentUser } = useGetCurrentUser();

    const savedPostRecord = currentUser?.save.find((record: Models.Document) => record.post.$id === post!.$id)

    useEffect(() => {
        setIsSaved(savedPostRecord ? true : false)

    }, [currentUser])


    const handleLikePost = (e: React.MouseEvent) => {

        e.stopPropagation();
        let newLikes = [...likes];
        if (newLikes.includes(userId)) {
            newLikes = newLikes.filter((id) => id !== userId);
        }
        else {
            newLikes.push(userId);
        }
        setLikes(newLikes);
        likePost({ postId: post?.$id, likesArray: newLikes })
    }
    const handelSavePost = (e: React.MouseEvent) => {

        e.stopPropagation();

        // let newLikes = [...likes];
        // if (newLikes.includes(userId)) {
        //     newLikes = newLikes.filter((id) => id !== userId);
        // }
        // else {
        //     newLikes.push(userId);
        // }
        // setLikes(newLikes);
        // likePost({ postId: post.$id , likesArray: newLikes })

        if (savedPostRecord) {
            setIsSaved(false);
            deleteSavedPost(savedPostRecord.$id);
        } else {
            savePost({ postId: post?.$id, userId });
            setIsSaved(true);
        }
    }



    return (
        <div className="flex justify-between items-center z-20">
            <div className="flex gap-2 mr-5">
                <img src={checkIsLiked(likes, userId) ? '/assets/icons/liked.svg' : '/assets/icons/like.svg'} alt="like button" width={20} height={20}
                    onClick={handleLikePost}
                    className="cursor-pointer" />
                <p className="small-medium lg:base-medium">{likes?.length}</p>
            </div>

            <div className="flex gap-2">
                {isSavingPost || isDeletingSaved ? <Loader /> : <img src={isSaved ? '/assets/icons/saved.svg' : '/assets/icons/save.svg'} alt="like button" width={20} height={20}
                    onClick={handelSavePost}
                    className="cursor-pointer" />}
                {userId === post?.creator?.$id ? <p className="small-medium lg:base-medium"></p> : ''}
                {/* you are the owner */}
            </div>
        </div>
    )
}

export default PostStats