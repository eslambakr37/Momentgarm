import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "../../components/ui/form"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { SignupSchema } from "../../lib/validation"
import { z } from "zod";
import Loader from "../../components/shared/Loader"
import { Link, useNavigate } from "react-router-dom"
import { useToast } from "../../components/ui/use-toast"
import { useCreateUserAccount, useSignInAccount } from "../../lib/react-query/queriesAndMutations"
import { useUserContext } from "../../context/AuthConext"



const SignupForm = () => {

  const { toast } = useToast();

  const navigate = useNavigate();


  const { mutateAsync: createUserAccount, isPending: isCreatingUser } = useCreateUserAccount();
  const { mutateAsync: signInAccount } = useSignInAccount();

  // const { mutateAsync: signInAccount, isPending: isSiningIn } = useSignInAccount();

  const { checkAuthUser } = useUserContext();
  // const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  // 1. Define your form.
  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignupSchema>) {
    // Create new user
    const newUser = await createUserAccount(values);

    if (!newUser) {
      return toast({ title: "Sign up failed. Please try again." })
    }

    const session = await signInAccount({
      email: values.email,
      password: values.password,
    })

    if (!session) {
      return toast({ title: "Sign in failed. Please try again." })
    }

    const isLoggedIn = await checkAuthUser();

    if (isLoggedIn) {
      form.reset();
      navigate('/');
    }
    else {
      return toast({ title: "Sign up failed. Please try again." })

    }

  }
  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
      <div className="flex justify-center items-center">
        <img src="/assets/images/logo.svg" width={40} height={40} alt="logo" />
        <h1 className="h1-bold">Momentgram</h1>
        </div>
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-6">Create a new account</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">To use Momentgram, please enter your acount details</p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 sm:gap-2 w-full mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Type your name" type="text" className="shad-input" {...field} />
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
                  <Input placeholder="Type your username" type="text" className="shad-input" {...field} />
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
                  <Input placeholder="Type your email" type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Set a strong password" type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="shad-button_primary" type="submit">
            {isCreatingUser ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : "Sign up"}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?
            <Link to='/sign-in' className="text-primary-500 text-small-semibold ml-1">Log in</Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SignupForm