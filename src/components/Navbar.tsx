
"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user;

  return (
    <nav className="bg-white text-black px-6 py-4 shadow-sm flex justify-between items-center font-Poppins">
  <div className="text-2xl font-semibold tracking-tight hover:tracking-wider transition-all duration-300">
    <a href="/dashboard" className="hover:text-gray-700">Anon Message</a>
  </div>
  
  <div className="flex items-center gap-4">
    {session ? (
      <>
        <span className="text-sm text-gray-800 font-medium">
          Welcome, {user.username || user.email}
        </span>
        <Button 
          onClick={() => signOut()} 
          className="bg-black text-white hover:bg-gray-800 transition-colors duration-200 rounded-xl px-4 py-2"
        >
          Logout
        </Button>
      </>
    ) : (
      <Link href="/sign-in">
        <Button 
          className="bg-black text-white hover:bg-gray-800 transition-colors duration-200 rounded-xl px-4 py-2"
        >
          Login
        </Button>
      </Link>
    )}
  </div>
</nav>
  );
};

export default Navbar;
