export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-6 inline-block" style={{ animation: 'spin 3s linear infinite' }}>
          🔧
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Server Under Maintenance</h1>
        <p className="text-gray-500 leading-relaxed mb-2">
          We are currently performing scheduled maintenance and improvements.
        </p>
        <p className="text-gray-400 leading-relaxed mb-6">Please check back again shortly.</p>
        <p className="text-gray-400 text-sm">Thank you for your patience.</p>
        <div className="flex justify-center gap-1.5 mt-6">
          {[0, 160, 320].map(d => (
            <div key={d} className="w-2 h-2 rounded-full bg-gray-400"
              style={{ animation: `bounce 1.4s ease-in-out ${d}ms infinite` }} />
          ))}
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes bounce{0%,80%,100%{transform:scale(0)}40%{transform:scale(1)}}`}</style>
    </div>
  );
}
