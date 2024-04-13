import Image from "next/image";
import { Inter } from "next/font/google";

import { useState } from "react";
import { message } from "antd";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [addr, setAddr] = useState("");
  const [showToast, setShowToast] = useState("");

  const [messageApi, contextHolder] = message.useMessage();

  const sendFn = () => {
    fetch(`/api/sendFunds?address=${addr}`)
      .then((res) => res.json())
      .then((res) => {
        setShowToast(res);
        messageApi.open({
          type: "success",
          content: res?.url as string,
        });
      })
      .catch((e) => {
        console.log(e, "err");
      });
  };

  return (
    <>
      {contextHolder}

      <main className={`flex-col p-24 `}>
        <div className="mb-20 ">Morph 领水</div>

        <div className="flex">
          <div className="w-auto">
            <div className="relative w-full min-w-[400px] h-10">
              <input
                value={addr}
                onChange={(e) => setAddr(e.target.value as string)}
                className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900"
                placeholder=" "
              />
              <label className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-900 before:border-blue-gray-200 peer-focus:before:!border-gray-900 after:border-blue-gray-200 peer-focus:after:!border-gray-900">
                address
              </label>
            </div>
          </div>

          <button
            type="button"
            onClick={sendFn}
            className="ml-20 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            领取
          </button>
        </div>
      </main>
    </>
  );
}
