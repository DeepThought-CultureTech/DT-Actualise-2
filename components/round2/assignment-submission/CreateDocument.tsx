import TiptapEditor from "@/components/tiptap/TiptapEditor";
import React from "react";
import { ArrowLeft } from "lucide-react";

export default function CreateAssignment({ content, toggle, updateContent, updateSummary, submitAssignment }: {
  content: any,
  toggle: () => void,
  updateContent: (content: any) => void,
  updateSummary: (summary: string) => void,
  submitAssignment: () => void

}) {
  return (
    <main className='mb-10 font-sans'>
      <div className="w-full flex justify-between items-center py-4">
        <span className="text-4xl tracking-tight font-bold text-blue-600 font-sans">
          Create Submission
        </span>
        <button
          onClick={() => toggle()}
          className="bg-blue-600 font-sans hover:bg-blue-600 text-lg text-white font-medium px-5 py-2 rounded-md transition-all flex items-center gap-1">
          <ArrowLeft size={18} /> Case Study
        </button>
      </div>
      <div>
        <TiptapEditor
          editable={true}
          content={content}
          onContentUpdate={updateContent}
        />
      </div>
      <div className='mt-3'>
        <div className="border rounded-md p-4 shadow-sm">
          <h2 className="text-md font-semibold text-gray-800 mb-2">
            Summary & Key Insights of your Submission
          </h2>
          <textarea
            onChange={(e) => { updateSummary(e.target.value) }}
            className="w-full h-28 p-3 border border-gray-300 rounded-md text-sm text-gray-700 resize-none focus:outline-none bg-slate-50 focus:ring-2 focus:ring-blue-400"
            placeholder=""
          ></textarea>
        </div>
      </div>
      {/* Submit Button */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => {submitAssignment()}}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium font-sans text-xl px-8 py-2 rounded-lg shadow-sm transition-all"
        >
          Submit
        </button>
      </div>
    </main>
  );
};