"use client";

import * as React from "react";
import { SiteHeader } from "@/components/navigation/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Briefcase, Star, ExternalLink, CalendarDays, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Vacancy = {
  id: string;
  title: string;
  department: string;
  type: string;
  format: string;
  location: string;
  pay: string;
  deadline: string;
};

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
  };
};

type Event = {
  id: string;
  title: string;
  date: string;
  location: string | null;
  type: string;
};

type Company = {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
  website: string | null;
  industry: string | null;
  vacancies: Vacancy[];
  reviews: Review[];
  events: Event[];
  _count: {
    vacancies: number;
    reviews: number;
    events: number;
  };
};

export default function CompanyDetailPage({ params }: { params: { id: string } }) {
  const [company, setCompany] = React.useState<Company | null>(null);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    async function fetchCompany() {
      try {
        const res = await fetch(`/api/companies/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setCompany(data);
        }
      } catch (error) {
        console.error("Error fetching company:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCompany();
  }, [params.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
      />
    ));
  };

  const avgRating =
    company && company.reviews.length > 0
      ? company.reviews.reduce((sum, r) => sum + r.rating, 0) / company.reviews.length
      : 0;

  if (loading) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-[1400px] px-6 py-8">
          <div className="text-center py-12 text-muted-foreground">Загрузка...</div>
        </main>
      </>
    );
  }

  if (!company) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-[1400px] px-6 py-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Компания не найдена</p>
              <Button variant="outline" className="mt-4" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Назад
              </Button>
            </CardContent>
          </Card>
        </main>
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1400px] px-6 py-8">
        <div className="grid gap-6">
          <Button variant="ghost" onClick={() => router.back()} className="w-fit">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl">{company.name}</CardTitle>
                      {company.industry && (
                        <Badge variant="outline" className="mt-2">
                          {company.industry}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {company.description && (
                    <p className="text-muted-foreground">{company.description}</p>
                  )}
                  {company.website && (
                    <Button variant="outline" asChild>
                      <a href={company.website} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Веб-сайт
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>

              {company.vacancies.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Вакансии ({company._count.vacancies})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {company.vacancies.map((vacancy) => (
                        <Link
                          key={vacancy.id}
                          href={`/vacancies`}
                          className="block p-4 rounded-lg border hover:bg-accent transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium">{vacancy.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{vacancy.department}</p>
                            </div>
                            <Badge variant="outline">{vacancy.format}</Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                            <span>{vacancy.pay}</span>
                            <span>•</span>
                            <span>{vacancy.deadline}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {company.events.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarDays className="h-5 w-5" />
                      Мероприятия ({company._count.events})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {company.events.map((event) => (
                        <Link
                          key={event.id}
                          href={`/events`}
                          className="block p-4 rounded-lg border hover:bg-accent transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium">{event.title}</h3>
                              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                <CalendarDays className="h-4 w-4" />
                                <span>{formatDate(event.date)}</span>
                              </div>
                            </div>
                            <Badge variant="outline">{event.type}</Badge>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Отзывы ({company._count.reviews})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {avgRating > 0 && (
                    <div className="flex items-center gap-2 pb-4 border-b">
                      <div className="flex">{renderStars(Math.round(avgRating))}</div>
                      <span className="text-sm text-muted-foreground">
                        {avgRating.toFixed(1)} из 5
                      </span>
                    </div>
                  )}
                  {company.reviews.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Отзывов пока нет</p>
                  ) : (
                    company.reviews.map((review) => (
                      <div key={review.id} className="space-y-2 pb-4 border-b last:border-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{review.user.name}</span>
                          <div className="flex">{renderStars(review.rating)}</div>
                        </div>
                        {review.comment && (
                          <p className="text-sm text-muted-foreground">{review.comment}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
