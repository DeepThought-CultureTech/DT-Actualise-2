'use client';

import Image from 'next/image';

export default function Guide() {
  return (
    <section className="bg-white py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className=''>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-10">
            What You'll Be Doing
          </h2>

          <ol className="space-y-10">
            <Step
              number="1"
              title="Choose Your Challenge"
              description="Pick a real-world case study that matches your identity and aligns with where you want to grow."
            />
            <Step
              number="2"
              title="Commit With Clarity"
              description="Celebrate your growth, write your baby steps, and set a self-defined timeline."
            />
            <Step
              number="3"
              title="Execute With Purpose"
              description="Apply your insights thoughtfully, documenting your process and decision-making along the way."
            />
          </ol>
        </div>

        {/* Right Image */}
        <div className="rounded-3xl overflow-hidden bg-grey-300 shadow-lg">
          <Image
            src="/round2stepss.png"
            alt="Person working with analytics"
            width={800}
            height={300}
            className="h-auto object-cover"
          />
        </div>
      </div>
    </section>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <li className="flex items-start gap-5">
      {/* Step Number Circle */}
      <div className="min-w-10 min-h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-base mt-1">
        {number}
      </div>

      {/* Step Content */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600 mt-1 text-base leading-relaxed">{description}</p>
      </div>
    </li>
  );
}
