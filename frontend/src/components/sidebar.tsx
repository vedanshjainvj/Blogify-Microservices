"use client";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { Input } from "./ui/input";
import { Search, Grid } from "lucide-react";
import { blogCategories, useAppData } from "@/context/AppContext";

const SideBar = () => {
  const { searchQuery, setSearchQuery, setCategory } = useAppData();

  return (
    <Sidebar className="border-r border-gray-100">
      <SidebarHeader className="bg-white px-6 py-8 border-b border-gray-50">
        <h1 className="text-2xl font-bold text-gray-900">Blogify</h1>
      </SidebarHeader>

      <SidebarContent className="bg-white">
        <SidebarGroup className="p-6 space-y-8">
          <div>
            <SidebarGroupLabel className="text-gray-600 font-medium mb-3">
              Search
            </SidebarGroupLabel>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blogs..."
                className="pl-10 border-gray-200 focus:border-blue-500 rounded-lg"
              />
            </div>
          </div>

          <div>
            <SidebarGroupLabel className="text-gray-600 font-medium mb-4">
              Categories
            </SidebarGroupLabel>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => setCategory("")}
                  className="w-full justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg py-2"
                >
                  <Grid className="w-4 h-4 mr-3" />
                  All
                </SidebarMenuButton>
                
                {blogCategories?.map((category, i) => (
                  <SidebarMenuButton 
                    key={i} 
                    onClick={() => setCategory(category)}
                    className="w-full justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg py-2"
                  >
                    <span className="ml-7">{category}</span>
                  </SidebarMenuButton>
                ))}
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SideBar;