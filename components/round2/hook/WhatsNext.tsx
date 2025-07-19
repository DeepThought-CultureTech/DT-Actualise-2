'use client';

import { Target, Compass, LineChart } from 'lucide-react';

export default function WhatsNext() {
  return (
    <section className="bg-[#f9fbfd] py-20 px-6 text-center">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          What's Next?
        </h2>
        <p className="text-lg text-gray-600 mb-12">
          You've declared your intentions. Now it's time to prove them in the real world.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            icon={<Target className="w-6 h-6 text-indigo-700" />}
            title="Real-World Application"
            description="Take your Growth Manifesto beyond words. Apply your insights to actual challenges that matter to your development."
          />
          <Card
            icon={<Compass className="w-6 h-6 text-indigo-700" />}
            title="Identity Proving"
            description="This isn't just practice. Every action you take is evidence of who you're becoming. Make it count."
          />
          <Card
            icon={<LineChart className="w-6 h-6 text-indigo-700" />}
            title="Measurable Impact"
            description="Your progress will be tangible. Track, measure, and celebrate the concrete steps forward you're taking."
          />
        </div>
      </div>
    </section>
  );
}

function Card({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all text-left">
  <div className="bg-indigo-100 p-4 rounded-xl w-fit mb-6">
    {icon}
  </div>
  <h3 className="text-2xl font-semibold text-gray-900 mb-3">{title}</h3>
  <p className="text-gray-700 text-base leading-relaxed">{description}</p>
</div>
  );
}
