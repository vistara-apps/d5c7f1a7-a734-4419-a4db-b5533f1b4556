'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold text-fg mb-4">
            Something went wrong!
          </h2>
          <p className="text-muted mb-6">
            We encountered an error while loading CollabSphere. Please try again.
          </p>
          <button
            onClick={reset}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
