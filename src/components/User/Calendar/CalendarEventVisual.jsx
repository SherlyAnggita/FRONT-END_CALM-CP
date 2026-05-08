import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function CalendarEventVisual({
  fullCalendarEvents,
  eventsLoading,
}) {
  return (
    <div className="rounded-[28px] bg-base-100 p-5 shadow-md">
      <style>
        {`
          :global(.calendar-clean .fc) {
            font-family: inherit;
          }

          .calendar-clean .fc-toolbar {
            margin-bottom: 1.5rem !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            gap: 1rem !important;
            }

            .calendar-clean .fc-toolbar-chunk:first-child {
            display: flex !important;
            align-items: center !important;
            gap: 0.75rem !important;
            }

            .calendar-clean .fc-toolbar-chunk:first-child .fc-button-group {
            margin-left: 0.25rem !important;
            }

            .calendar-clean .fc-toolbar-title {
            margin: 0 !important;
            line-height: 1 !important;
            }

            .calendar-clean .fc-prev-button,
            .calendar-clean .fc-next-button {
            height: 42px !important;
            width: 42px !important;
            padding: 0 !important;
            }

          :global(.calendar-clean .fc-toolbar-title) {
            font-size: 1.1rem !important;
            font-weight: 700 !important;
            color: #111827 !important;
          }

          :global(.calendar-clean .fc-button-group) {
            background: #f3f4f6 !important;
            border-radius: 14px !important;
            padding: 4px !important;
            gap: 4px !important;
          }

          :global(.calendar-clean .fc-button) {
            border: none !important;
            background: transparent !important;
            color: #64748b !important;
            box-shadow: none !important;
            border-radius: 10px !important;
            padding: 0.55rem 1rem !important;
            font-size: 0.8rem !important;
            font-weight: 700 !important;
            text-transform: capitalize !important;
          }

          :global(.calendar-clean .fc-button:hover) {
            background: #e5e7eb !important;
            color: #0a4174 !important;
          }

          :global(.calendar-clean .fc-button-active) {
            background: #0a4174 !important;
            color: #ffffff !important;
          }

          :global(.calendar-clean .fc-theme-standard td),
          :global(.calendar-clean .fc-theme-standard th) {
            border-color: #e5e7eb !important;
          }

          :global(.calendar-clean .fc-scrollgrid),
          :global(.calendar-clean .fc-daygrid),
          :global(.calendar-clean .fc-daygrid-body),
          :global(.calendar-clean .fc-daygrid-day),
          :global(.calendar-clean .fc-timegrid-slots),
          :global(.calendar-clean .fc-timegrid-cols) {
            background: #ffffff !important;
          }

          :global(.calendar-clean .fc-col-header-cell) {
            background: #f8fafc !important;
            padding: 0.7rem 0 !important;
          }

          :global(.calendar-clean .fc-col-header-cell-cushion),
          :global(.calendar-clean .fc-daygrid-day-number),
          :global(.calendar-clean .fc-timegrid-axis-cushion),
          :global(.calendar-clean .fc-timegrid-slot-label-cushion) {
            color: #64748b !important;
            text-decoration: none !important;
            font-weight: 600 !important;
          }

          :global(.calendar-clean .fc-day-today) {
            background: #f8f7ff !important;
          }

          :global(.calendar-clean .fc-event) {
            border: none !important;
            border-radius: 999px !important;
            background: #ede9fe !important;
            padding: 4px 8px !important;
            font-size: 0.72rem !important;
            font-weight: 600 !important;
          }

          :global(.calendar-clean .fc-event-title),
          :global(.calendar-clean .fc-event-time),
          :global(.calendar-clean .fc-event-main) {
            color: #0a4174 !important;
          }

          :global([data-theme="dark"] .calendar-event-card) {
            background: #1f2937 !important;
          }

          :global([data-theme="dark"] .calendar-clean .fc-toolbar-title) {
            color: #ffffff !important;
          }

          :global([data-theme="dark"] .calendar-clean .fc-button-group) {
            background: #374151 !important;
          }

          :global([data-theme="dark"] .calendar-clean .fc-button) {
            color: #e5e7eb !important;
          }

          :global([data-theme="dark"] .calendar-clean .fc-button:hover) {
            background: #4b5563 !important;
            color: #ffffff !important;
          }

          :global([data-theme="dark"] .calendar-clean .fc-button-active) {
            background: #3b82f6 !important;
            color: #ffffff !important;
          }

          :global([data-theme="dark"] .calendar-clean .fc-theme-standard td),
          :global([data-theme="dark"] .calendar-clean .fc-theme-standard th) {
            border-color: #4b5563 !important;
          }

          :global([data-theme="dark"] .calendar-clean .fc-scrollgrid),
          :global([data-theme="dark"] .calendar-clean .fc-daygrid),
          :global([data-theme="dark"] .calendar-clean .fc-daygrid-body),
          :global([data-theme="dark"] .calendar-clean .fc-daygrid-day),
          :global([data-theme="dark"] .calendar-clean .fc-timegrid-slots),
          :global([data-theme="dark"] .calendar-clean .fc-timegrid-cols) {
            background: #374151 !important;
          }

          :global([data-theme="dark"] .calendar-clean .fc-col-header-cell) {
            background: #4b5563 !important;
          }

          :global([data-theme="dark"] .calendar-clean .fc-col-header-cell-cushion),
          :global([data-theme="dark"] .calendar-clean .fc-daygrid-day-number),
          :global([data-theme="dark"] .calendar-clean .fc-timegrid-axis-cushion),
          :global([data-theme="dark"] .calendar-clean .fc-timegrid-slot-label-cushion) {
            color: #f9fafb !important;
          }

          :global([data-theme="dark"] .calendar-clean .fc-day-today) {
            background: #475569 !important;
          }

          :global([data-theme="dark"] .calendar-clean .fc-event) {
            background: #dbeafe !important;
          }

          :global([data-theme="dark"] .calendar-clean .fc-event-title),
          :global([data-theme="dark"] .calendar-clean .fc-event-time),
          :global([data-theme="dark"] .calendar-clean .fc-event-main) {
            color: #0f172a !important;
          }
        `}
      </style>

      <div className="calendar-event-card rounded-[28px] bg-white p-0 dark:bg-slate-700">
        <div className="calendar-clean">
          {eventsLoading ? (
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Loading calendar events...
            </p>
          ) : (
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={fullCalendarEvents}
              height="780px"
              nowIndicator={true}
              allDaySlot={true}
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
    </div>
  );
}