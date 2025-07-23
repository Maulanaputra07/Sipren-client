import { useEffect, useState } from "react";
import { formatDate } from "../../utils/Provider";

export function DateTime() {
  const currentDate = new Date();
  const formatedDate = formatDate(currentDate);
  const [date, setDate] = useState({
    second: "00",
    minute: "00",
    hour: "00",
    day: "00",
    month: "00",
    year: "0000",
  });
  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      setDate({
        second: String(now.getSeconds()).padStart(2, "0"),
        minute: String(now.getMinutes()).padStart(2, "0"),
        hour: String(now.getHours()).padStart(2, "0"),
        day: String(now.getDate()).padStart(2, "0"),
        month: String(now.getMonth() + 1).padStart(2, "0"),
        year: String(now.getFullYear()),
      });
    };
    updateDate();
    const intervalId = setInterval(updateDate, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="p-4 w-96 max-w-2xl h-24 rounded-lg date-time shadow flex gap-3 bg-[#ffa200]">
      <svg xmlns="http://www.w3.org/2000/svg" width="3.5em" height="3.5em" viewBox="0 0 24 24"><path fill="none" stroke="black" d="M7.5 6V1m10 5V1m4 16v4.5h-18v-3m17.863-10H3.352M.5 18.25v.25h17.9l.15-.25l.234-.491A28 28 0 0 0 21.5 5.729V3.5h-18v2.128A28 28 0 0 1 .743 17.744z"/></svg>
      <div className="flex flex-col gap-0 w-full max-w-lg">
        <div>
          <span className="date text-2xl text-black">{formatedDate}</span>
        </div>
        <div className="">
          <span className=" text-white text-xl timestamp w-36">
            {`${date.hour}:${date.minute}:${date.second} WIB`}
          </span>
          {/* <svg className="object-contain text-white"
            xmlns="http://www.w3.org/2000/svg"
            width="38"
            height="38"
            viewBox="0 0 41 44"
            fill="none"
          >
            <path
              d="M13.4695 2H27.2328"
              stroke="red"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20.3511 17.8023V25.7035"
              stroke="red"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20.3511 41.5059C30.4862 41.5059 38.7022 34.431 38.7022 25.7035C38.7022 16.9761 30.4862 9.90118 20.3511 9.90118C10.2161 9.90118 2 16.9761 2 25.7035C2 34.431 10.2161 41.5059 20.3511 41.5059Z"
              stroke="red"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg> */}
        </div>
      </div>
    </div>
  );
}
