import React from "react";
import TiptapEditor from "../../tiptap/TiptapEditor";
import { ArrowRight } from "lucide-react";

export default function ReadCaseStudy({ content} : { content: any }) {
  return (
    <main className='mb-10'>
    <div>
        <TiptapEditor 
            editable={false}
            content={content}
        />
    </div>
    </main>
  );
};
