import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function CalendarEventVisual({
  fullCalendarEvents,
  eventsLoading,
}) {
  return (
  <div className="mt-3 w-full min-w-0 max-w-full rounded-lg bg-white p-1 shadow-md dark:bg-slate-800 sm:p-2">
      <style>
        {`
          .calendar-clean,
          .calendar-clean *,
          .calendar-clean .fc,
          .calendar-clean .fc-view-harness,
          .calendar-clean .fc-view,
          .calendar-clean .fc-scrollgrid,
          .calendar-clean table {
            max-width: 100% !important;
            min-width: 0 !important;
            box-sizing: border-box !important;
          }

          .calendar-clean {
            width: 100% !important;
            overflow: visible !important;
            font-family: inherit !important;
          }

          .calendar-clean .fc {
            width: 100% !important;
            overflow: visible !important;
            background: transparent !important;
          }

          .calendar-clean .fc-scrollgrid {
            width: 100% !important;
            table-layout: fixed !important;
            border-collapse: collapse !important;
            background: transparent !important;
          }

          .calendar-clean .fc-col-header,
          .calendar-clean .fc-daygrid-body,
          .calendar-clean .fc-scrollgrid-sync-table {
            width: 100% !important;
            min-width: 0 !important;
            table-layout: fixed !important;
          }

          .calendar-clean .fc-header-toolbar {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            gap: 3rem !important;
            margin-bottom: 1.5rem !important;

              padding-top: 0.8rem !important;
              padding-left: 0.5rem !important;
              padding-right: 0.5rem !important;

              margin-bottom: 1.5rem !important;
          }

          .calendar-clean .fc-toolbar-chunk {
            min-width: 0 !important;
          }

          .calendar-clean .fc-toolbar-chunk:first-child {
            display: flex !important;
            align-items: center !important;
            gap: 0.2rem !important;
            min-width: 0 !important;
          }

          .calendar-clean .fc-toolbar-chunk:last-child {
            display: flex !important;
          }

          .calendar-clean .fc-toolbar-title {
            max-width: none!important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            white-space: nowrap !important;
            font-size: 0.95rem !important;
            font-weight: 800 !important;
            color: #111827 !important;
          }

          .calendar-clean .fc-button-group {
            flex-shrink: 0 !important;
            border-radius: 8px !important;
            overflow: hidden !important;
            background: #1f2937 !important;
          }

          .calendar-clean .fc-button {
            min-width: 24px !important;
            padding: 0.2rem 0.35rem !important;
            border: none !important;
            background: transparent !important;
            color: white !important;
            font-size: 0.65rem !important;
            font-weight: 700 !important;
          }

          /* HOVER */
          .calendar-clean .fc-button:hover {
            background: rgba(255,255,255,0.15) !important;
            transition: all 0.2s ease !important;
          }

          /* ACTIVE BUTTON */
          .calendar-clean .fc-button-active {
            background: #49769f !important;
            color: #e1e5eb !important;
            border-radius: 6px !important;
          }

          /* CLICK EFFECT */
          .calendar-clean .fc-button:active {
            transform: scale(0.96);
          }

          .calendar-clean .fc-col-header-cell-cushion {
            display: block !important;
            width: 100% !important;
            overflow: hidden !important;
            text-overflow: clip !important;
            white-space: nowrap !important;
            font-size: 0.72rem !important;
            font-weight: 800 !important;
            padding: 4px 1px !important;
          }

          .calendar-clean .fc-daygrid-day-number {
            font-size: 0.72rem !important;
            padding: 3px !important;
          }

          .calendar-clean .fc-daygrid-day-frame {
            min-height: 56px !important;
            overflow: hidden !important;
          }

          .calendar-clean .fc-daygrid-day-events {
            margin: 0 1px !important;
            overflow: hidden !important;
          }

          .calendar-clean .fc-event {
            max-width: 100% !important;
            overflow: hidden !important;
            border: none !important;
            background: transparent !important;
            box-shadow: none !important;
            font-size: 0.62rem !important;
            line-height: 1.1 !important;
            margin-bottom: 1px !important;
          }

          .calendar-clean .fc-event-title,
          .calendar-clean .fc-event-time {
            overflow: hidden !important;
            text-overflow: clip !important;
            white-space: nowrap !important;
          }

          .calendar-clean .fc-daygrid-more-link {
            font-size: 0.62rem !important;
            line-height: 1.1 !important;
          }

          @media (max-width: 420px) {
            .calendar-clean .fc-header-toolbar {
              gap: 0.4rem !important;
            }

            .calendar-clean .fc-toolbar-title {
              max-width: none !important;
              font-size: 0.85rem !important;
            }

            .calendar-clean .fc-button {
              min-width: 18px !important;
              padding: 0.15rem 0.22rem !important;
              font-size: 0.6rem !important;
            }

            .calendar-clean .fc-col-header-cell-cushion {
              font-size: 0.62rem !important;
              padding: 3px 0 !important;
            }

            .calendar-clean .fc-daygrid-day-frame {
              min-height: 50px !important;
            }

            .calendar-clean .fc-event {
              font-size: 0.55rem !important;
            }

            .calendar-clean .fc-daygrid-more-link {
              font-size: 0.55rem !important;
            }
          }

          @media (min-width: 640px) {
            .calendar-clean .fc-toolbar-title {
              max-width: none !important;
              font-size: 1.15rem !important;
            }

            .calendar-clean .fc-button {
              font-size: 0.85rem !important;
              padding: 0.3rem 0.5rem !important;
            }

            .calendar-clean .fc-col-header-cell-cushion {
              font-size: 0.9rem !important;
              padding: 6px 2px !important;
            }

            .calendar-clean .fc-daygrid-day-frame {
              min-height: 80px !important;
            }

            .calendar-clean .fc-event {
              font-size: 0.85rem !important;
            }
          }

          html,
          body,
          #root {
            overflow-x: hidden !important;
          }

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
              border: 1px solid #374151 !important;
            }

            .calendar-clean .fc-popover-header {
              background: #111827 !important;
              color: #f9fafb !important;
            }
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
            aspectRatio={0.8}
            nowIndicator={true}
            allDaySlot={true}
            dayMaxEvents={2}
            slotMinTime="06:00:00"
            slotMaxTime="24:00:00"
            headerToolbar={{
              left: "title prev,next",
              center: "",
              right: "dayGridMonth,timeGridWeek,dayGridDay",
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