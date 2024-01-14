import { Input, Modal, ScrollArea } from "@mantine/core";
import React, { useState } from "react";
import { FaPeoplePulling } from "react-icons/fa6";
import { GiTeleport } from "react-icons/gi";

import { debugData } from "@/utils/debugData";
import { fetchNui } from "@/utils/fetchNui";
import { Check, Send } from "lucide-react";
import { MdOutlineSocialDistance } from "react-icons/md";
import "./App.css";
import { Button } from "./ui/button";

const types = ["Bug", "Question", "Gameplay"];

const getCurrentDateTime = () => {
  const currentDate = new Date();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();

  const formattedDate = `${
    currentDate.getMonth() + 1
  }/${currentDate.getDate()}/${currentDate.getFullYear()}`;

  const formattedTime = `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;

  return `${formattedTime} ${formattedDate}`;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const testReports = Array.from({ length: 100 }, (_, index) => ({
  id: index,
  type: types[Math.floor(Math.random() * types.length)],
  description: "Very Very racist personeeeeeeeeeeeeeeeee!",
  playerName: `Test: ${index}`,
  timedate: getCurrentDateTime(),
  title: `Title ${index}`,
  nearestPlayers: [],
}));

export interface message {
  playerName: string;
  playerId: string | number;
  data: string;
  timedate: string;
}

export interface nearestPlayer {
  id: string | number;
  name: string | number;
  distance: string | number;
}

export interface Report {
  id: number | string;
  playerName: string;
  type: "Bug" | "Question" | "Gameplay" | "";
  description: string;
  timedate: string;
  title: "";
  nearestPlayers?: nearestPlayer[];
  messages: message[];
  reportId: string;
}

const initStateCurrReport: Report = {
  id: 0,
  playerName: "",
  type: "",
  description: "",
  timedate: "",
  title: "",
  messages: [],
  reportId: "A1",
};

interface Props {
  reports: Report[];
  myReports: boolean;
}

const Reports: React.FC<Props> = ({ reports, myReports }) => {
  const [currReport, setCurrReport] = useState<Report>(initStateCurrReport);
  const [modalActive, setModalActive] = useState(false);
  const [messageModal, setMessageModalOpen] = useState(false);
  const [messageQuery, setMessageQuery] = useState("");

  debugData([
    {
      action: "nui:state:reports",
      data: testReports,
    },
  ]);

  return (
    <>
      <ScrollArea className="w-full h-full">
        <div className="grid grid-cols-1 m-5 sm:grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {reports.length !== 0 ? (
            <>
              {Object.values(reports).map((report, index) => {
                if (!report) return;
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
                        <span className="truncate max-w-[100px] text-sm">
                          [{report.reportId}] {report.title}
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
                          {report.timedate}
                        </p>
                      </div>
                    </div>
                  </>
                );
              })}
            </>
          ) : (
            <>
              <div className="font-main">
                {myReports
                  ? "You have no active reports."
                  : "No Reports available."}
              </div>
            </>
          )}
        </div>
      </ScrollArea>
      <Modal
        opened={modalActive}
        centered
        size={"lg"}
        onClose={() => {
          setModalActive(false);
          setCurrReport(initStateCurrReport);
        }}
        classNames={{
          body: "border-[2px] bg-secondary",
        }}
        withCloseButton={false}
      >
        <div className="flex flex-col gap-1 justify-center p-2 rounded">
          <div className="flex m-2 font-main text-white">
            <p>
              [{currReport.reportId}] {currReport.title}
            </p>
            <p className="bg-primary ml-auto p-1 rounded-[2px] text-xs">
              {currReport.type}
            </p>
          </div>
          <div className="rounded py-1 px-2 flex flex-col gap-2 justify-center">
            <p className="text-white font-main">Player Name</p>
            {currReport.playerName}
            <p className="text-white font-main">Report Description</p>
            {currReport.description}

            {currReport.messages && (
              <>
                <p className="text-white font-main">Report Messages</p>
                <ScrollArea className="max-h-[20dvh] bg-primary border-[2px]">
                  <div className="flex flex-col gap-2">
                    {currReport.messages.map((message, index) => (
                      <>
                        <div
                          key={index}
                          className="bg-secondary py-1 px-2 m-2 rounded-[2px] border-[2px]"
                        >
                          <div className="flex font-main">
                            <span className="text-white">
                              {message.playerName} (ID - {message.playerId}):
                            </span>
                            <span className="ml-1 max-w-[240px] break-words">
                              {message.data}
                            </span>
                            <p className="ml-auto bg-primary px-2 py-1 flex justify-center items-center gap-1 border-[2px] font-main opacity-50 text-xs">
                              {message.timedate}
                            </p>
                          </div>
                        </div>
                      </>
                    ))}
                  </div>
                </ScrollArea>
              </>
            )}

            {currReport.nearestPlayers && (
              <>
                <p className="text-white font-main">Nearest Players</p>
                <ScrollArea className="max-h-[30dvh] bg-primary border-[2px]">
                  <div className=" py-4 px-4 rounded-[2px] gap-2 grid grid-cols-4 font-mwwwwwwwwwwwain text-sm">
                    {currReport.nearestPlayers.length > 0 &&
                      currReport.nearestPlayers.map((player, index) => (
                        <>
                          <div
                            key={index}
                            className="bg-secondary py-1 px-2 flex items-center"
                          >
                            <div className="p-1 flex items-center text-white">
                              [{player.id}]{" "}
                              <p className="ml-1 truncate max-w-[50px]">
                                {player.name}
                              </p>
                            </div>
                            <p className="ml-auto flex items-center bg-primary rounded-[2px] px-1">
                              <MdOutlineSocialDistance className="mr-1" />{" "}
                              {player.distance}
                            </p>
                          </div>
                        </>
                      ))}
                  </div>
                </ScrollArea>
              </>
            )}
          </div>
        </div>
        <div className="flex justify-end items-center mt-4 gap-2 font-main">
          <Button
            className="text-xs rounded-[2px] m-0 border-[2px] bg-secondary"
            onClick={() => {
              // setCurrReport(initStateCurrReport);
              setMessageModalOpen(true);
              // setModalActive(false);
            }}
          >
            <Send size={16} className="mr-1" /> Send Message
          </Button>
          {!myReports && (
            <>
              <Button
                className="text-xs rounded-[2px] m-0 border-[2px] bg-secondary"
                onClick={() => {
                  fetchNui("reportmenu:nuicb:goto", currReport);
                  setCurrReport(initStateCurrReport);
                  setModalActive(false);
                }}
              >
                <GiTeleport className="mr-1" /> Goto
              </Button>
              <Button
                className="text-xs rounded-[2px] m-0 border-[2px] bg-secondary"
                onClick={() => {
                  fetchNui("reportmenu:nuicb:bring", currReport);
                  setCurrReport(initStateCurrReport);
                  setModalActive(false);
                }}
              >
                <FaPeoplePulling className="mr-1" /> Bring
              </Button>
            </>
          )}
          <Button
            className="text-xs rounded-[2px] m-0 border-[2px] bg-green-600 text-white"
            onClick={() => {
              const data = {
                ...currReport,
                isMyReportsPage: myReports,
              };

              fetchNui("reportmenu:nuicb:delete", data);
              setModalActive(false);
              setCurrReport(initStateCurrReport);
            }}
          >
            <Check size={16} strokeWidth={2.5} className="mr-1" />
            {myReports ? "Close" : "Conclude"} Report
          </Button>
        </div>
      </Modal>
      <Modal
        opened={messageModal}
        withCloseButton={false}
        onClose={() => {
          setMessageModalOpen(false);
        }}
        classNames={{
          body: "bg-secondary border-[2px]",
        }}
      >
        <div className="font-main">
          <p className="mb-1">[{currReport.reportId}] Send a message</p>
          <form
            className="flex items-center gap-1"
            onSubmit={(e) => {
              e.preventDefault();

              const data = {
                report: currReport,
                messageQuery: messageQuery,
              };

              fetchNui("reportmenu:nuicb:sendmessage", data);
              setMessageModalOpen(false);
              setModalActive(false);
              setCurrReport(initStateCurrReport);
              setMessageQuery("");
            }}
          >
            <Input
              className="w-full"
              value={messageQuery}
              onChange={(e) => {
                setMessageQuery(e.target.value);
              }}
              classNames={{
                input: "bg-secondary font-main border-[2px]",
              }}
              placeholder="Message..."
            />
            <Button
              type="submit"
              className="ml-auto border-[2px] rounded-[2px] bg-primary h-[36px] hover:bg-green-500 text-white"
            >
              <Check size={16} strokeWidth={2.5} />
            </Button>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default Reports;
