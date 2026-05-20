export default function Loader() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="inline-flex h-10 w-10 animate-spin items-center justify-center rounded-full border-4 border-blue-100 border-t-blue-600" />
      <span className="sr-only">Loading</span>
    </div>
  );
}
