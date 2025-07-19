import { Sprout, Lightbulb } from "lucide-react";
import { ReactNode } from "react";

export const MindsetSection = () => {
  return (
    <section className="bg-[#f5faff] py-16 px-6 text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-10">
        The Mindset You Need
      </h2>
      <div className="flex flex-col md:flex-row justify-center gap-6">
        <MindsetCard
          icon={<Sprout size={28} className="text-green-600" />}
          title="Growth Over Perfection"
          description="Progress matters more than perfection. Every step forward is evidence of your commitment to growth."
          bgColor="#ccfbf1"
        />
        <MindsetCard
          icon={<Lightbulb size={28} className="text-indigo-800" />}
          title="Curiosity Over Certainty"
          description="Approach challenges with genuine curiosity. The best insights come from exploring the unknown."
          bgColor="#dbeafe"
        />
      </div>
    </section>
  );
};

interface MindsetCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  bgColor: string;
}


  const MindsetCard = ({
  icon,
  title,
  description,
  bgColor,
}: MindsetCardProps) => {
  return (
    <div className="flex flex-col items-center text-center bg-white p-6 rounded-2xl shadow-md max-w-sm w-full">
      <div
        className={`p-3 rounded-xl mb-4`}
        style={{ backgroundColor: bgColor }}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      <p className="text-gray-600 mt-2">{description}</p>
    </div>
  );
};