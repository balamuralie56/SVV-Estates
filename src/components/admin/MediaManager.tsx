'use client';

import { useEffect, useRef, useState } from 'react';
import { Film, Image as ImageIcon, Trash2, UploadCloud } from 'lucide-react';
import { supabase, LISTING_MEDIA_BUCKET, type ListingMediaRow } from '@/lib/supabase';

interface UploadTask {
  id: string;
  name: string;
  status: 'uploading' | 'error' | 'done';
  error?: string;
}

export default function MediaManager({ listingId }: { listingId: string }) {
  const [media, setMedia] = useState<ListingMediaRow[]>([]);
  const [tasks, setTasks] = useState<UploadTask[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadMedia = async () => {
    const { data, error: loadError } = await supabase
      .from('listing_media')
      .select('*')
      .eq('listing_id', listingId)
      .order('sort_order', { ascending: true });
    if (loadError) {
      setListError(loadError.message);
      return;
    }
    setMedia((data ?? []) as ListingMediaRow[]);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount; setState only happens after the await inside loadMedia
    loadMedia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingId]);

  const uploadOne = async (file: File, taskId: string, nextSortOrder: number) => {
    const kind = file.type.startsWith('video') ? 'video' : 'photo';
    const path = `${listingId}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;

    const { error: uploadError } = await supabase.storage.from(LISTING_MEDIA_BUCKET).upload(path, file);
    if (uploadError) {
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: 'error', error: uploadError.message } : t)));
      return;
    }

    const { data: publicUrl } = supabase.storage.from(LISTING_MEDIA_BUCKET).getPublicUrl(path);
    const { error: insertError } = await supabase.from('listing_media').insert({
      listing_id: listingId,
      kind,
      source: 'owner_provided',
      url: publicUrl.publicUrl,
      sort_order: nextSortOrder,
    });

    if (insertError) {
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: 'error', error: insertError.message } : t)));
      return;
    }

    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: 'done' } : t)));
    loadMedia();
  };

  const handleFiles = (fileList: FileList | File[]) => {
    const files = Array.from(fileList).filter((f) => f.type.startsWith('image/') || f.type.startsWith('video/'));
    if (files.length === 0) return;

    const newTasks: UploadTask[] = files.map((f) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: f.name,
      status: 'uploading',
    }));
    setTasks((prev) => [...prev, ...newTasks]);

    const nextSortOrder = media.length;
    files.forEach((file, index) => {
      uploadOne(file, newTasks[index].id, nextSortOrder + index);
    });
  };

  const handleDelete = async (item: ListingMediaRow) => {
    const { error: deleteError } = await supabase.from('listing_media').delete().eq('id', item.id);
    if (deleteError) {
      setListError(deleteError.message);
      return;
    }
    loadMedia();
  };

  const dismissTask = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id));

  return (
    <div className="rounded-xl border border-white/10 bg-ink p-4">
      <h4 className="mb-3 text-sm font-bold text-gray-200">Owner-provided photos / videos</h4>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 text-center transition ${
          dragOver ? 'border-accent bg-accent/10' : 'border-white/15 hover:border-white/30'
        }`}
      >
        <UploadCloud className="h-6 w-6 text-gray-400" />
        <p className="text-xs font-semibold text-gray-300">
          Tap to choose photos or videos <span className="hidden sm:inline">(or drag and drop)</span>
        </p>
        <p className="text-[11px] text-gray-500">You can select multiple files at once</p>
        <input
          ref={fileInputRef}
          name="media_files"
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      {tasks.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-xs ${
                task.status === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-white/5 text-gray-300'
              }`}
            >
              <span className="truncate pr-2">{task.name}</span>
              <span className="flex shrink-0 items-center gap-2">
                {task.status === 'uploading' && 'Uploading…'}
                {task.status === 'done' && 'Done'}
                {task.status === 'error' && (task.error || 'Failed')}
                {task.status !== 'uploading' && (
                  <button onClick={() => dismissTask(task.id)} className="text-gray-500 hover:text-white">
                    ×
                  </button>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}

      {listError && <p className="mt-2 text-xs font-medium text-red-400">{listError}</p>}

      <div className="mt-4">
        {media.length === 0 ? (
          <p className="text-xs text-gray-500">
            No owner-provided media yet. The public site will show a labeled Google Street View
            reference image for this location until something is uploaded here.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {media.map((item) => (
              <div key={item.id} className="relative overflow-hidden rounded-lg border border-white/10">
                {item.kind === 'video' ? (
                  <video src={item.url} className="h-24 w-full object-cover" controls muted />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.url} alt="" className="h-24 w-full object-cover" />
                )}
                <span className="absolute left-1 top-1 rounded bg-black/70 p-1 text-white">
                  {item.kind === 'video' ? <Film className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                </span>
                {/* Always visible, not hover-only: a hover reveal is unreachable on touch screens. */}
                <button
                  onClick={() => handleDelete(item)}
                  aria-label="Remove"
                  className="absolute right-1 top-1 rounded-full bg-black/70 p-1.5 text-white transition hover:bg-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
