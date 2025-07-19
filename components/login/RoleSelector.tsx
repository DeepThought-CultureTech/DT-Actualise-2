"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "../Toast";
import { updateUserStatus } from "@/lib/apiUtil";
import axios from 'axios';

type Role = {
  roleId: string;
  roleTitle: string;
};

type RoleSelectorProps = {
  uid: string;
  roles: Role[];
};

export default function RoleSelector({ uid, roles }: RoleSelectorProps) {
  const [selectedRole, setSelectedRole] = useState<Role>();
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, update } = useSession();
  const router = useRouter();
  const { showToast } = useToast();

  if(!session) return <div>Not logged in</div> // add a page to show not logged in

  const initiateRound1 = async (userId: string, roleId: string) => {
    const response = await axios.post('/api/v1/round/1/attempt', {
        userId,
        roleId,
      }, {
        validateStatus: (status) => { return status < 500 }
      });

      if(response.status == 409) {
        return response.data.attemptId
      }

    if(response.status != 200) {
      showToast('error', 'Failed to Initiate Round 1', 3000);
      return false
    };
    return response.data.attemptId;
  };

  const handleStart = async () => {
    if (!selectedRole || isLoading) return;

    setIsLoading(true);
    showToast('loading', 'Initiating Round 1', 3000);

    try {
      
      await updateUserStatus(session.user.uid, 'ROUND_1', update)
      const initiateRound1Id = await initiateRound1(session.user.uid, selectedRole.roleId);
      router.push(`/round/1?id=${initiateRound1Id}`);
    } catch (error) {
      console.error('Error starting round:', error);
      // Handle error (show notification, etc.)
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRoleId = e.target.value;
    const role = roles.find(r => r.roleId == selectedRoleId)
    setSelectedRole(role);
  }

  return (
    <div className="space-y-4 w-full max-w-sm mx-auto">
      <select
        id="role"
        value={selectedRole?.roleId}
        onChange={(e) => handleRoleChange(e)}
        disabled={isLoading}
        className="bg-white block w-full px-4 py-2 border border-gray-300 rounded-[0.5rem] shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="">-- Choose a Role --</option>
        {roles.map((role) => (
          <option key={role.roleId} value={role.roleId}>
            {role.roleTitle}
          </option>
        ))}
      </select>

      <button
        onClick={handleStart}
        disabled={!selectedRole?.roleId || isLoading}
        className={`w-full px-4 py-2 border rounded-[0.5rem] text-white font-semibold flex items-center justify-center space-x-2 transition-all duration-200 ${
          selectedRole?.roleId && !isLoading
            ? "bg-blue-600  hover:bg-blue-700"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        {isLoading ? (
          <>
            <svg
              className="w-5 h-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </>
        ) : (
          <span>Start Round 1</span>
        )}
      </button>
    </div>
  );
}