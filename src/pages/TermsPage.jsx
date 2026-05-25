import { useNavigate } from "react-router-dom";

const terms = [
  {
    title: "Use of the Service",
    text: "MyCalmSpace is designed to help users understand their social energy, manage mood entries, receive reminders, and access mental wellness support features.",
  },
  {
    title: "User Account",
    text: "Users may sign in using Google or other supported authentication methods. Users are responsible for keeping their account secure.",
  },
  {
    title: "Google Calendar Integration",
    text: "MyCalmSpace may request read-only access to your Google Calendar. This access is used only to analyze schedule density and generate Social Battery results. MyCalmSpace does not create, edit, or delete calendar events.",
  },
  {
    title: "Mental Wellness Disclaimer",
    text: "MyCalmSpace is not a medical service, therapy provider, or crisis support service. The information, reminders, AI-generated messages, and social battery results are intended for personal wellness support only.",
  },
  {
    title: "Notifications",
    text: "MyCalmSpace may send notifications through in-app messages, email, or WhatsApp based on user activity and preferences.",
  },
  {
    title: "Prohibited Use",
    text: "Users may not misuse the application, attempt unauthorized access, disrupt the service, or use MyCalmSpace for unlawful activities.",
  },
  {
    title: "Limitation of Liability",
    text: "MyCalmSpace is provided as-is. We are not responsible for decisions made based on the application's results, reminders, or AI-generated content.",
  },
  {
    title: "Changes to These Terms",
    text: "We may update these Terms from time to time. Updates will be posted on this page with a revised date.",
  },
];

export default function Terms() {
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
              Terms of Service
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 opacity-90 sm:text-base">
              Welcome to MyCalmSpace. By using our application, you agree to
              these Terms of Service.
            </p>

            <p className="mt-5 text-sm opacity-80">
              Last updated: <span className="font-semibold">May 14, 2026</span>
            </p>
          </div>

          <div className="p-5 sm:p-8 lg:p-10">
            <div className="grid gap-5 md:grid-cols-2">
              {terms.map((item, index) => (
                <section
                  key={item.title}
                  className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-content">
                    {index + 1}
                  </div>

                  <h2 className="text-lg font-bold text-primary">
                    {item.title}
                  </h2>

                  <p className="mt-3 text-sm leading-7 opacity-85">
                    {item.text}
                  </p>
                </section>
              ))}
            </div>

            <section className="mt-6 rounded-2xl bg-primary p-5 text-primary-content sm:p-6">
              <h2 className="text-xl font-bold">Contact Us</h2>

              <p className="mt-3 text-sm leading-7 opacity-85">
                If you have questions about these Terms, contact us at:
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
