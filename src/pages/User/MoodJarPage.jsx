import { useEffect, useMemo, useState } from "react";
import {
  getActiveMoodLabels,
  getMoodEntries,
  createMoodEntry,
} from "../../services/User/moodJarService";
import {
  isSameDay,
  formatMoodDate,
  getJarFillHeight,
  getPaperPositions,
  getTimeUntilNextDay,
  // getMoodPaperStyle,
} from "../../utils/User/moodJar";
import MoodJarVisual from "../../components/User/MoodJar/MoodJarVisual";
import MoodJarForm from "../../components/User/MoodJar/MoodJarForm";
import MoodJarHistory from "../../components/User/MoodJar/MoodJarHistory";
import MoodJarModal from "../../components/User/MoodJar/MoodJarModal";
import MoodJarDetail from "../../components/User/MoodJar/MoodJarDetail";
// import cloudSmall1 from "../../assets/cloud-small1.png";
import { getCurrentUser, getUserProfile } from "../../services/authService";

export default function MoodJarPage() {
  const currentUser = getCurrentUser();

  const isOnboardingRequired =
    currentUser?.role === "user" && !currentUser?.onboardingCompleted;

  const [labels, setLabels] = useState([]);
  const [entries, setEntries] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState("");

  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const [historyEntries, setHistoryEntries] = useState([]);
  const [historyPagination, setHistoryPagination] = useState({
    page: 1,
    limit: 5,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [form, setForm] = useState({
    moodLabelId: "",
    feelingText: "",
  });

  const [completedOnboarding, setCompletedOnboarding] = useState(false);

  const paperPositions = getPaperPositions();

  async function fetchMoodJarData() {
    try {
      setLoading(true);
      setError("");

      const [labelsRes, entriesRes] = await Promise.all([
        getActiveMoodLabels(),
        getMoodEntries(1, 100),
      ]);

      setLabels(labelsRes.data || []);
      setEntries(entriesRes.data || []);
      setHistoryPagination(
        entriesRes.pagination || {
          page: 1,
          limit: 5,
          totalItems: 0,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      );
    } catch (err) {
      setError(err?.message || "Gagal mengambil data Mood Jar");
    } finally {
      setLoading(false);
    }
  }

  async function fetchHistory(page = 1) {
    try {
      setHistoryLoading(true);

      const res = await getMoodEntries(page, 5);

      setHistoryEntries(res.data || []);
      setHistoryPagination(
        res.pagination || {
          page: 1,
          limit: 5,
          totalItems: 0,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      );
    } catch (err) {
      setError(err?.message || "Gagal mengambil history mood");
    } finally {
      setHistoryLoading(false);
    }
  }

  useEffect(() => {
    fetchMoodJarData();
  }, []);

  const hasTodayEntry = useMemo(() => {
    return entries.some((item) => isSameDay(item.entryDate));
  }, [entries]);

  const todayEntry = useMemo(() => {
    return entries.find((item) => isSameDay(item.entryDate));
  }, [entries]);

  useEffect(() => {
    if (!loading && isOnboardingRequired && !hasTodayEntry) {
      const isMobile = window.matchMedia("(max-width: 1023px)").matches;

      if (isMobile) {
        setIsFormModalOpen(true);
      }
    }
  }, [loading, isOnboardingRequired, hasTodayEntry]);

  useEffect(() => {
    if (!hasTodayEntry) {
      setTimeLeft("");
      return;
    }

    setTimeLeft(getTimeUntilNextDay());

    const interval = setInterval(() => {
      setTimeLeft(getTimeUntilNextDay());
    }, 1000);

    return () => clearInterval(interval);
  }, [hasTodayEntry]);

  useEffect(() => {
    if (!successMessage) return;

    const timeout = setTimeout(() => {
      setSuccessMessage("");
    }, 3000);

    return () => clearTimeout(timeout);
  }, [successMessage]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (submitError) {
      setSubmitError("");
    }
  }

  function handleOpenDetail(entry) {
    setSelectedEntry(entry);
    setIsDetailModalOpen(true);
  }

  function handleCloseDetail() {
    setSelectedEntry(null);
    setIsDetailModalOpen(false);

    if (completedOnboarding) {
      window.location.href = "/user";
    }
  }

  async function handleOpenHistory() {
    setIsHistoryModalOpen(true);
    await fetchHistory(1);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (hasTodayEntry) {
      setSubmitError("Kamu sudah mengisi mood hari ini");
      return;
    }

    try {
      setSubmitLoading(true);
      setSubmitError("");
      setSuccessMessage("");

      const payload = {
        moodLabelId: form.moodLabelId,
        feelingText: form.feelingText,
      };

      const res = await createMoodEntry(payload);

      setSuccessMessage(res.message || "Mood berhasil disimpan");

      const createdEntry = res.data?.moodEntry || res.moodEntry;
      const encouragementResult =
        res.data?.encouragementResult || res.encouragementResult;

      if (createdEntry) {
        setSelectedEntry({
          ...createdEntry,
          encouragementResult,
          moodLabel: labels.find(
            (label) => label.id === createdEntry.moodLabelId,
          ),
        });

        setIsDetailModalOpen(true);
      }

      setForm({
        moodLabelId: "",
        feelingText: "",
      });

      await fetchMoodJarData();

      await getUserProfile();

      if (isOnboardingRequired) {
        setCompletedOnboarding(true);
      }

      if (isHistoryModalOpen) {
        await fetchHistory(1);
      }

      setIsFormModalOpen(false);
    } catch (err) {
      setSubmitError(err?.message || "Gagal menyimpan mood entry");
    } finally {
      setSubmitLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Mood Jar</h1>
        <div className="rounded-xl bg-base-100 p-6 shadow">
          <p>Loading mood jar...</p>
        </div>
      </div>
    );
  }

  return (
    // <div className="relative h-full min-h-0 overflow-hidden bg-gradient-to-b from-[#1f4d7a] via-[#5f87b3] to-[#dbe8f5] px-4 py-4 text-white">
    <>
      {/* <img
        src={cloudSmall1}
        alt=""
        className="pointer-events-none absolute -left-10 top-28 w-64 opacity-30"
      />

      <img
        src={cloudSmall1}
        alt=""
        className="pointer-events-none absolute -right-14 top-40 w-72 scale-x-[-1] opacity-25"
      />

      <img
        src={cloudSmall1}
        alt=""
        className="pointer-events-none absolute -bottom-10 left-[20%] w-96 opacity-35"
      /> */}
      <div className="relative z-10 flex h-full flex-col gap-3">
        {/* <div className="relative z-10 space-y-3"> */}
        <div>
          <h1 className="text-2xl font-bold">Mood Jar</h1>
          <p className="text-sm text-base-content/70">
            Simpan perasaanmu hari ini. Kamu hanya bisa mengisi 1 kali setiap
            hari.
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        <div className="lg:hidden">
          <button
            type="button"
            className="
              mt-2
              w-full
              rounded-2xl
              border border-[#7FA8C9]
              bg-white/10
              px-6 py-3
              text-center
              font-semibold
              text-[#D6E9F8]
              backdrop-blur-md
              shadow-md
              transition-all duration-300
            hover:border-[#A8C7E2]
            hover:bg-[#8dcbfa]
              hover:text-white
              active:scale-[0.98]
            "
            onClick={() => setIsFormModalOpen(true)}
          >
            Bagaimana Perasaanmu Hari ini?
          </button>
        </div>

        {/* <div className="grid gap-4 lg:h-[calc(100vh-280px)] lg:min-h-[500px] lg:items-stretch lg:gap-6 lg:grid-cols-[1fr_420px]"> */}
        <div className="grid flex-1 min-h-0 gap-4 lg:items-stretch lg:gap-6 lg:grid-cols-[1fr_420px]">
          <div className="flex h-full flex-col">
            <MoodJarVisual
              entries={entries}
              paperPositions={paperPositions}
              onClickEntry={handleOpenDetail}
              getJarFillHeight={getJarFillHeight}
              onOpenHistory={handleOpenHistory}
            />
          </div>

          <div className="hidden h-full lg:block">
            <MoodJarForm
              hasTodayEntry={hasTodayEntry}
              todayEntry={todayEntry}
              timeLeft={timeLeft}
              formatMoodDate={formatMoodDate}
              submitError={submitError}
              successMessage={successMessage}
              handleSubmit={handleSubmit}
              labels={labels}
              form={form}
              handleChange={handleChange}
              submitLoading={submitLoading}
            />
          </div>
        </div>
      </div>

      <MoodJarModal
        open={isFormModalOpen}
        title={
          isOnboardingRequired
            ? "Sebelum mulai, ceritakan perasaanmu hari ini"
            : "Bagaimana Perasaanmu Hari ini?"
        }
        onClose={
          isOnboardingRequired ? undefined : () => setIsFormModalOpen(false)
        }
      >
        <MoodJarForm
          hasTodayEntry={hasTodayEntry}
          todayEntry={todayEntry}
          timeLeft={timeLeft}
          formatMoodDate={formatMoodDate}
          submitError={submitError}
          successMessage={successMessage}
          handleSubmit={handleSubmit}
          labels={labels}
          form={form}
          handleChange={handleChange}
          submitLoading={submitLoading}
        />
      </MoodJarModal>

      <MoodJarModal
        open={isHistoryModalOpen}
        title="History Mood"
        onClose={() => setIsHistoryModalOpen(false)}
      >
        <MoodJarHistory
          entries={historyEntries}
          onClickEntry={handleOpenDetail}
          formatMoodDate={formatMoodDate}
          pagination={historyPagination}
          loading={historyLoading}
          onPrevPage={() => fetchHistory(historyPagination.page - 1)}
          onNextPage={() => fetchHistory(historyPagination.page + 1)}
        />
      </MoodJarModal>

      <MoodJarModal
        open={isDetailModalOpen && !!selectedEntry}
        title={
          selectedEntry
            ? `${selectedEntry.moodLabel?.emoji ? `${selectedEntry.moodLabel.emoji} ` : ""}${
                selectedEntry.moodLabel?.name || "Mood Detail"
              }`
            : "Mood Detail"
        }
        onClose={handleCloseDetail}
      >
        <MoodJarDetail entry={selectedEntry} formatMoodDate={formatMoodDate} />
      </MoodJarModal>
    </>
  );
}
