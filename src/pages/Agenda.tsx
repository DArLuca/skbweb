import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const MONTHS = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember"
];

const getFirstThursday = (year: number, month: number) => {
  const date = new Date(year, month, 1);
  // getDay() returns 0 for Sunday, 1 for Monday, ..., 4 for Thursday
  // We want to find the first Thursday (4)
  while (date.getDay() !== 4) {
    date.setDate(date.getDate() + 1);
  }
  return date.getDate();
};

const Agenda = () => {
  const [viewDate, setViewDate] = useState(new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  // Adjust for Monday start (0=Sun, 1=Mon... -> 0=Mon, 6=Sun)
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstThursday = getFirstThursday(year, month);

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));
  const goToToday = () => setViewDate(new Date());

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const calendarDays = [
    ...Array(startOffset).fill(null),
    ...days
  ];

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-primary" />
            Agenda
          </h1>
          <p className="text-muted-foreground mt-1">
            Turniere und Veranstaltungen des SKB
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Heute
          </Button>
          <div className="flex items-center gap-1 ml-2">
            <Button variant="ghost" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold min-w-[140px] text-center">
              {MONTHS[month]} {year}
            </h2>
            <Button variant="ghost" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        {/* Calendar Header */}
        <div className="grid grid-cols-7 border-b bg-muted/50">
          {DAYS.map((day) => (
            <div key={day} className="py-3 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 auto-rows-[120px]">
          {calendarDays.map((day, index) => {
            const isToday = day === new Date().getDate() && 
                           month === new Date().getMonth() && 
                           year === new Date().getFullYear();
            
            const isMonatsBlitz = day === firstThursday;

            return (
              <div 
                key={index} 
                className={cn(
                  "border-r border-b p-2 transition-colors hover:bg-muted/30",
                  index % 7 === 6 && "border-r-0"
                )}
              >
                {day && (
                  <div className="flex flex-col h-full">
                    <span className={cn(
                      "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mb-1",
                      isToday ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                    )}>
                      {day}
                    </span>
                    
                    {isMonatsBlitz && (
                      <div className="mt-1">
                        <div className="bg-primary/10 text-primary text-[10px] md:text-xs p-1 rounded border border-primary/20 font-medium truncate">
                          ⚡ Monats Blitz
                        </div>
                        <div className="text-[10px] text-muted-foreground ml-1 hidden md:block">
                          19:30 Uhr
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          
          {/* Fill the remaining cells if needed */}
          {Array.from({ length: (7 - (calendarDays.length % 7)) % 7 }).map((_, i) => (
            <div 
              key={`empty-${i}`} 
              className={cn(
                "border-b p-2 bg-muted/10",
                (calendarDays.length + i) % 7 === 6 ? "" : "border-r"
              )} 
            />
          ))}
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="p-6 border rounded-xl bg-card">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-6 bg-primary rounded-full" />
            Regelmässige Termine
          </h3>
          <ul className="space-y-4">
            <li className="flex justify-between items-start border-b pb-2">
              <div>
                <p className="font-semibold">Monats Blitz</p>
                <p className="text-sm text-muted-foreground">Jeden 1. Donnerstag im Monat</p>
              </div>
              <span className="text-sm font-medium text-primary">19:30 Uhr</span>
            </li>
            <li className="flex justify-between items-start border-b pb-2">
              <div>
                <p className="font-semibold">Clubabend</p>
                <p className="text-sm text-muted-foreground">Jeden Donnerstag (ausser Feiertage)</p>
              </div>
              <span className="text-sm font-medium text-primary">19:00 Uhr</span>
            </li>
          </ul>
        </div>

        <div className="p-6 border rounded-xl bg-card">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-6 bg-primary rounded-full" />
            Spezielle Hinweise
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Gäste sind jederzeit herzlich willkommen! Bei grösseren Turnieren bitten wir um eine Voranmeldung via E-Mail oder über die entsprechende Turnierseite unter "Meisterschaft".
          </p>
          <Button variant="link" className="px-0 mt-4 h-auto text-primary">
            Mehr über den Verein erfahren →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Agenda;
