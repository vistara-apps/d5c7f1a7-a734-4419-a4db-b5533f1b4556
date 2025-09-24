export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-fg mb-2">Loading CollabSphere</h2>
        <p className="text-muted">Connecting you with like-minded collaborators...</p>
      </div>
    </div>
  );
}
