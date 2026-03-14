import React from "react";
import { Sparkles } from "lucide-react";
import { BookmarkCard } from "@/components/bookmark-card";
import { directory } from "@/directory.config";

interface NewTemplateBookmark {
  id: number;
  url: string;
  title: string;
  description?: string | null;
  category?: {
    id: string;
    name: string;
    color?: string;
    icon?: string;
  };
  favicon?: string | null;
  overview?: string | null;
  ogImage?: string | null;
  isArchived: boolean;
  isFavorite: boolean;
  slug: string;
}

export const NewTemplatesSection = ({
  bookmarks,
}: {
  bookmarks: NewTemplateBookmark[];
}) => {
  if (bookmarks.length === 0) return null;

  return (
    <div className="rounded-2xl border border-green-200 bg-green-50/50 p-6 dark:border-green-900/50 dark:bg-green-950/20">
      <div className="mb-5 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400" />
        <h2 className="text-lg font-semibold tracking-tight">
          {directory.newTemplates.sectionTitle}
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {bookmarks.map((bookmark, index) => (
          <div
            key={bookmark.id}
            className="fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <BookmarkCard bookmark={{ ...bookmark, isNew: true }} />
          </div>
        ))}
      </div>
    </div>
  );
};
