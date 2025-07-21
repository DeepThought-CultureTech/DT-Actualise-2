'use client';

import RoleFilters from '@/components/round2/case-study-gallery/CaseStudiesFilters';
import CaseStudyCard from '@/components/round2/case-study-gallery/CaseStudyCard';
import CaseStudiesGrid from '@/components/round2/case-study-gallery/CaseStudyCard';
import HeroSection from '@/components/round2/case-study-gallery/CaseStudyHero';
import CaseStudyModal from '@/components/round2/case-study-gallery/CaseStudyModal';
import { useState, useMemo } from 'react';

// ✅ Mock data defined outside (good)
const mockCaseStudies = [
  {
    id: '1',
    title: 'Increasing User Engagement Through Data-Driven Insights',
    description:
      'How we leveraged user behavior analytics to identify key friction points and improve daily active users by 45%.',
    role: 'Business Growth Analyst',
    tags: ['Analytics', 'Growth', 'UX'],
    readCount: 245,
    content:""
  },
  {
    id: '2',
    title: 'Designing for Behavioral Change: A Health App Case Study',
    description:
      'Applying behavioral psychology principles to design a habit-forming health app with 80% retention.',
    role: 'Behavioral Designer',
    tags: ['Psychology', 'Health', 'Mobile'],
    readCount: 189,
    content:""
  },
  {
    id: '3',
    title: 'From Concept to Launch: Building a B2B Marketplace',
    description:
      'Leading the end-to-end product development of a B2B platform connecting 500+ suppliers with clients. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Magnam saepe labore praesentium aut temporibus, vitae tempore exercitationem eum ipsa vel, ad quas cupiditate laborum? Ducimus natus voluptatum vel quos unde quas voluptates iure in repellendus facere tempore, quod qui non, est numquam tempora magnam neque quasi ullam iusto iste vitae? Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam vel ipsam libero accusantium odit? Nobis dolor asperiores nam, qui ipsum voluptate accusamus voluptates consequatur delectus totam! At, pariatur optio adipisci excepturi reprehenderit, dolorum rem tempora aspernatur tenetur explicabo temporibus odio cupiditate vero animi perspiciatis maxime deserunt nulla saepe iure? Temporibus perferendis ea unde delectus. A cum, repellendus quaerat nobis necessitatibus aliquam, quod omnis inventore incidunt id ullam autem dolor, maiores harum! Veniam quae quasi provident cumque illum quaerat ab nisi esse repellat at ipsam aut commodi rerum illo, officia alias unde dignissimos, corporis eaque. Hic perspiciatis quae magnam distinctio at numquam facilis illum, quaerat culpa, doloremque deleniti non sint sed provident laboriosam itaque quasi quidem corrupti officia ullam id sunt dolorum ex. Eos libero, doloribus ab perferendis similique nobis ipsum sint veritatis debitis deleniti deserunt optio culpa aut quo nulla fuga ipsam pariatur nam labore eum ullam consequuntur impedit numquam natus. Ullam architecto earum atque? Nisi itaque fugiat in eius, ratione asperiores pariatur sequi est ipsum distinctio, facere beatae! Eligendi perferendis voluptates officiis corrupti, natus ad placeat voluptatum ducimus ipsum possimus quos excepturi laboriosam non! Velit, placeat eaque, est repudiandae veritatis nihil eius illum omnis temporibus a unde, provident nam ad? Officiis mollitia suscipit error unde sed cumque dolore placeat totam quae quisquam ab eos beatae praesentium illo, assumenda sit a? Placeat qui eveniet illum sunt beatae, rem quos deserunt quae non est! Cum necessitatibus aliquid iure voluptatum, nihil illum eos quaerat velit dolorum sit nam vero porro adipisci iusto asperiores deserunt aliquam dicta incidunt libero, suscipit alias facere dolorem. Recusandae quo maiores ipsum. Iure, explicabo corrupti beatae molestiae ratione alias optio libero velit illum at provident enim iste non itaque quasi repudiandae sequi expedita recusandae. Error labore cum adipisci repellat voluptates commodi voluptatibus enim! Sunt hic fugiat excepturi recusandae?',
    role: 'Product Manager',
    tags: ['B2B', 'Marketplace', 'Strategy'],
    readCount: 312,
    content:""
  },
  {
    id: '4',
    title: 'Scaling Customer Success with Automation',
    description:
      'Implementing workflows that reduced churn by 35% and improved customer satisfaction scores.',
    role: 'Business Growth Analyst',
    tags: ['Automation', 'Customer Success', 'Retention'],
    readCount: 198,
    content:""
  },
  {
    id: '5',
    title: 'Optimizing Conversion Through Psychology-Based Design',
    description:
      'Redesigning landing pages with cognitive psychology principles, boosting conversions by 127%.',
    role: 'Behavioral Designer',
    tags: ['Psychology', 'Conversion', 'Landing Pages'],
    readCount: 267,
    content:""
  },
  {
    id: '6',
    title: 'Building a Data-Driven Product Roadmap',
    description:
      'Using analytics and feedback to prioritize features, leading to 300% faster product-market fit.',
    role: 'Product Manager',
    tags: ['Roadmap', 'Analytics', 'Strategy'],
    readCount: 223,
    content:""
  },
];

export default function CaseStudyGalleryPage() {
  // ✅ Hooks MUST be here, inside the function
  const [activeStudy, setActiveStudy] = useState<null | typeof mockCaseStudies[0]>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [role, setRole] = useState('All');
  const [search, setSearch] = useState('');
  const [caseStudies, setCaseStudies] = useState(mockCaseStudies);

  const openModal = (study: typeof mockCaseStudies[0]) => {
    setActiveStudy(study);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActiveStudy(null);
  };

  const filteredStudies = useMemo(() => {
    return caseStudies.filter((cs) => {
      const matchesRole = role === 'All' || cs.role === role;
      const matchesSearch =
        search === '' ||
        cs.title.toLowerCase().includes(search.toLowerCase()) ||
        cs.description.toLowerCase().includes(search.toLowerCase()) ||
        cs.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
      return matchesRole && matchesSearch;
    });
  }, [caseStudies, role, search]);

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <HeroSection search={search} onSearchChange={setSearch} />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <RoleFilters selected={role} onSelect={setRole} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredStudies.map((study) => (
            <CaseStudyCard
              key={study.id}
              caseStudy={study}
              onViewCase={() => openModal(study)}
            />
          ))}
        </div>

        <CaseStudyModal
          isOpen={isModalOpen}
          onClose={closeModal}
          caseStudy={activeStudy}
        />

      </div>
    </main>
  );
}



