"use client";

import CaseStudiesFilters from "@/components/round2/case-study-gallery/CaseStudiesFilters";
import CaseStudyCard from "@/components/round2/case-study-gallery/CaseStudyCard";
import CaseStudyHero from "@/components/round2/case-study-gallery/CaseStudyHero";
import CaseStudyModal from "@/components/round2/case-study-gallery/CaseStudyModal";
import { useEffect, useState } from "react";


interface Role {
  id: string;
  title: string;
}

interface CaseStudy {
  id: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  roleId: string | null;
  readCount: number;
}

export default function CaseStudiesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [filteredCaseStudies, setFilteredCaseStudies] = useState<CaseStudy[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/v1/round/2/case-study");
        const data = await res.json();

        setRoles(data.roles);
        setCaseStudies(
          data.caseStudies.map((cs: CaseStudy) => ({
            ...cs,
            readCount: Math.floor(Math.random() * 900 + 100), // for UI
          }))
        );
      } catch (err) {
        console.error("Failed to fetch case studies:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter on role + search
  useEffect(() => {
    let filtered = caseStudies;

    if (selectedRoleId) {
      filtered = filtered.filter((cs) => cs.roleId === selectedRoleId);
    }

    if (search.trim()) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter((cs) =>
        cs.title.toLowerCase().includes(lowerSearch)
      );
    }

    setFilteredCaseStudies(filtered);
  }, [caseStudies, selectedRoleId, search]);

  const handleRoleChange = (roleId: string | null) => {
    setSelectedRoleId(roleId);
  };

  const handleSearchChange = (query: string) => {
    setSearch(query);
  };

  console.log(selectedCaseStudy);

  const getRoleTitle = (roleId: string | null) =>
    roles.find((r) => r.id === roleId)?.title ?? "Unknown Role";

  return (
    <main className="min-h-screen">
      <CaseStudyHero search={search} onSearchChange={handleSearchChange} />

      <div className="mt-6 flex justify-center">
        <CaseStudiesFilters
          roles={roles}
          selectedRoleId={selectedRoleId}
          onRoleChange={handleRoleChange}
        />
      </div>

      {/* <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-8 py-3 ">
        {filteredCaseStudies.map((cs) => (
          <CaseStudyCard
            key={cs.id}
            caseStudy={{
              ...cs,
              role: getRoleTitle(cs.roleId),
            }}
            onViewCase={() =>
              setSelectedCaseStudy({
                ...cs,
                roleId: cs.roleId ?? null, // ensure roleId exists
              })}
              
          />
        ))}
      </div> */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
        </div>
      ) : (
        <div className=" mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-8 py-3">
          {filteredCaseStudies.map((cs) => (
            <CaseStudyCard
              key={cs.id}
              caseStudy={{
                ...cs,
                role: getRoleTitle(cs.roleId),
              }}
              onViewCase={() =>
                setSelectedCaseStudy({
                  ...cs,
                  roleId: cs.roleId ?? null,
                })
              }
            />
          ))}
        </div>
      )}




      <CaseStudyModal
        caseStudy={
          selectedCaseStudy && {
            ...selectedCaseStudy,
            role: getRoleTitle(selectedCaseStudy.roleId),
          }
        }
        isOpen={!!selectedCaseStudy}
        onClose={() => setSelectedCaseStudy(null)}
      />
    </main>
  );
}
