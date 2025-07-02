"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { useAppData, user_service } from "@/context/AppContext";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";
import { redirect } from "next/navigation";
import Loading from "@/components/loading";
import { Sparkles, BookOpen } from "lucide-react";

const LoginPage = () => {
  const { isAuth, setIsAuth, loading, setLoading, setUser } = useAppData();

  if (isAuth) return redirect("/blogs");

  const responseGoogle = async (authResult: any) => {
    setLoading(true);
    try {
      const result = await axios.post(`${user_service}/api/v1/login`, {
        code: authResult["code"],
      });

      Cookies.set("token", result.data.token, {
        expires: 5,
        secure: true,
        path: "/",
      });
      toast.success(result.data.message);
      setIsAuth(true);
      setLoading(false);
      setUser(result.data.user);
    } catch (error) {
      console.log("error", error);
      toast.error("Problem while login you");
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Blogify</h1>
              </div>
              <p className="text-gray-600">Welcome back to your favorite blogging platform</p>
            </div>

            <Card className="border border-gray-200 shadow-lg rounded-2xl">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  Sign in to continue
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Join thousands of writers and readers sharing amazing stories
                </CardDescription>
              </CardHeader>
              
              <CardContent className="px-8 pb-8">
                <Button 
                  onClick={googleLogin}
                  className="w-full h-12 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 hover:border-gray-400 transition-colors rounded-xl font-medium"
                >
                  <img
                    src="/google.png"
                    className="w-5 h-5 mr-3"
                    alt="Google"
                  />
                  Continue with Google
                </Button>

                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-500">
                    By signing in, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 text-center">
              <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Discover Stories</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Share Ideas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginPage;