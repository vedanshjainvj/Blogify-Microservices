"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { CircleUserRoundIcon, LogIn, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppData } from "@/context/AppContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { loading, isAuth } = useAppData();

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href={"/blogs"} className="text-2xl font-bold text-gray-900">
            Blogify
          </Link>

          <div className="md:hidden">
            <Button 
              variant={"ghost"} 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          <ul className="hidden md:flex items-center space-x-8 text-gray-600">
            <li>
              <Link href={"/blogs"} className="hover:text-gray-900 transition-colors">
                Home
              </Link>
            </li>
            {isAuth && (
              <li>
                <Link href={"/blog/saved"} className="hover:text-gray-900 transition-colors">
                  Saved
                </Link>
              </li>
            )}
            {!loading && (
              <li>
                {isAuth ? (
                  <Link href={"/profile"} className="hover:text-gray-900 transition-colors">
                    <CircleUserRoundIcon className="w-5 h-5" />
                  </Link>
                ) : (
                  <Link 
                    href={"/login"} 
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Sign In
                  </Link>
                )}
              </li>
            )}
          </ul>
        </div>

        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300",
            isOpen ? "max-h-40 opacity-100 mt-4" : "max-h-0 opacity-0"
          )}
        >
          <ul className="flex flex-col space-y-4 p-4 bg-gray-50 rounded-lg">
            <li>
              <Link href={"/blogs"} className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
            </li>
            {isAuth && (
              <li>
                <Link href={"/blog/saved"} className="text-gray-600 hover:text-gray-900">
                  Saved
                </Link>
              </li>
            )}
            {!loading && (
              <li>
                {isAuth ? (
                  <Link href={"/profile"} className="text-gray-600 hover:text-gray-900">
                    Profile
                  </Link>
                ) : (
                  <Link 
                    href={"/login"} 
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-block text-center"
                  >
                    Sign In
                  </Link>
                )}
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;