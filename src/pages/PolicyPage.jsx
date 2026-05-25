import { useNavigate } from "react-router-dom";

const sections = [
  {
    title: "Information We Collect",
    body: "We may collect and store the following information:",
    items: [
      "Account information, such as name, email, username, phone number, and profile photo.",
      "Google Sign-In information, including Google email and Google account identifier.",
      "Google Calendar data, such as event title, description, location, start time, end time, event type, and attendee count.",
      "Mood Jar entries, including mood labels, mood score, feeling text, and AI-generated encouragement messages.",
      "Social Battery analysis results, including total events, duration, battery score, social intensity score, AI insights, and recovery suggestions.",
      "Notification data, including in-app, email, and WhatsApp notification status.",
      "Activity logs, such as user actions, IP address, user agent, and timestamps.",
    ],
  },
  {
    title: "How We Use Your Information",
    body: "We use your information to:",
    items: [
      "Allow users to sign in and access MyCalmSpace.",
      "Connect and read Google Calendar events with user permission.",
      "Analyze social activity and generate Social Battery results.",
      "Provide mood-based support through Mood Jar.",
      "Send reminders and notifications through the app, email, or WhatsApp.",
      "Help administrators monitor application activity and maintain the system.",
    ],
  },
];

export default function PrivacyPolicy() {
   const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-base-200 px-4 py-6 text-base-content sm:px-6 sm:py-10 lg:px-8">
      <section className="mx-auto w-full max-w-5xl">
        <div className="mb-4 sm:mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-ghost btn-sm"
          >
            ← Kembali
          </button>
        </div>

        <div className="card overflow-hidden border border-base-300 bg-base-100 shadow-xl">
          <div className="bg-primary px-5 py-8 text-primary-content sm:px-8 sm:py-10 lg:px-10">
            <div className="badge badge-secondary mb-4">MyCalmSpace</div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              Privacy Policy
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 opacity-90 sm:text-base">
              MyCalmSpace is a mental wellness application that helps students
              understand their social energy through calendar-based social
              battery analysis, mood journaling, reminders, and supportive
              notifications.
            </p>

            <p className="mt-5 text-sm opacity-80">
              Last updated: <span className="font-semibold">May 14, 2026</span>
            </p>
          </div>

          <div className="space-y-5 p-5 sm:p-8 lg:p-10">
            {sections.map((section) => (
              <section
                key={section.title}
                className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6"
              >
                <h2 className="text-xl font-bold text-primary">
                  {section.title}
                </h2>

                <p className="mt-3 text-sm leading-7 opacity-80">
                  {section.body}
                </p>

                <ul className="mt-4 space-y-3">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-7">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      <span className="opacity-85">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            <section className="grid gap-5 md:grid-cols-2">
              <InfoCard title="Google Calendar Data">
                MyCalmSpace only requests read-only access to Google Calendar.
                We use this access to read calendar events and calculate the
                user&apos;s Social Battery. We do not create, edit, or delete
                Google Calendar events.
              </InfoCard>

              <InfoCard title="AI Features">
                MyCalmSpace may use AI features to generate mood encouragement
                messages, social battery insights, score explanations, and
                recovery suggestions.
              </InfoCard>

              <InfoCard title="Data Sharing">
                We do not sell, rent, or share users&apos; personal data with
                third parties. User data is used only to provide and improve
                MyCalmSpace features.
              </InfoCard>

              <InfoCard title="Data Security">
                We take reasonable technical and organizational measures to
                protect user data from unauthorized access, loss, misuse, or
                disclosure.
              </InfoCard>
            </section>

            <section className="rounded-2xl border border-info/20 bg-info/10 p-5 sm:p-6">
              <h2 className="text-xl font-bold text-primary">
                Data Retention and Deletion
              </h2>

              <p className="mt-3 text-sm leading-7 opacity-85">
                Users can disconnect their Google Calendar account from
                MyCalmSpace at any time. When disconnected, MyCalmSpace will no
                longer access the connected Google Calendar account.
              </p>

              <p className="mt-3 text-sm leading-7 opacity-85">
                Users may also request account or data deletion by contacting us
                at{" "}
                <a
                  href="mailto:mycalmspace.official@gmail.com"
                  className="font-semibold text-primary hover:underline"
                >
                  mycalmspace.official@gmail.com
                </a>
                .
              </p>
            </section>

            <section className="rounded-2xl bg-primary p-5 text-primary-content sm:p-6">
              <h2 className="text-xl font-bold">Contact Us</h2>

              <p className="mt-3 text-sm leading-7 opacity-85">
                If you have questions about this Privacy Policy, contact us at:
              </p>

              <a
                href="mailto:mycalmspace.official@gmail.com"
                className="mt-2 inline-block break-all font-semibold hover:underline"
              >
                mycalmspace.official@gmail.com
              </a>

              <p className="mt-6 text-xs opacity-70">
                Developed by MyCalmSpace Team.
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-bold text-primary">{title}</h2>
      <p className="mt-3 text-sm leading-7 opacity-85">{children}</p>
    </div>
  );
}
