"use client";

import * as React from "react";
import { SiteHeader } from "@/components/navigation/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Building2, Check } from "lucide-react";

type Event = {
  id: string;
  title: string;
  description: string | null;
  date: string;
  location: string | null;
  type: string;
  status: string;
  company: {
    id: string;
    name: string;
    logo: string | null;
  } | null;
};

const eventTypeLabels: Record<string, string> = {
  CAREER_FAIR: "Ярмарка вакансий",
  WEBINAR: "Вебинар",
  WORKSHOP: "Мастер-класс",
  MEETUP: "Митап",
  INTERNSHIP: "Стажировка",
};

const eventStatusLabels: Record<string, string> = {
  UPCOMING: "Предстоящее",
  ONGOING: "Идёт сейчас",
  COMPLETED: "Завершено",
  CANCELLED: "Отменено",
};

const eventStatusColors: Record<string, string> = {
  UPCOMING: "default",
  ONGOING: "default",
  COMPLETED: "secondary",
  CANCELLED: "destructive",
};

export default function EventsPage() {
  const [events, setEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState<string>("UPCOMING");
  const [registrations, setRegistrations] = React.useState<Set<string>>(new Set());
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
    async function fetchRegistrations() {
      try {
        const res = await fetch(`/api/event-registrations?userId=${userId}`);
        if (res.ok) {
          const data = await res.json();
          const eventIds = new Set(data.map((r: any) => r.eventId) as string[]);
          setRegistrations(eventIds);
        }
      } catch (error) {
        console.error("Error fetching registrations:", error);
      }
    }
    fetchRegistrations();
  }, [userId]);

  React.useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch(`/api/events?status=${filter}`);
        if (res.ok) {
          const data = await res.json();
          setEvents(data);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, [filter]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  async function handleRegistration(eventId: string) {
    try {
      if (registrations.has(eventId)) {
        await fetch(`/api/event-registrations?userId=${userId}&eventId=${eventId}`, {
          method: "DELETE",
        });
        setRegistrations(new Set([...registrations].filter((id) => id !== eventId)));
      } else {
        await fetch("/api/event-registrations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, eventId }),
        });
        setRegistrations(new Set([...registrations, eventId]));
      }
    } catch (error) {
      console.error("Error handling registration:", error);
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1400px] px-6 py-8">
        <div className="grid gap-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Мероприятия</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Карьерные мероприятия, вебинары и мастер-классы в кампусе
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filter === "UPCOMING" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("UPCOMING")}
              >
                Предстоящие
              </Button>
              <Button
                variant={filter === "COMPLETED" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("COMPLETED")}
              >
                Завершённые
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Загрузка...</div>
          ) : events.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CalendarDays className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Мероприятий не найдено</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <Card key={event.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Badge variant={eventStatusColors[event.status] as any}>
                        {eventStatusLabels[event.status]}
                      </Badge>
                      <Badge variant="outline">{eventTypeLabels[event.type]}</Badge>
                    </div>
                    <CardTitle className="text-lg mt-2">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {event.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {event.description}
                      </p>
                    )}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarDays className="h-4 w-4" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      {event.company && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Building2 className="h-4 w-4" />
                          <span>{event.company.name}</span>
                        </div>
                      )}
                    </div>
                    {event.status === "UPCOMING" && (
                      <Button
                        size="sm"
                        className="w-full"
                        variant={registrations.has(event.id) ? "default" : "outline"}
                        onClick={() => handleRegistration(event.id)}
                      >
                        {registrations.has(event.id) ? (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Зарегистрирован
                          </>
                        ) : (
                          "Зарегистрироваться"
                        )}
                      </Button>
                    )}
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
