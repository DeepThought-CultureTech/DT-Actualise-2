import TiptapEditor from "@/components/tiptap/TiptapEditor";
import React from "react";
import { ArrowLeft } from "lucide-react";

export default function CreateAssignment ({ content, toggle, updateContent } : { content: any, toggle: () => void, updateContent: (content: any) => void }) {
  return (
    <main className='mb-10'>
        <div className="w-full flex justify-between items-center p-4">
        <span className="text-4xl tracking-tight font-bold text-blue-600 font-sans">
            Create Submission
        </span>
        <button
          onClick={() => toggle()} 
          className="bg-blue-600 font-sans hover:bg-blue-600 text-lg text-white font-medium px-5 py-2 rounded-md transition-all flex items-center gap-1">
          <ArrowLeft size={18} /> Back to Case Study
        </button>
      </div>
    <div>
        <TiptapEditor 
            editable={true}
            content={content}
            onContentUpdate={updateContent}
          />
    </div>
    <div>
      <div className="border rounded-md p-4 shadow-sm">
        <h2 className="text-md font-semibold text-gray-800 mb-1">
          Write Summary
        </h2>
        <p className="text-sm text-gray-500 mb-2">
          Distill the essence of your approach and main insights in a few sentences.
        </p>
        <p className="text-sm text-gray-400">
          What are the key insights from your analysis? What approach did you take?
        </p>
      </div>
    </div>
    </main>
  );
};