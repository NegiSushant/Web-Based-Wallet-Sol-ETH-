import { useState, useEffect } from "react";

export default function CheckBalance({
  walType,
  walletName,
  publicKey,
  privateKey,
  onClose,
}) {
  const [balance, setBalance] = useState(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  // Fetch balance
  useEffect(() => {
    async function fetchBalance() {
      try {
        if (walType === "sol") {
          // Use your own QuickNode/Alchemy endpoint
          const response = await fetch(
            "https://docs-demo.solana-mainnet.quiknode.pro/", //this should be replace by actual url
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                jsonrpc: "2.0",
                id: 1,
                method: "getBalance",
                params: [publicKey],
              }),
            }
          );
          const data = await response.json();
          setBalance((data?.result?.value ?? 0) / 1e9); // lamports → SOL
        } else if (walType === "eth") {
          // Use your own QuickNode/Infura/Alchemy endpoint
          const response = await fetch(
            "https://docs-demo.quiknode.pro", //this should be replace by actual url
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                jsonrpc: "2.0",
                id: 1,
                method: "eth_getBalance",
                params: [publicKey, "latest"],
              }),
            }
          );
          const data = await response.json();
          // parse hex → decimal ETH
          const wei = parseInt(data?.result ?? "0x0", 16);
          setBalance(wei / 1e18); // wei → ETH
        }
      } catch (err) {
        console.error("Error fetching balance:", err);
        setBalance(null);
      }
    }

    if (publicKey) fetchBalance();
  }, [publicKey, walType]);

  const handleCopy = () => {
    navigator.clipboard.writeText(publicKey);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-[#121a2b] rounded-2xl shadow-lg p-6 w-[400px] relative text-gray-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
        >
          ✕
        </button>

        {/* Wallet Circle */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-indigo-500 flex items-center justify-center text-xl font-bold">
            {walletName}
          </div>
        </div>

        {/* Public Key */}
        <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2 mb-6 border border-gray-700">
          <span className="truncate flex-1">{publicKey}</span>
          <button
            onClick={handleCopy}
            className="ml-2 p-2 bg-gray-700 rounded hover:bg-gray-600"
          >
            📋
          </button>
        </div>

        {/* Balance Card */}
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 mb-6">
          <div className="flex justify-between text-lg font-medium">
            <span>Available Balance</span>
            <span>
              {balance !== null
                ? `${balance} ${walType === "sol" ? "SOL" : "ETH"}`
                : "Loading..."}
            </span>
          </div>
        </div>

        {/* Show Private Key Button */}
        <div className="text-center">
          {showPrivateKey ? (
            <p className="text-sm break-all bg-gray-800 p-3 rounded-lg border border-gray-700">
              {privateKey}
            </p>
          ) : (
            <button
              onClick={() => setShowPrivateKey(true)}
              className="px-4 py-2 bg-red-600 rounded-lg text-white font-medium hover:bg-red-500"
            >
              Show Private Key
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
