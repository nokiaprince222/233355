"use client";

import * as React from "react";
import { SiteHeader } from "@/components/navigation/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bookmark as BookmarkIcon, Trash2, Briefcase } from "lucide-react";
import Link from "next/link";

type Vacancy = {
  id: string;
  title: string;
  department: string;
  type: string;
  format: string;
  pay: string;
  deadline: string;
  status: string;
};

type Bookmark = {
  id: string;
  createdAt: string;
  vacancy: Vacancy;
};

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = React.useState<Bookmark[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [userId, setUserId] = React.useState<string>("");

  React.useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          const user = await res.json();
          setUserId(user.id);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
    fetchUser();
  }, []);

  React.useEffect(() => {
    if (!userId) return;
    async function fetchBookmarks() {
      try {
        const res = await fetch(`/api/bookmarks?userId=${userId}`);
        if (res.ok) {
          const data = await res.json();
          setBookmarks(data);
        }
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBookmarks();
  }, [userId]);

  async function handleRemoveBookmark(vacancyId: string) {
    try {
      await fetch(`/api/bookmarks?userId=${userId}&vacancyId=${vacancyId}`, {
        method: "DELETE",
      });
      setBookmarks(bookmarks.filter((b) => b.vacancy.id !== vacancyId));
    } catch (error) {
      console.error("Error removing bookmark:", error);
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1400px] px-6 py-8">
        <div className="grid gap-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Закладки</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Сохранённые вакансии для быстрого доступа
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Загрузка...</div>
          ) : bookmarks.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookmarkIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Закладок пока нет</p>
                <Link href="/vacancies" className="mt-4">
                  <Button variant="outline">
                    <Briefcase className="h-4 w-4 mr-2" />
                    К вакансиям
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {bookmarks.map((bookmark) => (
                <Card key={bookmark.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <Link href={`/vacancies/${bookmark.vacancy.id}`}>
                          <h3 className="font-medium hover:text-primary transition-colors line-clamp-1">
                            {bookmark.vacancy.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                          {bookmark.vacancy.department}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-3 text-sm">
                          <Badge variant="outline">{bookmark.vacancy.format}</Badge>
                          <span className="text-muted-foreground">{bookmark.vacancy.pay}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveBookmark(bookmark.vacancy.id)}
                        className="shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
