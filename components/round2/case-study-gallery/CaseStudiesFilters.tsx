interface Role {
  id: string;
  title: string;
}

interface RoleFiltersProps {
  roles: Role[];
  selectedRoleId: string | null;
  onRoleChange: (roleId: string | null) => void;
}

const CaseStudiesFilters = ({
  roles,
  selectedRoleId,
  onRoleChange,
}: RoleFiltersProps) => {
  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => onRoleChange(null)}
        className={`px-4 py-1 rounded-full border ${
          selectedRoleId === null
            ? "bg-blue-600 text-white"
            : "bg-white text-black"
        }`}
      >
        All
      </button>

      {roles.map((role) => (
        <button
          key={role.id}
          onClick={() => onRoleChange(role.id)}
          className={`px-4 py-1 rounded-full border ${
            selectedRoleId === role.id
              ? "bg-blue-600 text-white"
              : "bg-white text-black"
          }`}
        >
          {role.title}
        </button>
      ))}
    </div>
  );
};

export default CaseStudiesFilters;
