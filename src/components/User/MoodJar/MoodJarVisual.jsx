import { getMoodPaperStyle } from "../../../utils/User/moodJar";
import { MdMenuOpen } from "react-icons/md";
import { motion } from "framer-motion";
import cloudSmall1 from "../../../assets/cloud-small1.png";

const stars = [
  { left: "8%", top: "12%", size: 18, delay: 0 },
  { left: "74%", top: "9%", size: 13, delay: 0.4 },
  { left: "16%", top: "34%", size: 14, delay: 0.8 },
  { left: "67%", top: "31%", size: 17, delay: 0.2 },
  { left: "71%", top: "50%", size: 12, delay: 1.0 },
  { left: "42%", top: "8%", size: 10, delay: 0.6 },
  { left: "88%", top: "20%", size: 11, delay: 1.2 },
  { left: "5%", top: "55%", size: 10, delay: 0.9 },
  { left: "55%", top: "60%", size: 9, delay: 1.4 },
  { left: "30%", top: "18%", size: 8, delay: 0.3 },
];

function StarIcon({ size, style, delay }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={style}
      className="pointer-events-none absolute z-[5]"
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0.4, 1, 0.4],
        scale: [0.8, 1.1, 0.8],
      }}
      transition={{
        duration: 2.5,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <path
        d="M12 2 L13.5 9.5 L21 12 L13.5 14.5 L12 22 L10.5 14.5 L3 12 L10.5 9.5 Z"
        fill="white"
      />
    </motion.svg>
  );
}

