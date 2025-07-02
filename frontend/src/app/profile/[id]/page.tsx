"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { User, user_service } from "@/context/AppContext";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "@/components/loading";
import { Facebook, Instagram, Linkedin, User as UserIcon } from "lucide-react";
import { useParams } from "next/navigation";

const UserProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  async function fetchUser() {
    try {
      setLoading(true);
      const { data } = await axios.get(`${user_service}/api/v1/user/${id}`);
      setUser(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">User not found</h2>
          <p className="text-gray-600">The profile you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Learn more about this writer</p>
        </div>

        <Card className="border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <Avatar className="w-32 h-32 border-4 border-white shadow-lg mx-auto mb-4">
                <AvatarImage src={user?.image} alt="Profile" className="object-cover" />
              </Avatar>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{user?.name}</h2>
              {user?.bio && (
                <p className="text-gray-600 max-w-md mx-auto leading-relaxed">{user.bio}</p>
              )}
            </div>

            {(user?.instagram || user?.facebook || user?.linkedin) && (
              <div className="flex justify-center gap-4">
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

            {!user?.bio && !(user?.instagram || user?.facebook || user?.linkedin) && (
              <div className="text-center py-8">
                <UserIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">This user hasn't added any additional information yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfilePage;