import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "../../components/ui/form"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { SigninSchema } from "../../lib/validation"
import { z } from "zod";
import Loader from "../../components/shared/Loader"
import { Link, useNavigate } from "react-router-dom"
import { useToast } from "../../components/ui/use-toast"
import { useSignInAccount } from "../../lib/react-query/queriesAndMutations"
import { useUserContext } from "../../context/AuthConext"

// import Logo from "../../../public/assets/images/logo.svg";


const SigninForm = () => {

  const { toast } = useToast();

  const navigate = useNavigate();


  const { mutateAsync: signInAccount } = useSignInAccount();


  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  // 1. Define your form.
  const form = useForm<z.infer<typeof SigninSchema>>({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SigninSchema>) {
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
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-6">Log in to your account</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">Welcome back!, please enter your details</p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 sm:gap-2 w-full mt-4">
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
            {isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : "Sign in"}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Don't have an account?
            <Link to='/sign-up' className="text-primary-500 text-small-semibold ml-1">Sgin up</Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SigninForm