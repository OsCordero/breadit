function CodeRenderer({ data }: any) {
  data;

  return (
    <pre className="bg-gray-700 rounded-md p-4 dark:bg-gray-900">
      <code className="text-gray-100 text-sm">{data.code}</code>
    </pre>
  );
}

export default CodeRenderer;
