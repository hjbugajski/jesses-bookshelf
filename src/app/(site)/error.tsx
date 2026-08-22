'use client';

export default function Error({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-8 py-6 text-center">
      <h1 className="text-3xl font-bold xs:text-4xl">Something went wrong</h1>
      <p className="font-light">This page failed to load. Please try again.</p>
      <button
        type="button"
        onClick={() => retry()}
        className="rounded-3xl border-3 border-violet-400 bg-gradient-to-br from-violet-300/50 to-violet-200/50 px-5 py-3 text-xl leading-snug font-medium transition outline-none hover:border-violet-600 hover:shadow-lg hover:shadow-violet-300/50 focus-visible:ring-3 focus-visible:ring-violet-600 focus-visible:ring-offset-2 focus-visible:ring-offset-violet-100"
      >
        Try again
      </button>
    </div>
  );
}
