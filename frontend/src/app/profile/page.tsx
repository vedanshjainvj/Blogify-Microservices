"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppData, user_service } from "@/context/AppContext";
import React, { useRef, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "@/components/loading";
import { Facebook, Instagram, Linkedin, Camera, Edit, LogOut, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { redirect, useRouter } from "next/navigation";

const ProfilePage = () => {
  const { user, setUser, logoutUser } = useAppData();

  if (!user) return redirect("/login");

  const logoutHandler = () => {
    logoutUser();
  };
  const InputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    instagram: user?.instagram || "",
    facebook: user?.facebook || "",
    linkedin: user?.linkedin || "",
    bio: user?.bio || "",
  });

  const clickHandler = () => {
    InputRef.current?.click();
  };

  const changeHandler = async (e: any) => {
    const file = e.target.files[0];

    if (file) {
      const formData = new FormData();

      formData.append("file", file);
      try {
        setLoading(true);
        const token = Cookies.get("token");
        const { data } = await axios.post(
          `${user_service}/api/v1/user/update/pic`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success(data.message);
        setLoading(false);
        Cookies.set("token", data.token, {
          expires: 5,
          secure: true,
          path: "/",
        });
        setUser(data.user);
      } catch (error) {
        toast.error("Image Update Failed");
        setLoading(false);
      }
    }
  };

  const handleFormSubmit = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("token");
      const { data } = await axios.post(
        `${user_service}/api/v1/user/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(data.message);
      setLoading(false);
      Cookies.set("token", data.token, {
        expires: 5,
        secure: true,
        path: "/",
      });
      setUser(data.user);
      setOpen(false);
    } catch (error) {
      toast.error("Update Failed");
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account and personal information</p>
        </div>

        <Card className="border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="relative inline-block group">
                <Avatar
                  className="w-32 h-32 border-4 border-white shadow-lg cursor-pointer transition-transform hover:scale-105"
                  onClick={clickHandler}
                >
                  <AvatarImage src={user?.image} alt="Profile" className="object-cover" />
                </Avatar>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  ref={InputRef}
                  onChange={changeHandler}
                />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">{user?.name}</h2>
              {user?.bio && (
                <p className="text-gray-600 max-w-md mx-auto">{user.bio}</p>
              )}
            </div>

            {(user?.instagram || user?.facebook || user?.linkedin) && (
              <div className="flex justify-center gap-4 mb-8">
                {user?.instagram && (
                  <a
                    href={user.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white hover:bg-pink-600 transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                )}

                {user?.facebook && (
                  <a
                    href={user.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                )}

                {user?.linkedin && (
                  <a
                    href={user.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center text-white hover:bg-blue-800 transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button 
                onClick={() => router.push("/blog/new")}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12"
              >
                <Plus className="w-4 h-4" />
                New Blog
              </Button>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white rounded-xl h-12">
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md rounded-2xl">
                  <DialogHeader className="mb-6">
                    <DialogTitle className="text-xl font-bold text-gray-900">
                      Edit Profile
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Name</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="mt-1 border-gray-200 focus:border-blue-500 rounded-lg"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Bio</Label>
                      <Input
                        value={formData.bio}
                        onChange={(e) =>
                          setFormData({ ...formData, bio: e.target.value })
                        }
                        placeholder="Tell us about yourself..."
                        className="mt-1 border-gray-200 focus:border-blue-500 rounded-lg"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Instagram</Label>
                      <Input
                        value={formData.instagram}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            instagram: e.target.value,
                          })
                        }
                        placeholder="https://instagram.com/username"
                        className="mt-1 border-gray-200 focus:border-blue-500 rounded-lg"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Facebook</Label>
                      <Input
                        value={formData.facebook}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            facebook: e.target.value,
                          })
                        }
                        placeholder="https://facebook.com/username"
                        className="mt-1 border-gray-200 focus:border-blue-500 rounded-lg"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-700">LinkedIn</Label>
                      <Input
                        value={formData.linkedin}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            linkedin: e.target.value,
                          })
                        }
                        placeholder="https://linkedin.com/in/username"
                        className="mt-1 border-gray-200 focus:border-blue-500 rounded-lg"
                      />
                    </div>

                    <Button
                      onClick={handleFormSubmit}
                      className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg h-12 mt-6"
                    >
                      Save Changes
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button 
                onClick={logoutHandler}
                variant="outline"
                className="flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50 rounded-xl h-12"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;