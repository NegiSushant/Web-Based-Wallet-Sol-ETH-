import { useState } from "react";
import Mnemonics from "./Components/Mnemonics";
import SolWallet from "./Components/SolWallet";
import EthWallet from "./Components/EthWallet";

export default function App() {
  const [mnemonic, setMnemonic] = useState("");

  return (
    <div className="min-h-screen bg-[#0b1220] text-gray-100 flex flex-col">
      {/* Header */}
      <header className="px-6 pt-10 pb-6 border-b border-gray-800">
        <h1 className="text-center text-4xl md:text-5xl font-extrabold tracking-tight text-indigo-300 drop-shadow-lg">
          Web Based Wallet
        </h1>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl w-full px-4 py-10 flex-1">
        <div className="flex flex-col gap-8">
          {/* Mnemonics Section */}
          <div className="p-6 rounded-2xl bg-[#121a2b] shadow-lg border border-gray-800">
            <Mnemonics mnemonic={mnemonic} setMnemonic={setMnemonic} />
          </div>

          {/* Wallets Section */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 p-6 rounded-2xl bg-[#121a2b] shadow-lg border border-gray-800">
              <SolWallet mnemonic={mnemonic} />
            </div>
            <div className="flex-1 p-6 rounded-2xl bg-[#121a2b] shadow-lg border border-gray-800">
              <EthWallet mnemonic={mnemonic} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
