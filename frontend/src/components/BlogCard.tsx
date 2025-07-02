import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Calendar, Bookmark, BookmarkCheck, User, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import moment from "moment";
import { useAppData, user_service, blog_service } from "@/context/AppContext";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

interface BlogCardProps {
  image: string;
  title: string;
  desc: string;
  id: string;
  time: string;
  author: string;
  category: string;
}

interface Author {
  _id: string;
  name: string;
  image?: string;
}

const BlogCard: React.FC<BlogCardProps> = ({
  image,
  title,
  desc,
  id,
  time,
  author,
  category,
}) => {
  const { isAuth, savedBlogs, getSavedBlogs } = useAppData();
  const [authorData, setAuthorData] = useState<Author | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAuthor();
  }, [author]);

  useEffect(() => {
    if (savedBlogs && savedBlogs.some((b) => b.blogid === id)) {
      setSaved(true);
    } else {
      setSaved(false);
    }
  }, [savedBlogs, id]);

  const fetchAuthor = async () => {
    try {
      const { data } = await axios.get(`${user_service}/api/v1/user/${author}`);
      setAuthorData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveBlog = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuth) {
      toast.error("Please login to save blogs");
      return;
    }

    const token = Cookies.get("token");
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${blog_service}/api/v1/save/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(data.message);
      setSaved(!saved);
      getSavedBlogs();
    } catch (error) {
      toast.error("Problem while saving blog");
    } finally {
      setLoading(false);
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  return (
    <Card className="overflow-hidden border border-gray-100 rounded-xl hover:shadow-lg transition-all duration-300 group">
      <Link href={`/blog/${id}`}>
        <div className="relative w-full h-48 overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <span className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
              {category}
            </span>
          </div>
        </div>
      </Link>

      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>{moment(time).format("MMM DD, YYYY")}</span>
          </div>
          
          {isAuth && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSaveBlog}
              disabled={loading}
              className="p-1 h-auto hover:bg-blue-50"
            >
              {saved ? (
                <BookmarkCheck className="w-4 h-4 text-blue-600" />
              ) : (
                <Bookmark className="w-4 h-4 text-gray-400 hover:text-blue-600" />
              )}
            </Button>
          )}
        </div>

        <Link href={`/blog/${id}`}>
          <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {title}
          </h2>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
            {truncateText(desc, 120)}
          </p>
        </Link>

        <div className="flex items-center justify-between">
          <Link href={`/profile/${author}`} className="flex items-center gap-2 group/author">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {authorData?.image ? (
                <img 
                  src={authorData.image} 
                  alt={authorData.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 text-gray-500" />
              )}
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover/author:text-blue-600 transition-colors">
              {authorData?.name || "Loading..."}
            </span>
          </Link>

          <Link href={`/blog/${id}`}>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 h-auto group/btn"
            >
              <span className="text-xs font-medium mr-1">Read</span>
              <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default BlogCard;