import React from "react";
import TiptapEditor from "../../tiptap/TiptapEditor";
import { ArrowRight } from "lucide-react";

export default function ReadCaseStudy({ content, toggle } : { content: any, toggle: () => void }) {
  return (
    <main className='mb-10'>
        <div className="w-full flex justify-between items-center py-4">
        <span className="text-4xl tracking-tight font-bold text-blue-600 font-sans">
            Read Case Study
        </span>
        <button
          onClick={() => toggle()} 
          className="bg-blue-600 font-sans hover:bg-blue-600 text-lg text-white font-medium px-5 py-2 rounded-md transition-all flex items-center gap-1">
          Create Submission
          <span className='mt-[2px]'>
            <ArrowRight size={18} />
          </span>
        </button>
      </div>
    <div>
        <TiptapEditor 
            editable={false}
            content={content}
        />
    </div>
    </main>
  );
};
