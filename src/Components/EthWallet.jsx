import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { Wallet, HDNodeWallet } from "ethers";
import CheckBalance from "./CheckBalance";
import AddressRow from "./AddressRow";

export default function EthWallet({ mnemonic }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wallets, setWallets] = useState([]); // store objects with keys
  const [selectedWallet, setSelectedWallet] = useState(null);
  const disabled = !mnemonic;

  async function addWallet() {
    try {
      const seed = await mnemonicToSeed(mnemonic);
      const root = HDNodeWallet.fromSeed(seed);
      const path = `m/44'/60'/0'/0/${currentIndex}`;
      const child = root.derivePath(path);
      const wallet = new Wallet(child.privateKey);

      setWallets((prev) => [
        ...prev,
        {
          name: `Wallet ${currentIndex + 1}`,
          publicKey: wallet.address,
          privateKey: child.privateKey,
        },
      ]);
      setCurrentIndex((i) => i + 1);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <section className="bg-[#0f1a2b] border border-[#1a2a44] rounded-3xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-emerald-400">
          Ethereum Wallets
        </h2>
        <button
          onClick={addWallet}
          disabled={disabled}
          className={`px-4 py-2 rounded-xl font-medium transition shadow border ${
            disabled
              ? "bg-transparent border-[#2a3a58] text-gray-500 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-700 border-emerald-500"
          }`}
          title={disabled ? "Generate seed phrase first" : "Add ETH wallet"}
        >
          Add Wallet
        </button>
      </div>

      <div className="space-y-3">
        {wallets.map((wallet, i) => (
          <AddressRow
            key={i}
            wallet={wallet}
            onView={() => setSelectedWallet(wallet)}
          />
        ))}
        {wallets.length === 0 && (
          <p className="text-sm text-gray-400">No ETH wallets yet.</p>
        )}
      </div>

      {selectedWallet && (
        <CheckBalance
          walType="eth"
          walletName={selectedWallet.name}
          publicKey={selectedWallet.publicKey}
          privateKey={selectedWallet.privateKey}
          onClose={() => setSelectedWallet(null)}
        />
      )}
    </section>
  );
}

// import { mnemonicToSeed } from "bip39";
// import { useState } from "react";
// import { Wallet, HDNodeWallet } from "ethers";

// export default function EthWallet({ mnemonic }) {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [address, setAddress] = useState([]);

//   async function generateEthWallet() {
//     const seed = await mnemonicToSeed(mnemonic);
//     const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
//     const hdNode = HDNodeWallet.fromSeed(seed);
//     const child = hdNode.derivePath(derivationPath);
//     const privateKey = child.privateKey;
//     const wallet = new Wallet(privateKey);
//     setCurrentIndex(currentIndex + 1);
//     setAddress([...address, wallet.address]);
//   }

//   return (
//     <div>
//       <button onClick={generateEthWallet}>Add ETH Wallet</button>
//       {address.map((p) => (
//         <div>Eth - {p}</div>
//       ))}
//     </div>
//   );
// }
