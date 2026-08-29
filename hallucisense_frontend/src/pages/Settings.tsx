import { useState } from 'react';
import { Save, Check } from 'lucide-react';

export default function Settings() {
  const [saved, setSaved] = useState(false);
  const [apiUrl, setApiUrl] = useState('http://localhost:8000');
  const [useMock, setUseMock] = useState(true);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
        <p className="text-sm text-gray-500 mt-1">
          Configure your HalluciSense verification engine connection.
        </p>
      </div>

      <div className="space-y-5">
        {/* API Configuration */}
        <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-card">
          <h3 className="text-sm font-bold text-gray-700 mb-4">API Configuration</h3>

          <div className="mb-4">
            <label className="block text-[12px] font-semibold text-gray-500 mb-1.5">
              Backend URL
            </label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-brand-100 bg-white text-sm text-gray-700 shadow-soft focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent transition-all"
            />
            <p className="text-[11px] text-gray-400 mt-1.5">
              Your HalluciSense pipeline backend endpoint.
            </p>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-brand-50/60">
            <div>
              <p className="text-sm font-semibold text-gray-700">Mock Mode</p>
              <p className="text-[12px] text-gray-500">
                Use mock data when the backend is unavailable.
              </p>
            </div>
            <button
              onClick={() => setUseMock((v) => !v)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                useMock ? 'bg-brand-500' : 'bg-gray-200'
              }`}
              aria-label="Toggle mock mode"
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${
                  useMock ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Analysis Settings */}
        <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-card">
          <h3 className="text-sm font-bold text-gray-700 mb-4">Analysis Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Hallucination Threshold</span>
              <span className="text-sm font-semibold text-brand-600">35% / 60%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Sentence-level breakdown</span>
              <span className="text-sm font-semibold text-green-500">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Auto-generate corrections</span>
              <span className="text-sm font-semibold text-gray-400">Manual</span>
            </div>
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 text-white text-sm font-semibold shadow-soft hover:shadow-glow transition-all duration-300"
        >
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
