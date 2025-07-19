"use client";

import { useRouter } from "next/navigation";

export default function RoundBasedCTA({ round }: { round: number }) {
    const router = useRouter();
    return (
        <button
            onClick={() => router.push(`/round/${round}`)}
            className={`bg-blue-600  hover:bg-blue-700 w-full px-4 py-2 border rounded-[0.5rem] text-white font-semibold flex items-center justify-center space-x-2 transition-all duration-200`}
        >
            {`Start Round ${round}`}
        </button>

    );
}
