"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DarkButton } from "./buttons/DarkButton";

export const Appbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const router = useRouter();

  useEffect(() => {
    // Check if the user is already logged in
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
   
    localStorage.removeItem("token"); 
    setIsLoggedIn(false); 
    router.push("/"); 
  };

  return (
    <div className="flex border-b justify-between p-4">
      <div className="flex flex-col justify-center text-2xl font-extrabold">
        WorkFlow Automation
      </div>
      <div className="flex">
        
        {isLoggedIn ? (
          <DarkButton onClick={handleLogout}>Logout</DarkButton>
        ) : (
          <>
            <div className="pr-4">
              <DarkButton
                onClick={() => {
                  router.push("/login");
                }}
              >
                Login
              </DarkButton>
            </div>
            <DarkButton
              onClick={() => {
                router.push("/signup");
              }}
            >
              Signup
            </DarkButton>
          </>
        )}
      </div>
    </div>
  );
};





