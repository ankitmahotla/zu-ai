import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/api";
import { RegisterUserInput } from "@ankitmahotla/zu-ai_common";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useDebounceCallback } from "usehooks-ts";

function Signup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const debounced = useDebounceCallback(setUsername, 500);

  const form = useForm<z.infer<typeof RegisterUserInput>>({
    resolver: zodResolver(RegisterUserInput),
    defaultValues: {
      username,
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username && username.trim().length > 0) {
        try {
          const response = await api.get(
            `/users/check-username?username=${encodeURIComponent(username)}`,
          );
          if (response.status === 200) {
            toast.success(response.data.message);
          }
        } catch (error) {
          if (error instanceof AxiosError) {
            if (error.response?.status === 409) {
              toast.error(error.response.data.message);
            } else if (error.response?.status === 400) {
              toast.error("Invalid username. Please try a different one.");
            } else {
              toast.error("Error checking username. Please try again.");
            }
          } else {
            toast.error("An unexpected error occurred. Please try again.");
          }
          console.error("Error checking username:", error);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  async function onSubmit(values: z.infer<typeof RegisterUserInput>) {
    setIsLoading(true);
    try {
      const response = await api.post("/users/register", values);
      toast.success(response.data.message || "Account created. Please log in.");
      navigate("/login");
    } catch (error) {
      let errorMessage = "Failed to create account. Please try again.";

      if (error instanceof AxiosError && error.response?.data) {
        const { message } = error.response.data;
        if (message.includes("username is taken")) {
          errorMessage = "Username already taken. Please choose another.";
        } else if (message.includes("email is taken")) {
          errorMessage = "Email already registered. Use another or log in.";
        } else {
          errorMessage = message || errorMessage;
        }
      }

      toast.error(errorMessage);
      console.error("Registration failed:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
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
                    <Input placeholder="Enter your email" {...field} />
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
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="underline font-medium text-blue-600">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
