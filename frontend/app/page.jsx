'use client';

import { useState } from 'react';

export default function Home() {
  const [code, setCode] = useState(`<!DOCTYPE html>
<html>
<head><title>Hello</title></head>
<body>
  <h1>Hello, world!</h1>
</body>
</html>`);

  const [downloadLink, setDownloadLink] = useState('');
  const [loading, setLoading] = useState(false);

  const generateVideo = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: code }),
      });

      const data = await response.json();
      setDownloadLink(data.downloadLink);
    } catch (err) {
      alert('Gagal membuat video.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">🎥 Create Coding Video</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Editor */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg h-[60vh] flex flex-col">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-grow bg-black text-green-400 p-4 font-mono resize-none focus:outline-none"
            placeholder="Paste kode HTML/CSS/JS di sini..."
          />
          <button
            onClick={generateVideo}
            disabled={loading}
            className={`mt-4 py-2 px-4 rounded-md ${
              loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            } transition-colors`}
          >
            {loading ? 'Membuat Video...' : 'Generate Video'}
          </button>
        </div>

        {/* iPhone Preview */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex items-center justify-center">
          <div className="relative w-48 h-96 bg-black border-8 border-gray-400 rounded-3xl overflow-hidden">
            <iframe
              srcDoc={code}
              title="preview"
              className="w-full h-full"
              style={{ border: 'none' }}
            />
          </div>
        </div>
      </div>

      {downloadLink && (
        <div className="mt-6 text-center">
          <a href={downloadLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
            📥 Download Video (.mp4)
          </a>
        </div>
      )}
    </div>
  );
}