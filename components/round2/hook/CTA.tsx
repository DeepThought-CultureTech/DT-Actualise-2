'use client';

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export const Round2CTA = () => {
    const router = useRouter();

    return (
        <section
            style={{
                backgroundImage: 'linear-gradient(to bottom right, rgba(33, 109, 223, 1), #002B80)',
            }}
            className="text-white py-20 px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Begin Round 2</h2>
            <p className="text-lg md:text-xl mb-8">
                This is your simulation, your proving ground
            </p>
            <button
                onClick={() => { router.push('/round/2/case-study-gallery') }}
                className="bg-white text-blue-500 hover:bg-gray-100 font-semibold px-6 py-3 rounded-xl text-base md:text-lg flex items-center gap-2 mx-auto transition-transform transform hover:scale-105">
                Start Round 2 <ArrowRight size={20} />
            </button>
        </section>
    );
};
