import { useState } from "react";
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
import useAuthStore from "@/store/useAuthStore";
import { LoginUserInput } from "@ankitmahotla/zu-ai_common";
import { toast } from "sonner";
import { AxiosError } from "axios";

function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof LoginUserInput>>({
    resolver: zodResolver(LoginUserInput),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof LoginUserInput>) {
    setIsLoading(true);
    try {
      const response = await api.post("/users/login", values);
      const { user, accessToken, refreshToken } = response.data;
      login(user, accessToken, refreshToken);
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      let errorMessage = "Login failed. Please try again.";
  
      if (error instanceof AxiosError && error.response?.data) {
        const { message } = error.response.data;
        if (message.includes("invalid credentials")) {
          errorMessage = "Invalid username or password. Please try again.";
        } else if (message.includes("account not found")) {
          errorMessage = "Account not found. Please check your credentials or register.";
        } else {
          errorMessage = message || errorMessage;
        }
      }
  
      toast.error(errorMessage);
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="underline font-medium text-blue-600">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
