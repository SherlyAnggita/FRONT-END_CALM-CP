import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function CalendarEventVisual({ fullCalendarEvents, eventsLoading }) {
  return (
    <div className="w-full max-w-full rounded-lg p-2 shadow-md bg-white dark:bg-slate-800">
      <style>
        {`
          /* ===== General Calendar Layout ===== */
          .calendar-clean,
          .calendar-clean .fc,
          .calendar-clean .fc-view-harness,
          .calendar-clean .fc-view,
          .calendar-clean .fc-scrollgrid {
            width: 100% !important;
            max-width: 100% !important;
            min-width: 0 !important;
            overflow: visible !important;
            box-sizing: border-box !important;
            font-family: inherit !important;
            background: transparent !important; /* remove white frame */
          }

          /* ===== Header Layout ===== */
          .calendar-clean .fc-header-toolbar {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            gap: 0.5rem !important;
            padding-bottom: 0.5rem !important; /* jarak header ke kalender */
          }

          .calendar-clean .fc-toolbar-chunk:first-child {
            display: flex !important;
            align-items: center !important;
            gap: 0.25rem !important; /* title + prev/next */
          }

          .calendar-clean .fc-toolbar-chunk:last-child {
            display: none !important; /* Day/Week/Month buttons */
            gap: 0.25rem !important;
          }

          .calendar-clean .fc-toolbar-title {
            font-size: 1rem !important; 
            font-weight: 700 !important;
            color: #111827 !important;
            white-space: nowrap !important;
          }

          .calendar-clean .fc-button-group {
            border-radius: 6px !important;
            overflow: hidden !important;
            background: #1f2937 !important;
            flex-shrink: 0 !important;
          }

          .calendar-clean .fc-button {
            border: none !important;
            background: transparent !important;
            color: white !important;
            padding: 0.25rem 0.5rem !important;
            font-size: 0.65rem !important;
            font-weight: 600 !important;
            text-transform: capitalize !important;
          }

          /* ===== Calendar grid compact ===== */
          .calendar-clean .fc-daygrid-day-frame {
            min-height: 60px !important;
          }

          .calendar-clean .fc-event {
            font-size: 0.85rem !important;
            margin-bottom: 1px !important;
          }

          /* ===== Responsive adjustments ===== */
          @media (min-width: 640px) {
            .calendar-clean .fc-toolbar-title {
              font-size: 1.15rem !important;
            }
            .calendar-clean .fc-button {
              font-size: 0.85rem !important;
              padding: 0.3rem 0.5rem !important;
                font-weight: 600 !important;
            }
          }

          /* ===== Dark Mode ===== */
          @media (prefers-color-scheme: dark) {
            .calendar-clean .fc {
              background: #1f2937 !important;
            }
            .calendar-clean .fc-toolbar-title,
            .calendar-clean .fc-col-header-cell-cushion,
            .calendar-clean .fc-daygrid-day-number,
            .calendar-clean .fc-event-main {
              color: #f9fafb !important;
            }
            .calendar-clean .fc-col-header-cell {
              background: #111827 !important;
            }
            .calendar-clean .fc-daygrid-day {
              background: #1f2937 !important;
            }
            .calendar-clean .fc-day-today {
              background: #334155 !important;
            }
            .calendar-clean .fc-theme-standard td,
            .calendar-clean .fc-theme-standard th {
              border-color: #374151 !important;
            }
            .calendar-clean .fc-popover {
              background: #1f2937 !important; 
              color: #f9fafb !important;      
              border: 1px solid #f1f1f1 !important; 
            }
              .calendar-clean .fc-popover .fc-event-main {
              color: #f9fafb !important;      
            }
            .calendar-clean .fc-popover .fc-event-dot {
              border-color: #2563eb !important; 
            }
            .calendar-clean .fc-popover-header {
              background: #111827 !important;  
              color: #f9fafb !important;       
  
          }
          .calendar-clean .fc-event {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
          }
        `}
      </style>

      <div className="calendar-clean w-full min-w-0 max-w-full">
        {eventsLoading ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Loading calendar events...
          </p>
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={fullCalendarEvents}
            height="auto"
            contentHeight="auto"
            aspectRatio={0.68}
            nowIndicator={true}
            allDaySlot={true}
            dayMaxEvents={2}
            slotMinTime="06:00:00"
            slotMaxTime="24:00:00"
            headerToolbar={{
              left: "title prev,next",
              center: "",
              right: "timeGridDay,timeGridWeek,dayGridMonth",
            }}
            buttonText={{
              day: "Day",
              week: "Week",
              month: "Month",
            }}
          />
        )}
      </div>
    </div>
  );
}