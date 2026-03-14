// React + Next Imports
import React from "react";
import { Suspense } from "react";

// Database Imports
import { getAllBookmarks, getAllCategories, getNewBookmarks } from "@/lib/data";

// Component Imports
import { Main, Section, Container } from "@/components/craft";
import { BookmarkCard } from "@/components/bookmark-card";
import { BookmarkGrid } from "@/components/bookmark-grid";
import { CategoryFilter } from "@/components/category-filter";
import { EmailForm } from "@/components/email-form";
import { NewTemplatesSection } from "@/components/new-templates-section";

import Balancer from "react-wrap-balancer";

export default async function Home({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
}) {
  const [bookmarks, categories, newBookmarks] = await Promise.all([
    getAllBookmarks(),
    getAllCategories(),
    getNewBookmarks(),
  ]);

  const newBookmarkIds = new Set(newBookmarks.map((b) => b.id));

  const filteredBookmarks = bookmarks
    .filter(
      (bookmark) =>
        !searchParams.category ||
        bookmark.category?.id.toString() === searchParams.category,
    )
    .filter((bookmark) => {
      if (!searchParams.search) return true;
      const searchTerm = searchParams.search.toLowerCase();
      return (
        bookmark.title.toLowerCase().includes(searchTerm) ||
        bookmark.description?.toLowerCase().includes(searchTerm) ||
        bookmark.category?.name.toLowerCase().includes(searchTerm) ||
        bookmark.notes?.toLowerCase().includes(searchTerm) ||
        bookmark.overview?.toLowerCase().includes(searchTerm)
      );
    });

  return (
    <Main>
      <Section>
        <Container>
          <div className="mx-auto max-w-2xl space-y-8 text-center">
            <h1>
              <Balancer>
                Get the latest resources sent to your inbox weekly
              </Balancer>
            </h1>
            <EmailForm />
            <p className="text-sm text-muted-foreground">
              Join 1,998+ developers · Unsubscribe anytime
            </p>
          </div>

          {newBookmarks.length > 0 && (
            <div className="mt-16">
              <NewTemplatesSection
                bookmarks={newBookmarks.map((bookmark) => ({
                  id: bookmark.id,
                  url: bookmark.url,
                  title: bookmark.title,
                  description: bookmark.description,
                  category: bookmark.category
                    ? {
                        id: bookmark.category.id.toString(),
                        name: bookmark.category.name,
                        color: bookmark.category.color || undefined,
                        icon: bookmark.category.icon || undefined,
                      }
                    : undefined,
                  favicon: bookmark.favicon,
                  overview: bookmark.overview,
                  ogImage: bookmark.ogImage,
                  isArchived: bookmark.isArchived,
                  isFavorite: bookmark.isFavorite,
                  slug: bookmark.slug,
                }))}
              />
            </div>
          )}

          <div className="mt-24 space-y-6">
            <Suspense fallback={<div>Loading categories...</div>}>
              <CategoryFilter
                categories={categories.map((cat) => ({
                  id: cat.id.toString(),
                  name: cat.name,
                  color: cat.color || undefined,
                  icon: cat.icon || undefined,
                }))}
              />
            </Suspense>

            <BookmarkGrid>
              {filteredBookmarks.map((bookmark) => (
                <BookmarkCard
                  key={bookmark.id}
                  bookmark={{
                    id: bookmark.id,
                    url: bookmark.url,
                    title: bookmark.title,
                    description: bookmark.description,
                    category: bookmark.category
                      ? {
                          id: bookmark.category.id.toString(),
                          name: bookmark.category.name,
                          color: bookmark.category.color || undefined,
                          icon: bookmark.category.icon || undefined,
                        }
                      : undefined,
                    favicon: bookmark.favicon,
                    overview: bookmark.overview,
                    ogImage: bookmark.ogImage,
                    isArchived: bookmark.isArchived,
                    isFavorite: bookmark.isFavorite,
                    slug: bookmark.slug,
                    isNew: newBookmarkIds.has(bookmark.id),
                  }}
                />
              ))}
            </BookmarkGrid>

            {filteredBookmarks.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                No bookmarks found
                {searchParams.search && ` matching "${searchParams.search}"`}
                {searchParams.category &&
                  ` in category "${categories.find((c) => c.id.toString() === searchParams.category)?.name}"`}
              </div>
            )}
          </div>
        </Container>
      </Section>
    </Main>
  );
}
