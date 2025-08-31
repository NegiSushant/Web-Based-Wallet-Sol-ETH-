import { useState } from "react";
import { CheckIcon } from "../Icons/CheckIcon";
import { CopyIcon } from "../Icons/CopyIcon";
import { EyeIcon } from "../Icons/EyeIcon";

export default function AddressRow({ wallet, onView }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(wallet.publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 rounded-xl bg-[#0f1b2e] border border-[#253855] px-3 py-2 text-sm break-all">
        {wallet.publicKey}
      </div>

      {/* Copy Button */}
      <button
        onClick={copy}
        className="shrink-0 w-10 h-10 rounded-xl border border-[#2a3a58] bg-[#0b1422]/60 hover:bg-[#18243a] transition grid place-items-center"
        title="Copy"
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>

      {/* Eye Button */}
      <button
        onClick={onView}
        className="shrink-0 w-10 h-10 rounded-xl border border-[#2a3a58] bg-[#0b1422]/60 hover:bg-[#18243a] transition grid place-items-center"
        title="View Wallet"
      >
        <EyeIcon />
      </button>
    </div>
  );
}
