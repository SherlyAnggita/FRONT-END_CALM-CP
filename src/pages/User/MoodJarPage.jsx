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
  getMoodPaperStyle,
} from "../../utils/User/moodJar";
import MoodJarVisual from "../../components/User/MoodJar/MoodJarVisual";
import MoodJarForm from "../../components/User/MoodJar/MoodJarForm";
import MoodJarHistory from "../../components/User/MoodJar/MoodJarHistory";
import MoodJarModal from "../../components/User/MoodJar/MoodJarModal";

export default function MoodJarPage() {
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

      setForm({
        moodLabelId: "",
        feelingText: "",
      });

      await fetchMoodJarData();

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
    <>
      <div className="space-y-6">
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

        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
          <div className="space-y-4">
            <MoodJarVisual
              entries={entries}
              paperPositions={paperPositions}
              onClickEntry={handleOpenDetail}
              getJarFillHeight={getJarFillHeight}
              onOpenHistory={handleOpenHistory}
            />

            <div className="rounded-2xl bg-base-100 p-4 shadow">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-base-content/60">
                    Total history
                  </span>
                  <span className="badge badge-primary badge-lg">
                    {historyPagination.totalItems}
                  </span>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm lg:hidden"
                    onClick={() => setIsFormModalOpen(true)}
                  >
                    Tuliskan Perasaanmu
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
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
        title="Input Mood Hari Ini"
        onClose={() => setIsFormModalOpen(false)}
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
        {selectedEntry && (
          <div>
            <p className="text-sm text-base-content/60">
              {formatMoodDate(selectedEntry.entryDate)}
            </p>

            <div
              className="mt-4 rounded-lg border border-base-300 p-4 text-slate-800"
              style={getMoodPaperStyle(selectedEntry)}
            >
              <p className="text-sm leading-relaxed text-slate-700">
                {selectedEntry.feelingText}
              </p>
            </div>

            {selectedEntry.encouragementResult?.supportMessage && (
              <div className="mt-4 rounded-lg bg-slate-900 p-4 text-white">
                <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
                  Support Message
                </p>
                <p className="mt-1 text-sm text-white">
                  {selectedEntry.encouragementResult.supportMessage}
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button type="button" className="btn" onClick={handleCloseDetail}>
                Tutup
              </button>
            </div>
          </div>
        )}
      </MoodJarModal>
    </>
  );
}
