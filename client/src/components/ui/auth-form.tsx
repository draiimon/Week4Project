import React, { useState } from "react";
import { insertUserSchema } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

// Extend the schema to add confirm password for registration
const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export const LoginForm: React.FC = () => {
  const { loginMutation } = useAuth();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values: LoginFormValues) {
    loginMutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-orange-400">Username</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Enter your username" 
                  autoComplete="username"
                  disabled={loginMutation.isPending}
                  className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500"
                />
              </FormControl>
              <FormMessage className="text-orange-300" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-orange-400">Password</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="password" 
                  placeholder="Enter your password" 
                  autoComplete="current-password"
                  disabled={loginMutation.isPending}
                  className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500"
                />
              </FormControl>
              <FormMessage className="text-orange-300" />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-gray-700 to-orange-600 hover:from-gray-600 hover:to-orange-500 text-white"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </Form>
  );
};

export const RegisterForm: React.FC<{onComplete?: () => void}> = ({ onComplete }) => {
  const { registerMutation } = useAuth();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
  });

  function onSubmit(values: RegisterFormValues) {
    if (!agreedToTerms) return;
    
    const { confirmPassword, ...userData } = values;
    registerMutation.mutate(userData, {
      onSuccess: () => {
        if (onComplete) onComplete();
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-orange-400">Email address</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="email" 
                  placeholder="Enter your email" 
                  autoComplete="email"
                  disabled={registerMutation.isPending}
                  className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500"
                />
              </FormControl>
              <FormMessage className="text-orange-300" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-orange-400">Username</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Choose a username" 
                  autoComplete="username"
                  disabled={registerMutation.isPending}
                  className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500"
                />
              </FormControl>
              <FormMessage className="text-orange-300" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-orange-400">Password</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="password" 
                  placeholder="Create a password" 
                  autoComplete="new-password"
                  disabled={registerMutation.isPending}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500"
                />
              </FormControl>
              <FormMessage className="text-orange-300" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-orange-400">Confirm Password</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="password" 
                  placeholder="Confirm your password" 
                  autoComplete="new-password"
                  disabled={registerMutation.isPending}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500"
                />
              </FormControl>
              <FormMessage className="text-orange-300" />
            </FormItem>
          )}
        />

        <div className="flex items-center space-x-2 mt-4">
          <Checkbox 
            id="terms" 
            checked={agreedToTerms} 
            onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
            disabled={registerMutation.isPending}
            className="border-orange-500 text-orange-500 focus:ring-orange-500"
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the Terms and Conditions
          </label>
        </div>

        <Button 
          type="submit" 
          className="w-full mt-4 bg-gradient-to-r from-gray-700 to-orange-600 hover:from-gray-600 hover:to-orange-500 text-white"
          disabled={registerMutation.isPending || !agreedToTerms}
        >
          {registerMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Sign up"
          )}
        </Button>
      </form>
    </Form>
  );
};
