import { Eye, Users } from "lucide-react";

interface CaseStudy {
  id: string;
  title: string;
  description: string;
  role: string;
  tags: string[];
  content: string;
  readCount: number;
}

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
  onViewCase: (caseStudy: CaseStudy) => void;
}

const CaseStudyCard = ({ caseStudy, onViewCase }: CaseStudyCardProps) => {
  return (
    <div
      className="h-full bg-white border rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group p-5 flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800 font-medium">
            {caseStudy.role}
          </span>
          <div className="flex items-center text-xs text-gray-500">
            <Users className="h-3 w-3 mr-1" />
            {caseStudy.readCount}+ readers
          </div>
        </div>

        <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors mb-2">
          {caseStudy.title}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
          {caseStudy.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-4">
          {caseStudy.tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs px-2 py-0.5 border border-gray-300 rounded-full text-gray-600"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={() => onViewCase(caseStudy)}
        className="mt-auto w-full text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
      >
        View Case
      </button>
    </div>
  );
};

export default CaseStudyCard;
