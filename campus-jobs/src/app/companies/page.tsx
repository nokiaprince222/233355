"use client";

import * as React from "react";
import { SiteHeader } from "@/components/navigation/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Briefcase, Star, ExternalLink } from "lucide-react";
import Link from "next/link";

type Company = {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
  website: string | null;
  industry: string | null;
  _count: {
    vacancies: number;
    reviews: number;
  };
};

export default function CompaniesPage() {
  const [companies, setCompanies] = React.useState<Company[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchCompanies() {
      try {
        const res = await fetch("/api/companies");
        if (res.ok) {
          const data = await res.json();
          setCompanies(data);
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCompanies();
  }, []);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1400px] px-6 py-8">
        <div className="grid gap-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Компании</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Работодатели и организации, сотрудничающие с кампусом
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Загрузка...</div>
          ) : companies.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Компаний не найдено</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {companies.map((company) => (
                <Card key={company.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{company.name}</CardTitle>
                          {company.industry && (
                            <Badge variant="outline" className="mt-1 text-xs">
                              {company.industry}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {company.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {company.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        <span>{company._count.vacancies} вакансий</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        <span>{company._count.reviews} отзывов</span>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Link href={`/companies/${company.id}`} className="flex-1">
                        <Button variant="outline" className="w-full" size="sm">
                          Подробнее
                        </Button>
                      </Link>
                      {company.website && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={company.website} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
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
