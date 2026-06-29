export function CategoryCard({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all border group"
      style={{ borderColor: '#e5e7eb' }}
    >
      <div className="text-4xl mb-3">{icon}</div>
      <span className="text-sm group-hover:font-medium transition-all" style={{ color: '#0A2647' }}>
        {label}
      </span>
    </button>
  );
}