export default function MoodJarVisual({
  entries,
  paperPositions,
  onClickEntry,
  getJarFillHeight,
  onOpenHistory,
}) {
  return (
    <div className="overflow-hidden rounded-[32px] bg-gradient-to-b from-[#1f4d7a] via-[#5f87b3] to-[#dbe8f5] px-5 pb-6 pt-5 shadow-lg sm:px-6">
      {/* header */}
      <motion.div
        className="relative mb-6 flex items-center justify-between gap-3 overflow-hidden rounded-xl"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* 🌟 bintang */}
        {stars.map((s, i) => (
          <StarIcon
            key={`header-${i}`}
            size={s.size - 4}
            delay={s.delay}
            style={{ left: s.left, top: s.top }}
          />
        ))}

        {/* ☁️ cloud kiri */}
        <motion.img
          src={cloudSmall1}
          alt=""
          className="pointer-events-none absolute bottom-[-10px] left-[-12px] z-[1] w-24 opacity-50"
          animate={{ x: [0, 8, 0, -8, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* ☁️ cloud kanan */}
        <motion.img
          src={cloudSmall1}
          alt=""
          className="pointer-events-none absolute bottom-[-8px] right-[-12px] z-[1] w-20 scale-x-[-1] opacity-40"
          animate={{ x: [0, -6, 0, 6, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* CONTENT (harus di atas dekorasi) */}
        <div className="relative z-10 flex w-full items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Jar of Feelings</h2>

          <button
            type="button"
            className="btn btn-ghost min-h-0 h-11 w-11 rounded-full border-0 bg-white/10 p-0 text-white hover:bg-white/20"
            onClick={onOpenHistory}
          >
            <MdMenuOpen size={26} />
          </button>
        </div>
      </motion.div>

      {/* body visual */}
      <div className="relative mx-auto flex w-full max-w-[360px] items-end justify-center overflow-hidden rounded-[24px] bg-transparent px-4 pb-7 pt-4">
        {/* bintang kedap-kedip */}
        {stars.map((s, i) => (
          <StarIcon
            key={i}
            size={s.size}
            delay={s.delay}
            style={{ left: s.left, top: s.top }}
          />
        ))}

        {/* cloud kiri bawah */}
        <motion.img
          src={cloudSmall1}
          alt=""
          className="pointer-events-none absolute bottom-[-16px] left-[-16px] z-10 w-36 opacity-90 sm:w-40"
          initial={{ opacity: 0, x: -40 }}
          animate={{
            opacity: 1,
            x: [0, 16, 0, -16, 0],
          }}
          transition={{
            opacity: { duration: 0.8, delay: 0.3, ease: "easeOut" },
            x: {
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        />

        {/* cloud tengah bawah */}
        <motion.img
          src={cloudSmall1}
          alt=""
          className="pointer-events-none absolute bottom-[-8px] left-[50%] z-10 w-28 -translate-x-1/2 opacity-75 sm:w-32"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            opacity: { duration: 0.8, delay: 0.3, ease: "easeOut" },
            x: {
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        />

        {/* cloud kanan bawah */}
        <motion.img
          src={cloudSmall1}
          alt=""
          className="pointer-events-none absolute bottom-[-14px] right-[-16px] z-10 w-32 scale-x-[-1] opacity-90 sm:w-36"
          initial={{ opacity: 0, x: 40 }}
          animate={{
            opacity: 1,
            x: [0, -12, 0, 12, 0],
          }}
          transition={{
            opacity: { duration: 0.8, delay: 0.3, ease: "easeOut" },
            x: {
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        />

        {/* cloud diagonal kiri tengah */}
        <motion.img
          src={cloudSmall1}
          alt=""
          className="pointer-events-none absolute bottom-[56px] left-[34px] z-[9] w-24 opacity-45"
          initial={{ opacity: 0, x: -20, y: 10 }}
          animate={{ opacity: 0.45, x: 0, y: 0 }}
          transition={{
            opacity: { duration: 0.8, delay: 0.3, ease: "easeOut" },
            x: {
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        />

        {/* cloud diagonal kanan tengah */}
        <motion.img
          src={cloudSmall1}
          alt=""
          className="pointer-events-none absolute bottom-[72px] right-[26px] z-[9] w-20 scale-x-[-1] opacity-40"
          initial={{ opacity: 0, x: 20, y: 10 }}
          animate={{ opacity: 0.4, x: 0, y: 0 }}
          transition={{
            opacity: { duration: 0.8, delay: 0.3, ease: "easeOut" },
            x: {
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        />

        {/* area jar */}
        <motion.div
          className="relative z-20 h-[360px] w-[240px]"
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
        >
          {/* tutup */}
          <div className="absolute left-1/2 top-[18px] z-30 h-[44px] w-[118px] -translate-x-1/2 rounded-[18px] border border-[#8b5e34] bg-gradient-to-b from-[#cfa06c] via-[#b7824e] to-[#8f5e35] shadow-[inset_0_2px_4px_rgba(255,255,255,0.25),0_6px_10px_rgba(0,0,0,0.18)]" />

          {/* ring leher jar */}
          <div className="absolute left-1/2 top-[54px] z-20 h-[18px] w-[126px] -translate-x-1/2 rounded-full border border-[#b9ecff]/60 bg-white/10 shadow-[inset_0_1px_6px_rgba(255,255,255,0.35)] backdrop-blur-sm" />

          {/* body jar */}
          <div className="absolute left-1/2 bottom-0 z-10 h-[290px] w-[190px] -translate-x-1/2 overflow-hidden rounded-b-[42px] rounded-t-[34px] border-[4px] border-[#bdefff]/45 bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.06)_28%,rgba(120,190,235,0.10)_100%)] shadow-[inset_0_0_30px_rgba(255,255,255,0.20),0_10px_24px_rgba(35,72,120,0.18)] backdrop-blur-[3px]">
            {/* fill airnya */}
            <motion.div
              className="absolute bottom-0 left-0 w-full overflow-hidden rounded-b-[36px] border-t border-[#dff6ff]/35 bg-gradient-to-b from-[#8fd8ff]/95 via-[#5fb8ee]/92 to-[#256fa8]/95 shadow-[inset_0_10px_18px_rgba(255,255,255,0.14),inset_0_-8px_14px_rgba(7,40,78,0.22)]"
              style={{ height: getJarFillHeight(entries.length) }}
              animate={{
                y: [0, -2, 0, 15, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* highlight permukaan air */}
              <motion.div
                className="absolute left-[-10%] top-[-3px] h-[10px] w-[120%] rounded-full bg-[#ecfbff]/70 blur-[0.5px]"
                animate={{
                  x: [0, 30, 0, -2, 0],
                  scaleX: [1, 1.03, 1, 0.98, 1],
                  rotate: [0, 0.4, 0, -0.4, 0],
                }}
                transition={{
                  duration: 3.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* gelombang kedua */}
              <motion.div
                className="absolute left-[-14%] top-[3px] h-[8px] w-[128%] rounded-full bg-[#bfefff]/28 blur-[1px]"
                animate={{
                  x: [0, -30, 0, 8, 0],
                  scaleX: [1, 0.98, 1.02, 1, 1],
                }}
                transition={{
                  duration: 4.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* glow di tengah air */}
              <div className="pointer-events-none absolute left-1/2 top-[18%] h-[42%] w-[70%] -translate-x-1/2 rounded-full bg-white/8 blur-xl" />

              {/* bayangan bawah air */}
              <div className="pointer-events-none absolute bottom-0 left-0 h-[28%] w-full bg-gradient-to-t from-[#154b79]/35 to-transparent" />
            </motion.div>
            {/* glow atas air */}
            <div className="pointer-events-none absolute bottom-[38%] left-1/2 h-8 w-[82%] -translate-x-1/2 rounded-full bg-white/10 blur-md" />
            {/* highlight kiri */}
            <div className="pointer-events-none absolute left-4 top-8 h-[72%] w-5 rounded-full bg-white/28 blur-[1px]" />
            {/* highlight tengah */}
            <div className="pointer-events-none absolute left-9 top-12 h-[58%] w-2 rounded-full bg-white/18 blur-[1px]" />
            {/* highlight kanan */}
            <div className="pointer-events-none absolute right-5 top-10 h-[60%] w-3 rounded-full bg-white/16 blur-[1px]" />
            {/* shine top */}
            <div className="pointer-events-none absolute left-1/2 top-3 h-6 w-[75%] -translate-x-1/2 rounded-full bg-white/12 blur-sm" />
          </div>

          {/* kertas dalam jar */}
          <div className="absolute left-1/2 bottom-[18px] z-20 h-[210px] w-[150px] -translate-x-1/2 overflow-hidden">
            {entries.slice(0, 12).map((entry, index) => {
              const positions = [
                "left-[10px] top-[18px] rotate-[-14deg]",
                "left-[62px] top-[8px] rotate-[18deg]",
                "left-[34px] top-[50px] rotate-[-3deg]",
                "left-[90px] top-[62px] rotate-[13deg]",
                "left-[5px] top-[82px] rotate-[-18deg]",
                "left-[52px] top-[94px] rotate-[8deg]",
                "left-[20px] top-[130px] rotate-[14deg]",
                "left-[82px] top-[124px] rotate-[-12deg]",
                "left-[58px] top-[150px] rotate-[20deg]",
                "left-[2px] top-[152px] rotate-[-8deg]",
                "left-[98px] top-[30px] rotate-[-7deg]",
                "left-[38px] top-[24px] rotate-[9deg]",
              ];

              return (
                <motion.button
                  key={entry.id}
                  type="button"
                  onClick={() => onClickEntry(entry)}
                  style={getMoodPaperStyle(entry)}
                  className={`
                    pointer-events-auto absolute
                    ${positions[index % positions.length]}
                    h-[58px] w-[58px]
                    rounded-[3px]
                    border border-white/30
                    p-2 text-left
                    shadow-[0_6px_10px_rgba(40,80,120,0.18)]
                    transition
                    hover:z-30 hover:scale-110
                  `}
                  initial={{ opacity: 0, y: 18, scale: 0.85 }}
                  animate={{
                    opacity: 1,
                    y: [0, -2, 0],
                    scale: 1,
                  }}
                  transition={{
                    opacity: { duration: 0.35, delay: index * 0.04 },
                    scale: { duration: 0.35, delay: index * 0.04 },
                    y: {
                      duration: 3 + index * 0.15,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }}
                >
                  <p className="line-clamp-3 text-[7px] font-semibold leading-[1.15] text-slate-700">
                    {entry.feelingText}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
