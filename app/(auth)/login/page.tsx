"use client";

import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useToast } from "@/components/Toast";
import axios from "axios";

const LoginButton = dynamic(() => import("@/components/login/LoginButton"), { ssr: false });
const RoleSelector = dynamic(() => import("@/components/login/RoleSelector"), { ssr: false });
const RoundBasedCTA = dynamic(() => import("@/components/login/RoundBasedCTA"), { ssr: false });

interface Role {
  roleId: string;
  roleTitle: string;
}

export default function LoginPage() {
  const { data: session, status } = useSession();
  const { showToast } = useToast();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      showToast('success', 'Logged in', 3000); // show a toast notification.
      const fetchRoles = async () => {
        try {
          const response = await axios({
            url: "/api/v1/round/1/roles",
            method: "GET",
            headers: {
              'Content-Type': "application/json"
            }
          });

          if (response.status != 200) return;

          const formattedRoles = response.data.roles.map((role: any) => {
            return { roleId: role._id, roleTitle: role.roleTitle }
          })

          setRoles(formattedRoles || []);
        } catch (error) {
          showToast('error', 'Unable to fetch roles', 3000);
          console.error("Failed to fetch roles", error);
        } finally {
          setLoading(false);
        }
      };

      fetchRoles();
    } else {
      setLoading(false);
    }
  }, [status]);

  return (
    <main className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white px-4">
      <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-md text-center space-y-6 border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">Welcome to DeepThought Actualize</h1>
          <p className="text-sm text-gray-500">
            {status === "authenticated" ? "Continue your journey" : "Please log in to continue"}
          </p>
        </div>

        {status === "loading" || loading ? (
          <p className="text-gray-500 animate-pulse ">Loading...</p>
        ) : status === "authenticated" ? (
          (() => {

            const userStatus = session?.user?.status;
            if (
              (userStatus === "AUTHENTICATED" ||
                userStatus === "ROUND_1" ||
                userStatus === "MANIFESTO") &&
              roles.length > 0
            ) {
              return <RoleSelector uid={session.user.uid} roles={roles} />;
            }
            if (userStatus === "ROUND_2") {
              return <RoundBasedCTA round={2} />;
            }
            if (userStatus === "ROUND_3") {
              return <RoundBasedCTA round={3} />;
            }

            return <p className="text-gray-500 animate-pulse ">Loading...</p>
          })()
        ) : (
          <div className="flex justify-center">
            <LoginButton />
          </div>
        )}
      </div>
    </main>
  );
}
