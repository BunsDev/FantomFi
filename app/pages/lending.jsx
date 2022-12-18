import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Fragment, useState } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Dialog, Listbox, Transition } from "@headlessui/react";
import styles from "../styles/Home.module.css";
import { tokens } from "../utils/tokens";
import Loader from "../components/Loader";
import Link from "next/link";

export default function Lending() {
  const [expand, setExpand] = useState(false);
  const [selectedToken, setSelectedToken] = useState(tokens[0]);

  return (
    <div
      className={`w-screen min-h-screen no-repeat bg-cover bg-[#03071E]
        ${
          !expand
            ? `${styles.bg} bg-[url('../assets/landing.png')]`
            : `bg-[#03071E]`
        }
          `}
    >
      <Navbar expand={expand} setExpand={setExpand} />
      {expand ? null : (
        <>
          <div className=" w-full mt-10 flex flex-col justify-center items-center px-2 pb-10">
            <div className="w-full flex flex-col lg:w-5/12 justify-around">
              <h1 className=" text-gray-100 text-3xl font-semibold">Staking</h1>
            </div>
            <div
              className={` mt-8 lg:w-5/12 border rounded-lg border-gray-500 px-4 py-6 bg-transparent backdrop-blur-xl`}
            >
              <div className=" flex items-center justify-between">
                <div className=" text-gray-100  flex  items-center text-lg font-semibold">
                  Stake
                  <Listbox
                    className=" ml-3"
                    value={selectedToken}
                    onChange={setSelectedToken}
                  >
                    <div className="relative mt-0">
                      <Listbox.Button className="relative  cursor-default rounded-md w-28 lg:w-36 px-4 py-2.5 bg-gray-700 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                        <span className="block truncate">
                          {selectedToken.symbol}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronUpDownIcon
                            className="h-5 w-5 text-gray-200"
                            aria-hidden="true"
                          />
                        </span>
                      </Listbox.Button>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100 "
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute mt-1 max-h-60 w-full z-[100] overflow-auto rounded-md  bg-transparent backdrop-blur-xl py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {tokens.map((token, tokenId) => (
                            <Listbox.Option
                              key={tokenId}
                              className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                  active
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-100"
                                }`
                              }
                              value={token}
                            >
                              {({ selectedToken }) => (
                                <>
                                  <span
                                    className={`block truncate  ${
                                      selectedToken
                                        ? "font-medium"
                                        : "font-normal"
                                    }`}
                                  >
                                    {token.symbol}
                                  </span>
                                  {selectedToken ? (
                                    <span className="absolute  inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                      <CheckIcon
                                        className="h-5 w-5 text-gray-900"
                                        aria-hidden="true"
                                      />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>
                </div>
                <Link href="/xdc">
                  <button
                    type="button"
                    className=" flex hover:scale-105 transition ease-in-out items-center w- ml-6 mt-2 hover:bg-transparent border hover:border-gray-300 rounded-md opacity-90 text-xs font-semibold font-fredoka text-white px-3 py-2 mr-2 mb-2"
                  >
                    <img
                      className=" w-5 mr-2"
                      src="https://img.icons8.com/external-kiranshastry-lineal-kiranshastry/64/ffffff/external-wallet-interface-kiranshastry-lineal-kiranshastry.png"
                    />
                    Buy XDC
                  </button>
                </Link>
              </div>

              <div class="mt-4 relative border text-white border-gray-500 py-4 px-6 rounded-md flex flex-col wf items-center justify-between">
                <div className="flex my-2 w-full justify-between items-center">
                  <div>Wallet Balance</div>
                  <div>0 USDC</div>
                </div>
                <div className="flex my-2 w-full justify-between items-center">
                  <div>Available to supply</div>
                  <div>0 USDC</div>
                </div>
                <div className="flex my-2 w-full justify-between items-center">
                  <div>Available to borrow</div>
                  <div>0 USDC</div>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  className="text-white mt-6 bg-orange-600 text-md font-fredoka active:bg-orange-700 font-medium rounded-sm px-5 py-2.5 mr- mb-2"
                >
                  Supply
                </button>
                <button
                  type="button"
                  className="text-white  mt-6 bg-orange-600 text-md font-fredoka active:bg-orange-700 font-medium rounded-sm px-5 py-2.5 ml-4 mb-2"
                >
                  Borrow
                </button>
              </div>
            </div>
          </div>
          {/* <Loader msg={"Message here  "} /> */}
        </>
      )}
      <Footer />
    </div>
  );
}