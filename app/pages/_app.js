import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, goerli, WagmiConfig } from "wagmi";
// import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

const fantomTestnet = {
  id: 4002,
  name: "Fantom testnet",
  network: "Fantom testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Test FTM",
    symbol: "FTM",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.ankr.com/fantom_testnet"],
    },
  },
  blockExplorers: {
    default: {
      name: "Fantom Explorer",
      url: "https://testnet.ftmscan.com",
    },
  },
  testnet: true,
};

const { provider, chains } = configureChains(
  [fantomTestnet],
  [
    // alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "XDefi",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        modalSize="compact"
        theme={darkTheme({
          // accentColor: "#fc6f38",
          // accentColorForeground: "black",
          borderRadius: "small",
          // fontStack: "rounded",
        })}
      >
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
