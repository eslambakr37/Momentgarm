import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form, FormControl, FormField,
  FormItem, FormLabel, FormMessage,
} from "../../components/ui/form"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Textarea } from "../../components/ui/textarea"
import Loader from "../../components/shared/Loader"
import { useNavigate, useParams } from "react-router-dom"
import { useGetUserById, useUpdateUser } from "../../lib/react-query/queriesAndMutations"
import ProfileUploader from "../../components/shared/ProfileUploader"
import { ProfileUploderSchema } from "../../lib/validation"
import { useToast } from "../../components/ui/use-toast"
import { useUserContext } from "../../context/AuthConext"
import { useEffect } from "react"

const UpdateProfile = () => {

  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, setUser } = useUserContext();

  // const { user, setUser, isLoading } = useUserContext();

  const { data: currentUser } = useGetUserById(id || "");

  const { mutateAsync: updateUser, isPending: isLoadingUpdate } = useUpdateUser();

  useEffect(() => {
    if (id != user.id) {
      navigate('/');
    }
  }, [])


  // console.log(user);

  // 1. Define your form.

  const form = useForm<z.infer<typeof ProfileUploderSchema>>({
    resolver: zodResolver(ProfileUploderSchema),
    defaultValues: {
      file: [],
      name: currentUser?.name || 'too',
      username: currentUser?.username,
      email: currentUser?.email,
      bio: currentUser?.bio || "",
    },
  })

  useEffect(() => {
    if (user == null) {
      return;
    }
    form.reset({
      name: currentUser?.name,
      username: currentUser?.username,
      email: currentUser?.email,
      bio: currentUser?.bio || "",
    });

  }, [user])




  if (!currentUser) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }



  // Handler
  const handleUpdate = async (value: z.infer<typeof ProfileUploderSchema>) => {
    const updatedUser = await updateUser({
      userId: currentUser.$id,
      name: value.name,
      bio: value.bio,
      file: value.file,
      imageUrl: currentUser.imageUrl,
      imageId: currentUser.imageId,
    })


    if (!updatedUser) {
      toast({
        title: `Update user failed. Please try again.`,
      });
    }

    setUser({
      ...user,
      name: updatedUser?.name,
      bio: updatedUser?.bio,
      imageUrl: updatedUser?.imageUrl,
    });
    return navigate(`/profile/${id}`);
  }

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex-start gap-2 w-full max-w-5xl justify-start">
          <img
            src="/assets/icons/edit.svg"
            width={36}
            height={36}
            alt="saved posts"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Profile</h2>
        </div>

        <Form {...form} >
          <form onSubmit={form.handleSubmit(handleUpdate)}
            className="flex flex-col gap-7 w-full mt-4 max-w-5xl">

            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem className="flex">
                  <FormControl>
                    <ProfileUploader
                      fieldChange={field.onChange}
                      mediaUrl={currentUser?.imageUrl}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input"  {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Bio</FormLabel>
                  <FormControl>
                    <Textarea className="shad-textarea custom-scrollbar"
                      {...field} />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

            <div className="flex gap-4 items-center justify-end">
              <Button
                type="button"
                className="shad-button_dark_4"
                onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="shad-button_primary whitespace-nowrap"
                disabled={isLoadingUpdate}    >
                {isLoadingUpdate && <Loader />}
                Update Profile
              </Button>
            </div>

          </form>
        </Form>
      </div>
    </div>
  )
}

export default UpdateProfile
