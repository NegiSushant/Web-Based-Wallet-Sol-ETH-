import { useEffect, useMemo, useState } from "react";
import { generateMnemonic } from "bip39";

export default function Mnemonics({ mnemonic, setMnemonic }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [revealed, setRevealed] = useState(true);
  const [copied, setCopied] = useState(false);

  const words = useMemo(
    () => (mnemonic ? mnemonic.trim().split(/\s+/) : []),
    [mnemonic]
  );

  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  async function handleGenerate() {
    const mn = await generateMnemonic(); // defaults to 12 words
    setMnemonic(mn);
    setRevealed(true);
  }

  async function copyAll() {
    if (!mnemonic) return;
    await navigator.clipboard.writeText(mnemonic);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
    setMenuOpen(false);
  }

  function downloadTxt() {
    const blob = new Blob([mnemonic], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "seed-phrase.txt";
    a.click();
    URL.revokeObjectURL(url);
    setMenuOpen(false);
  }

  function clearSeed() {
    setMnemonic("");
    setMenuOpen(false);
  }

  return (
    <section className="bg-[#0f1a2b] border border-[#1a2a44] rounded-3xl shadow-xl p-6 relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-indigo-300">Seed Phrase</h2>

        {mnemonic && (
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="rounded-xl border border-[#2a3a58] bg-[#121a2a]/60 px-3 py-1.5 text-sm hover:bg-[#18243a] transition flex items-center gap-2"
            >
              Options
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5 7l5 5 5-5H5z" />
              </svg>
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-xl border border-[#233650] bg-[#0f1726] shadow-2xl z-10"
                onMouseLeave={() => setMenuOpen(false)}
              >
                <MenuItem
                  onClick={copyAll}
                  label={copied ? "Copied!" : "Copy All"}
                />
                <MenuItem
                  onClick={() => {
                    setRevealed((r) => !r);
                    setMenuOpen(false);
                  }}
                  label={revealed ? "Hide Phrase" : "Show Phrase"}
                />
                {/* <MenuItem
                  onClick={async () => {
                    await handleGenerate();
                    setMenuOpen(false);
                  }}
                  label="Regenerate"
                /> */}
                <MenuItem onClick={downloadTxt} label="Download .txt" />
                <Divider />
                {/* <MenuItem onClick={clearSeed} label="Clear" danger /> */}
              </div>
            )}
          </div>
        )}
      </div>

      {!mnemonic ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#2a3a58] bg-[#0b1422]/60 p-8">
          <p className="text-sm text-gray-300 mb-4">
            No seed phrase yet. Generate one to begin.
          </p>
          <button
            onClick={handleGenerate}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-medium transition shadow"
          >
            Generate Seed Phrase
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#1f314e] bg-[#0b1422]/60 p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {words.map((w, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-2 rounded-xl bg-[#0f1b2e] border border-[#253855] px-3 py-2 text-sm"
              >
                <span className="text-gray-400">{i + 1}.</span>
                <span
                  className={`font-medium ${
                    revealed
                      ? "text-gray-100"
                      : "text-gray-500 blur-sm select-none"
                  }`}
                >
                  {w}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-center text-amber-300/90">
            Never share your seed phrase. Store it offline.
          </p>
        </div>
      )}
    </section>
  );
}

function MenuItem({ onClick, label, danger }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2 text-sm rounded-xl hover:bg-[#142136] transition ${
        danger ? "text-rose-400 hover:text-rose-300" : "text-gray-200"
      }`}
    >
      {label}
    </button>
  );
}

function Divider() {
  return <div className="my-1 h-px bg-[#1e2c45]" />;
}


// import { generateMnemonic } from "bip39";

// export default function Mnemonics({ mnemonic, setMnemonic }) {
//   function generateMnemonics(e) {
//     e.preventDefault();
//     const mn = generateMnemonic();
//     setMnemonic(mn);
//   }

//   const items = mnemonic ? mnemonic.trim().split(" ") : [];

//   return (
//     <div className="text-xl border rounded-lg my-3 ">
//       <h2 className="text-center text-xl md:text-3xl font-semibold m-2">
//         Seed Phrase
//       </h2>
//       <div className="flex flex-col items-center justify-center">
//         {mnemonic ? (
//           <>
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
//               {items.map((word, index) => (
//                 <GridItem key={index} item={word} />
//               ))}
//             </div>
//             <p className="mt-4 text-sm text-gray-600">
//               Your Private Key/Seed Phrase is the only way to recover your
//               account.{" "}
//             </p>
//             <p>
//               <span className="font-bold text-sm text-red-500">
//                 Never share it with anyone.
//               </span>
//             </p>

//             <button
//               onClick={() => navigator.clipboard.writeText(mnemonic)}
//               className="m-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//             >
//               Copy Seed Phrase
//             </button>
//           </>
//         ) : (
//           <button
//             onClick={generateMnemonics}
//             className="justify-center items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
//           >
//             Generate Seed Phrase
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

// const GridItem = ({ item }) => (
//   <div className="px-6 py-3 bg-gray-800 text-white rounded-lg shadow-md border border-gray-700 text-center text-lg font-medium">
//     {item}
//   </div>
// );