export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const tableComponents = {
  table: ({ node, ...props }) => (
    <table className="min-w-full divide-y divide-gray-300 my-4" {...props} />
  ),
  thead: ({ node, ...props }) => <thead className="bg-gray-50" {...props} />,
  tbody: ({ node, ...props }) => (
    <tbody className="divide-y divide-gray-200 bg-white" {...props} />
  ),
  th: ({ node, ...props }) => (
    <th
      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
      {...props}
    />
  ),
  td: ({ node, ...props }) => (
    <td
      className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
      {...props}
    />
  ),
  hr: ({ node, ...props }) => <hr className="my-2" {...props} />,
};