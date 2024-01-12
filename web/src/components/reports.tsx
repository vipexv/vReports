import { Modal, ScrollArea } from "@mantine/core";
import React, { useState } from "react";
import { FaPeoplePulling } from "react-icons/fa6";
import { GiTeleport } from "react-icons/gi";

import { AlertTriangle } from "lucide-react";
import "./App.css";
import { Button } from "./ui/button";
import { fetchNui } from "@/utils/fetchNui";

const types = ["Bug", "Question", "Gameplay"];

const getCurrentDateTime = () => {
  const currentDate = new Date();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();

  const formattedDate = `${
    currentDate.getMonth() + 1
  }/${currentDate.getDate()}/${currentDate.getFullYear()}`;

  const formattedTime = `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;

  return { formattedTime, formattedDate };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const activeReports = Array.from({ length: 100 }, (_, index) => ({
  id: index,
  type: types[Math.floor(Math.random() * types.length)],
  description: "Very Very racist personeeeeeeeeeeeeeeeee!",
  datetime: getCurrentDateTime(),
  title: `Title ${index}`,
  state: {
    concluded: false,
  },
}));

const initStateCurrReport = {
  id: 0,
  type: "",
  description: "",
  datetime: {
    formattedDate: "",
    formattedTime: "",
  },
  title: "",
  state: {
    concluded: false,
  },
};

const Reports: React.FC = () => {
  const [currReport, setCurrReport] = useState(initStateCurrReport);
  const [modalActive, setModalActive] = useState(false);

  return (
    <>
      <ScrollArea className="w-full h-full">
        <div className="grid grid-cols-1 m-5 sm:grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Object.values(activeReports).map((report, index) => {
            return (
              <>
                <div
                  key={index}
                  onClick={() => {
                    setCurrReport(report);
                    setModalActive(true);
                  }}
                  className="flex hover:cursor-pointer transition-all select-none hover:-translate-y-1 flex-col py-1 px-2  bg-secondary border-[2px] rounded text-white"
                >
                  <p className="flex items-center">
                    <span className="truncate max-w-[100px]">
                      [{report.id}] {report.title}
                    </span>
                    <span className="ml-auto bg-primary px-1 font-main text-sm">
                      {report.type}
                    </span>
                  </p>
                  <div className="flex mt-2">
                    <p className="text-xs text-white text-opacity-50 truncate max-w-[100px]">
                      {report.description}
                    </p>
                    <p className="ml-auto bg-primary px-2 ml-4 font-main text-xs opacity-50">
                      {report.datetime.formattedTime} |{" "}
                      {report.datetime.formattedDate}
                    </p>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      </ScrollArea>
      <Modal
        opened={modalActive}
        onClose={() => {
          setModalActive(false);
          setCurrReport(initStateCurrReport);
        }}
        withCloseButton={false}
        // title={`[${currReport.id}] ${currReport.title}`}
      >
        <div className="flex flex-col gap-1 justify-center border-[2px] p-2 rounded">
          <div className="flex m-2 font-main">
            <p>
              [{currReport.id}] {currReport.title}
            </p>
            <p className="bg-primary ml-auto p-1 rounded-[2px] text-xs">
              {currReport.type}
            </p>
          </div>
          <div className="rounded py-1 px-2 flex flex-col justify-center">
            <p className="text-white font-main">Report Description</p>

            {currReport.description}
          </div>
        </div>
        <div className="flex justify-end items-center mt-4 gap-2">
          <Button
            className="text-xs rounded-[2px] m-0 border-[2px] bg-secondary"
            onClick={() => {
              fetchNui("staffchat:nuicb:goto", currReport);
              setCurrReport(initStateCurrReport);
              setModalActive(false);
            }}
          >
            <GiTeleport className="mr-1" /> Goto
          </Button>
          <Button
            className="text-xs rounded-[2px] m-0 border-[2px] bg-secondary"
            onClick={() => {
              fetchNui("staffchat:nuicb:bring", currReport);
              setCurrReport(initStateCurrReport);
              setModalActive(false);
            }}
          >
            <FaPeoplePulling className="mr-1" /> Bring
          </Button>
          <Button
            className="text-xs rounded-[2px] m-0 border-[2px] bg-destructive"
            onClick={() => {
              fetchNui("staffchat:nuicb:delete", currReport);
              setCurrReport(initStateCurrReport);
              setModalActive(false);
            }}
          >
            <AlertTriangle size={16} strokeWidth={2.5} className="mr-1" /> Close
            Report
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default Reports;
