'use client';

import React, { useState } from 'react';
import { FileText, CheckCircle2, Globe } from 'lucide-react';

type BlogPost = { id: string; title_en: string; status: 'draft' | 'published' };

export default function CMSManager() {
  // Mock Frontpage CMS state
  const [heroEN, setHeroEN] = useState('Discover Premium Lands, Plots & Luxury Villas');
  const [heroTA, setHeroTA] = useState('பிரீமியம் நிலங்கள், பிளாட்டுகள் & சொகுசு வில்லாக்கள்');
  const [subEN, setSubEN] = useState('RERA & DTCP approved premium layouts, farm lands, and villas in Chennai. Secure your future with SVV Estates.');
  const [subTA, setSubTA] = useState('சென்னையில் RERA மற்றும் DTCP அங்கீகரிக்கப்பட்ட பிரீமியம் பிளாட்டுகள், விவசாய நிலங்கள் மற்றும் வில்லாக்கள். SVV எஸ்டேட்ஸ் உடன் உங்கள் எதிர்காலத்தை பாதுகாக்கவும்.');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Mock Blog Posts state
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  const handleSaveCMS = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }, 1000);
  };

  const handleToggleBlogStatus = (id: string) => {
    setBlogs(blogs.map(b => b.id === id ? { ...b, status: b.status === 'published' ? 'draft' : 'published' } : b));
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* Header title */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Content Management (CMS)</h1>
        <p className="text-xs text-gray-400 font-medium">Configure bilingual headings, announcement banners, and edit articles published on the public blog.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Front Page Headings Editor */}
        <form onSubmit={handleSaveCMS} className="lg:col-span-8 bg-white dark:bg-card-dark rounded-2xl p-6 border border-gray-200/50 dark:border-gray-800/80 transition-colors space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 border-b pb-3 border-gray-100 dark:border-gray-850">
            <Globe className="w-4.5 h-4.5 text-gold-light" />
            <span>Home Page Banners & Texts</span>
          </h3>

          <div className="space-y-4">
            {/* English Hero */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-450 flex items-center gap-1">
                <span>Hero Banner Title (English)</span>
              </label>
              <input
                type="text"
                required
                value={heroEN}
                onChange={(e) => setHeroEN(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#282828] text-xs focus:outline-none focus:border-gold-light font-medium"
              />
            </div>

            {/* Tamil Hero */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-450">
                <span>Hero Banner Title (Tamil)</span>
              </label>
              <input
                type="text"
                required
                value={heroTA}
                onChange={(e) => setHeroTA(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#282828] text-xs focus:outline-none focus:border-gold-light font-medium"
              />
            </div>

            {/* English Subtitle */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-450">
                <span>Hero Description Subtitle (English)</span>
              </label>
              <textarea
                required
                rows={2}
                value={subEN}
                onChange={(e) => setSubEN(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#282828] text-xs focus:outline-none focus:border-gold-light"
              ></textarea>
            </div>

            {/* Tamil Subtitle */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-450">
                <span>Hero Description Subtitle (Tamil)</span>
              </label>
              <textarea
                required
                rows={2}
                value={subTA}
                onChange={(e) => setSubTA(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#282828] text-xs focus:outline-none focus:border-gold-light"
              ></textarea>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-850 flex items-center justify-between">
            {success && (
              <div className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                <CheckCircle2 className="w-4.5 h-4.5" />
                <span>Headings updated successfully!</span>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-gold-light hover:bg-gold-hover text-gray-900 rounded-lg text-xs font-bold shadow-sm transition-all ml-auto"
            >
              {loading ? 'Saving...' : 'Save Public Headings'}
            </button>
          </div>
        </form>

        {/* Right Side: Blog Articles List */}
        <div className="lg:col-span-4 bg-white dark:bg-card-dark rounded-2xl p-6 border border-gray-200/50 dark:border-gray-800/80 transition-colors space-y-4 shadow-md">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <FileText className="w-4.5 h-4.5 text-gold-light" />
            <span>Blog Articles</span>
          </h3>

          <div className="space-y-4 pt-2">
            {blogs.map((blog) => (
              <div key={blog.id} className="p-3 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850/20 space-y-2 text-xs">
                <div className="font-bold text-gray-900 dark:text-white leading-relaxed">{blog.title_en}</div>
                <div className="flex justify-between items-center pt-2">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                    blog.status === 'published' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-gray-150 text-gray-500'
                  }`}>
                    {blog.status}
                  </span>
                  <button
                    onClick={() => handleToggleBlogStatus(blog.id)}
                    className="text-[10px] font-bold text-gold-light hover:underline"
                  >
                    Toggle Status
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
