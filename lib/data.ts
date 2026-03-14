import { db } from "@/db/client";
import { bookmarks, categories } from "@/db/schema";
import { eq, gte, desc } from "drizzle-orm";
import { directory } from "@/directory.config";

export type Bookmark = typeof bookmarks.$inferSelect;
export type Category = typeof categories.$inferSelect;

export async function getAllBookmarks(): Promise<(Bookmark & { category: Category | null })[]> {
  const results = await db
    .select()
    .from(bookmarks)
    .leftJoin(categories, eq(bookmarks.categoryId, categories.id));
  
  return results.map(row => ({
    ...row.bookmarks,
    category: row.categories,
  }));
}

export async function getAllCategories(): Promise<Category[]> {
  return await db.select().from(categories);
}

export async function getBookmarkById(id: number): Promise<(Bookmark & { category: Category | null }) | null> {
  const results = await db
    .select()
    .from(bookmarks)
    .leftJoin(categories, eq(bookmarks.categoryId, categories.id))
    .where(eq(bookmarks.id, id))
    .limit(1);
  
  if (results.length === 0) {
    return null;
  }

  return {
    ...results[0].bookmarks,
    category: results[0].categories,
  };
}

export async function getNewBookmarks(): Promise<(Bookmark & { category: Category | null })[]> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - directory.newTemplates.days);

  const results = await db
    .select()
    .from(bookmarks)
    .leftJoin(categories, eq(bookmarks.categoryId, categories.id))
    .where(gte(bookmarks.createdAt, cutoffDate))
    .orderBy(desc(bookmarks.createdAt))
    .limit(directory.newTemplates.maxItems);

  return results.map(row => ({
    ...row.bookmarks,
    category: row.categories,
  }));
}

export async function getBookmarkBySlug(slug: string): Promise<(Bookmark & { category: Category | null }) | null> {
  const results = await db
    .select()
    .from(bookmarks)
    .leftJoin(categories, eq(bookmarks.categoryId, categories.id))
    .where(eq(bookmarks.slug, slug))
    .limit(1);
  
  if (results.length === 0) {
    return null;
  }

  return {
    ...results[0].bookmarks,
    category: results[0].categories,
  };
}
