import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function CalendarEventVisual({
  fullCalendarEvents,
  eventsLoading,
}) {
  return (
    <div className="w-full max-w-full min-w-0 overflow-hidden rounded-[24px] bg-white p-3 shadow-md dark:bg-slate-800 sm:p-5">
      <style>
        {`
          .calendar-clean,
          .calendar-clean .fc,
          .calendar-clean .fc-view-harness,
          .calendar-clean .fc-view,
          .calendar-clean .fc-scrollgrid {
            width: 100% !important;
            max-width: 100% !important;
            min-width: 0 !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
          }

          .calendar-clean .fc {
            font-family: inherit;
          }

          .calendar-clean .fc-header-toolbar {
            margin-bottom: 0.75rem !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            gap: 0.5rem !important;
          }

          .calendar-clean .fc-toolbar-chunk {
            min-width: 0 !important;
            display: flex !important;
            align-items: center !important;
            gap: 0.35rem !important;
          }

          .calendar-clean .fc-toolbar-chunk:first-child {
            flex: 1 !important;
            flex-wrap: wrap !important;
          }

          .calendar-clean .fc-toolbar-chunk:last-child {
            display: none !important;
          }

          .calendar-clean .fc-toolbar-title {
            width: 100% !important;
            min-width: 0 !important;
            font-size: 1.35rem !important;
            line-height: 1.05 !important;
            font-weight: 800 !important;
            color: #111827 !important;
            white-space: normal !important;
          }

          .calendar-clean .fc-button-group {
            border-radius: 8px !important;
            overflow: hidden !important;
            background: #1f2937 !important;
            flex-shrink: 0 !important;
          }

          .calendar-clean .fc-button {
            border: none !important;
            background: transparent !important;
            color: white !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            padding: 0.38rem 0.52rem !important;
            font-size: 0.68rem !important;
            font-weight: 700 !important;
            text-transform: capitalize !important;
          }

          .calendar-clean .fc-prev-button,
          .calendar-clean .fc-next-button {
            height: 34px !important;
            width: 36px !important;
            padding: 0 !important;
          }

          .calendar-clean .fc table {
            width: 100% !important;
            table-layout: fixed !important;
          }

          .calendar-clean .fc-theme-standard td,
          .calendar-clean .fc-theme-standard th {
            border-color: #e5e7eb !important;
          }

          .calendar-clean .fc-col-header-cell {
            background: #ffffff !important;
            padding: 0.35rem 0 !important;
          }

          .calendar-clean .fc-col-header-cell-cushion,
          .calendar-clean .fc-daygrid-day-number {
            color: #111827 !important;
            text-decoration: none !important;
            font-size: 0.68rem !important;
            font-weight: 700 !important;
          }

          .calendar-clean .fc-daygrid-day-frame {
            min-height: 62px !important;
            padding: 1px !important;
          }

          .calendar-clean .fc-daygrid-day-events {
            margin-top: 1px !important;
          }

          .calendar-clean .fc-event {
            max-width: 100% !important;
            overflow: hidden !important;
            border: none !important;
            background: transparent !important;
            padding: 0 !important;
            font-size: 0.55rem !important;
            line-height: 1.05 !important;
            font-weight: 700 !important;
          }

          .calendar-clean .fc-event-main {
            max-width: 100% !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            white-space: nowrap !important;
            color: #2563eb !important;
          }

          .calendar-clean .fc-day-today {
            background: #fff8dc !important;
          }

          @media (min-width: 640px) {
            .calendar-clean .fc-toolbar-chunk:last-child {
              display: flex !important;
            }

            .calendar-clean .fc-header-toolbar {
              align-items: center !important;
            }

            .calendar-clean .fc-toolbar-title {
              width: auto !important;
              font-size: 1.5rem !important;
            }

            .calendar-clean .fc-button {
              padding: 0.5rem 0.85rem !important;
              font-size: 0.78rem !important;
            }

            .calendar-clean .fc-daygrid-day-frame {
              min-height: 95px !important;
            }

            .calendar-clean .fc-event {
              font-size: 0.7rem !important;
            }
          }

          [data-theme="dark"] .calendar-clean .fc-toolbar-title {
            color: #ffffff !important;
          }

          [data-theme="dark"] .calendar-clean .fc-scrollgrid,
          [data-theme="dark"] .calendar-clean .fc-daygrid,
          [data-theme="dark"] .calendar-clean .fc-daygrid-body,
          [data-theme="dark"] .calendar-clean .fc-daygrid-day {
            background: #1f2937 !important;
          }

          [data-theme="dark"] .calendar-clean .fc-col-header-cell {
            background: #111827 !important;
          }

          [data-theme="dark"] .calendar-clean .fc-theme-standard td,
          [data-theme="dark"] .calendar-clean .fc-theme-standard th {
            border-color: #374151 !important;
          }

          [data-theme="dark"] .calendar-clean .fc-col-header-cell-cushion,
          [data-theme="dark"] .calendar-clean .fc-daygrid-day-number {
            color: #f9fafb !important;
          }

          [data-theme="dark"] .calendar-clean .fc-day-today {
            background: #334155 !important;
          }

          .calendar-clean .fc-view-harness,
          .calendar-clean .fc-view,
          .calendar-clean .fc-scrollgrid,
          .calendar-clean .fc-scrollgrid-section,
          .calendar-clean .fc-scrollgrid-section table,
          .calendar-clean .fc-col-header,
          .calendar-clean .fc-daygrid-body,
          .calendar-clean .fc-daygrid-body table {
            width: 100% !important;
            min-width: 0 !important;
            max-width: 100% !important;
          }

          .calendar-clean .fc-scroller {
            overflow: hidden !important;
          }
        `}
      </style>

      <div className="calendar-clean w-full min-w-0 max-w-full overflow-hidden">
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