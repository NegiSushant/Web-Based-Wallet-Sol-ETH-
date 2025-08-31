import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import { Keypair } from "@solana/web3.js";
import { Buffer } from "buffer";
import CheckBalance from "./CheckBalance"; // import the modal
import AddressRow from "./AddressRow";

export default function SolWallet({ mnemonic }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wallets, setWallets] = useState([]); // store objects instead of just publicKeys
  const [selectedWallet, setSelectedWallet] = useState(null); // wallet for modal

  const disabled = !mnemonic;

  async function addWallet() {
    try {
      const seed = await mnemonicToSeed(mnemonic);
      const path = `m/44'/501'/${currentIndex}'/0'`;
      const derived = derivePath(path, seed.toString("hex")).key;
      const kp = Keypair.fromSecretKey(
        nacl.sign.keyPair.fromSeed(derived).secretKey
      );

      setWallets((prev) => [
        ...prev,
        {
          name: `Wallet ${currentIndex + 1}`,
          publicKey: kp.publicKey.toBase58(),
          privateKey: Buffer.from(kp.secretKey).toString("hex"), // store
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
        <h2 className="text-xl font-semibold text-amber-400">Solana Wallets</h2>
        <button
          onClick={addWallet}
          disabled={disabled}
          className={`px-4 py-2 rounded-xl font-medium transition shadow border ${
            disabled
              ? "bg-transparent border-[#2a3a58] text-gray-500 cursor-not-allowed"
              : "bg-amber-600 hover:bg-amber-700 border-amber-500"
          }`}
          title={disabled ? "Generate seed phrase first" : "Add Sol wallet"}
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
          <p className="text-sm text-gray-400">No Sol wallets yet.</p>
        )}
      </div>

      {selectedWallet && (
        <CheckBalance
          walType="sol"
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
// import { derivePath } from "ed25519-hd-key";
// import nacl from "tweetnacl";
// import { Keypair } from "@solana/web3.js";

// export default function SolWalllet({ mnemonic }) {
//   console.log(mnemonic);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [publicKeys, setPublicKeys] = useState([]);
//   console.log(mnemonic.value);

//   function generateSolWallet() {
//     const seed = mnemonicToSeed(mnemonic);
//     const path = `m/44'/501'/${currentIndex}'/0'`;
//     const derivedSeed = derivePath(path, seed.toString("hex")).key;
//     const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
//     const keypair = Keypair.fromSecretKey(secret);
//     setCurrentIndex(currentIndex + 1);
//     setPublicKeys([...publicKeys, keypair.publicKey]);
//   }

//   return (
//     <div>
//       <button onClick={generateSolWallet}>Add SolWallet</button>
//       {publicKeys.map((p) => (
//         <div>{p.toBase58()}</div>
//       ))}
//     </div>
//   );
// }
