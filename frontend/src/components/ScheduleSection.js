import React from 'react';
import { GOOGLE_CALENDAR_ID, CALENDAR_TIMEZONE, EVENT } from '../config/social';

const addToCalendarUrl =
  'https://calendar.google.com/calendar/render?action=TEMPLATE' +
  `&text=${encodeURIComponent(EVENT.title)}` +
  `&dates=${EVENT.start}/${EVENT.end}` +
  `&details=${encodeURIComponent(EVENT.details)}` +
  `&location=${encodeURIComponent(EVENT.location)}` +
  `&ctz=${encodeURIComponent(CALENDAR_TIMEZONE)}`;

const embedUrl =
  'https://calendar.google.com/calendar/embed' +
  `?src=${encodeURIComponent(GOOGLE_CALENDAR_ID)}` +
  `&ctz=${encodeURIComponent(CALENDAR_TIMEZONE)}` +
  '&mode=AGENDA&showTitle=0&showPrint=0&showCalendars=0&showTz=0&dates=20260401/20260531';

const subscribeUrl = `https://calendar.google.com/calendar/u/0/r?cid=${encodeURIComponent(GOOGLE_CALENDAR_ID)}`;

const DETAILS = [
  { icon: '📍', label: 'Location', value: EVENT.location },
  { icon: '📅', label: 'Date', value: EVENT.dateLabel },
  { icon: '🕒', label: 'Time', value: EVENT.timeLabel },
  { icon: '🎁', label: 'Admission', value: 'Free — prizes, fun & community spirit' },
];

export default function ScheduleSection({ onClick }) {
  return (
    <section
      id="schedule"
      aria-labelledby="schedule-heading"
      className="relative z-20 py-16 px-4 bg-gradient-to-br from-green-600 via-blue-600 to-purple-700 text-white overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 reveal">
          <p className="text-sm uppercase tracking-widest text-yellow-300 font-bold mb-2">
            Event Schedule
          </p>
          <h2 id="schedule-heading" className="text-3xl md:text-5xl font-black text-balance mb-3">
            Join Us & Volunteer at the Event
          </h2>
          <p className="text-base md:text-lg text-white/85 max-w-2xl mx-auto text-pretty">
            Synced live with Google Calendar — save the date and let us know you want to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-2 flex flex-col gap-6 reveal reveal-left">
            <div className="depth-card glass-card rounded-3xl p-6">
              <ul className="flex flex-col gap-4">
                {DETAILS.map((item) => (
                  <li key={item.label} className="flex items-start gap-4">
                    <span
                      className="w-11 h-11 shrink-0 rounded-xl bg-white/20 flex items-center justify-center text-xl shadow-inner"
                      aria-hidden="true"
                    >
                      {item.icon}
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-white/70 font-bold">
                        {item.label}
                      </p>
                      <p className="font-bold text-lg leading-snug">{item.value}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <a
                href={addToCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClick}
                className="btn-3d btn-3d-gold text-lg py-4 px-6 justify-center"
              >
                <span aria-hidden="true">📆</span> Add to Google Calendar & Volunteer
              </a>
              <a
                href={subscribeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClick}
                className="btn-3d btn-3d-light text-base py-3 px-6 justify-center"
              >
                <span aria-hidden="true">🔔</span> Subscribe to All Events
              </a>
              <p className="text-sm text-white/80 text-center text-pretty">
                {"Adding the event tells us you're interested in volunteering — we'll reach out with details."}
              </p>
            </div>
          </div>

          <div className="lg:col-span-3 depth-card bg-white rounded-3xl p-3 reveal reveal-right">
            <iframe
              title="J.R. The Realtor event schedule — Google Calendar"
              src={embedUrl}
              className="w-full rounded-2xl"
              height="520"
              style={{ border: 0 }}
              frameBorder="0"
              scrolling="no"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
