export default function CategoryCard({
  icon,
  title,
  subtitle,
  gradient,
}) {
  return (
    <div className="group rounded-[30px] bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      {/* ICON */}
      <div
        className={`mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-r ${gradient}`}
      >
        {icon}
      </div>

      {/* TITLE */}
      <h2 className="text-xl font-black text-gray-800">
        {title}
      </h2>

      {/* SUBTITLE */}
      <p className="mt-2 text-sm leading-6 text-gray-500">
        {subtitle}
      </p>
    </div>
  );
}