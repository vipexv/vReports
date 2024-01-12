import {
  Divider,
  Modal,
  SegmentedControl,
  Select,
  Transition,
} from "@mantine/core";
import { AlertTriangle, Cog, Flag, ShieldAlert, Terminal } from "lucide-react";
import React, { useEffect, useState } from "react";
import { MdLeaderboard } from "react-icons/md";
import { TbFileReport } from "react-icons/tb";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { debugData } from "../utils/debugData";
import { fetchNui } from "../utils/fetchNui";
import { isEnvBrowser } from "../utils/misc";
import "./App.css";
import { Report } from "./reports";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import Leaderboard from "./leaderboard";
import Reports from "./reports";

debugData([
  {
    action: "setVisible",
    data: true,
  },
]);

const initialReportData = {
  title: "",
  type: "Gameplay",
  description: "",
};

interface playerData {
  name: string;
  id: string | number;
  identifiers: string[];
  isStaff: boolean;
}

const initialPlayerData: playerData = {
  name: "vipex",
  id: "1",
  identifiers: ["hey", "hey2"],
  isStaff: true,
};

export interface LeaderboardData {
  concludedReports: number;
  name: string;
  identifiers: string[];
}

const App: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [playerData, setPlayerData] = useState<playerData>(initialPlayerData);
  const [currentTab, setCurrentTab] = useState(
    playerData.isStaff ? "reports" : "myreports"
  );
  const [reportMenuVisible, setReportMenuVisible] = useState(false);
  const [reportData, setReportData] = useState(initialReportData);
  const [activeReports, setActiveReports] = useState<Report[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [myReports, setMyReports] = useState<Report[]>([]);
  const [filteredLeaderboardData, setFilteredLeaderboardData] = useState<
    LeaderboardData[]
  >([]);

  const [globalLeaderboardData, setLeaderboardData] = useState<
    LeaderboardData[]
  >([
    {
      concludedReports: 1,
      name: "vipex",
      identifiers: [
        "license:6c5a04a27880f9ef14f177cd52b495d6d9517187",
        "xbl:2535413463113628",
        "live:844425900550524",
        "discord:470311257589809152",
        "fivem:1124792",
        "license2:6c5a04a27880f9ef14f177cd52b495d6d9517187",
      ],
    },
  ]);

  useNuiEvent("nui:state:leaderboard", setLeaderboardData);

  // Spaghetti code and it's horrible, i'm doing this at 6 am after being at it since 11 PM, i should stop but i'm rushing it to improve later.
  useEffect(() => {
    const filterPlayers = (data: Report[], query: string) => {
      return data
        ? Object.values(data).filter((player) => {
            if (!player || !player.id) return;
            const playerId = player.id?.toString().toLowerCase();

            return (
              player.playerName.toLowerCase().includes(query) ||
              playerId.includes(query) ||
              player.title.toLowerCase().includes(query) ||
              player.timedate.toLowerCase().includes(query) ||
              player.type.toLowerCase().includes(query)
            );
          })
        : [];
    };

    const filterLeaderboardData = (data: LeaderboardData[], query: string) => {
      return data
        ? Object.values(data).filter((player) => {
            if (!player) return;

            return player.name.toLowerCase().includes(query);
          })
        : [];
    };

    if (currentTab === "leaderboard") {
      setFilteredLeaderboardData(
        filterLeaderboardData(globalLeaderboardData, searchQuery)
      );
      return;
    }

    setFilteredReports(
      filterPlayers(
        currentTab === "reports" ? activeReports : myReports,
        searchQuery
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  useNuiEvent("nui:state:playerdata", setPlayerData);

  useNuiEvent("nui:state:myreports", setMyReports);

  useNuiEvent("nui:state:reportmenu", setReportMenuVisible);

  useNuiEvent("nui:state:reports", setActiveReports);

  useNuiEvent("nui:resetstates", () => {
    // Only search query for now.
    setSearchQuery("");
  });

  interface notifyData {
    title: string;
    description: string;
    appearOnlyWhenNuiNotOpen?: boolean;
  }

  useNuiEvent<boolean>("setVisible", setVisible);

  useNuiEvent<notifyData>("nui:notify", (data) => {
    if (data.appearOnlyWhenNuiNotOpen && visible) return;
    toast.success(data.title, {
      description: data.description,
      classNames: {
        toast: "font-main bg-primary border border-[2px] rounded-[2px]",
        default: "rounded-[2px] bg-primary",
      },
    });
  });

  useEffect(() => {
    if (!visible) return;

    const keyHandler = (e: KeyboardEvent) => {
      if (["Escape"].includes(e.code)) {
        if (!isEnvBrowser()) fetchNui("hideFrame");
        else setVisible(!visible);
      }
    };

    window.addEventListener("keydown", keyHandler);

    return () => window.removeEventListener("keydown", keyHandler);
  }, [visible]);

  return (
    <>
      <Transition
        mounted={visible}
        transition={"slide-up"}
        duration={400}
        timingFunction="ease"
      >
        {(styles) => (
          <>
            <div className="flex w-[100dvw] h-[100dvh] justify-center items-center">
              <div
                className="min-w-[50dvw] min-h-[35dvw] bg-primary rounded-[2px]"
                style={styles}
              >
                <div className="flex items-center">
                  <h1 className="m-2 relative flex justify-center bg-secondary items-center rounded px-4 py-1 font-main text-white border-[2px]">
                    <ShieldAlert size={18} className="mr-1 text-blue-400" />
                    Report Menu
                  </h1>
                  <Transition
                    mounted={currentTab === "leaderboard"}
                    transition={"scale-y"}
                    duration={400}
                    timingFunction="ease"
                  >
                    {(styles) => (
                      <>
                        <Alert
                          className={`bg-secondary font-main w-[30dvw] m-auto rounded-[2px] border-[2px] h-[4dvh]`}
                          style={styles}
                        >
                          <Terminal size={18} className="-mt-[6px]" />
                          <AlertTitle className="-mt-1 truncate">
                            The leaderboard updates data once you leave.
                          </AlertTitle>
                        </Alert>
                      </>
                    )}
                  </Transition>
                  <Button className="border-[2px] ml-auto rounded bg-secondary text-white mr-1">
                    <Cog size={13} strokeWidth={2.25} />
                  </Button>
                </div>

                <Divider size="xs" />

                <div className="flex flex-col items-center mt-2">
                  <SegmentedControl
                    className="border-[2px] bg-secondary m-auto mb-2"
                    value={currentTab}
                    onChange={(e) => {
                      setCurrentTab(e);
                    }}
                    data={[
                      {
                        value: "reports",
                        disabled: !playerData.isStaff,
                        label: (
                          <>
                            <div className="flex justify-center items-center gap-1 text-white">
                              <Flag
                                size={14}
                                className="text-red-500"
                                strokeWidth={3}
                              />
                              Reports
                            </div>
                          </>
                        ),
                      },
                      {
                        value: "myreports",
                        label: (
                          <>
                            <div className="flex justify-center items-center gap-1 text-white">
                              <TbFileReport
                                size={14}
                                className="text-blue-500"
                              />
                              My Reports
                            </div>
                          </>
                        ),
                      },
                      {
                        value: "leaderboard",
                        disabled: !playerData.isStaff,
                        label: (
                          <>
                            <div className="flex justify-center items-center gap-1 text-white">
                              <MdLeaderboard
                                size={14}
                                className="text-yellow-500"
                              />
                              Leaderboard
                            </div>
                          </>
                        ),
                      },
                    ]}
                  />
                  <div className="flex">
                    <input
                      type="text"
                      className="outline-none w-full font-main h-full border-[2px] bg-secondary ml-auto py-[5px] px-[5px] rounded focus:border-blue-400 transition-all"
                      placeholder="Search..."
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="border-[2px] flex justify-center items-center h-[55dvh] rounded m-10 mt-5">
                  {currentTab === "reports" ? (
                    <>
                      {!searchQuery ? (
                        <>
                          <Reports reports={activeReports} myReports={false} />
                        </>
                      ) : (
                        <>
                          <Reports
                            reports={filteredReports}
                            myReports={false}
                          />
                        </>
                      )}
                    </>
                  ) : currentTab === "leaderboard" ? (
                    <>
                      {!searchQuery ? (
                        <Leaderboard leaderboardData={globalLeaderboardData} />
                      ) : (
                        <Leaderboard
                          leaderboardData={filteredLeaderboardData}
                        />
                      )}
                    </>
                  ) : (
                    <>
                      {!searchQuery ? (
                        <>
                          <Reports reports={myReports} myReports={true} />
                        </>
                      ) : (
                        <>
                          <Reports reports={filteredReports} myReports={true} />
                        </>
                      )}
                    </>
                  )}
                </div>
                <p className="font-main flex justify-end m-2">v1.0.0</p>
              </div>
            </div>
          </>
        )}
      </Transition>
      <Modal
        opened={reportMenuVisible}
        onClose={() => {
          setReportMenuVisible(false);
          fetchNui("hideFrame");
        }}
        classNames={{
          body: "bg-secondary border-[2px]",
        }}
        withCloseButton={false}
        centered
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setReportMenuVisible(false);
            fetchNui("hideFrame");
            fetchNui("reportmenu:nuicb:sendreport", reportData);
            setReportData(initialReportData);
          }}
        >
          <div>
            <p className="font-main mb-2 text-xl flex justify-center items-center gap-1">
              <ShieldAlert size={16} color="#ff0000" strokeWidth={2.25} />
              Report Menu
            </p>
            <Divider size={"sm"} />
            <div className="grid grid-cols-2 mt-2 gap-4">
              <input
                type="text"
                className="outline-none text-sm font-main w-full h-full border-[2px] bg-secondary ml-auto py-[5px] px-[5px] rounded focus:border-blue-400 transition-all"
                placeholder="Title"
                onChange={(value) => {
                  const data = {
                    ...reportData,
                    title: value.target.value,
                  };

                  setReportData(data);
                }}
                required
              />
              <Select
                placeholder="Report Type"
                className="font-main"
                value={reportData.type}
                onChange={(value) => {
                  if (!value) return;

                  const data = {
                    ...reportData,
                    type: value,
                  };
                  setReportData(data);
                }}
                classNames={{
                  input:
                    "bg-secondary font-main border-[2px] border-primary text-white",
                  dropdown:
                    "bg-secondary font-main border-[2px] border-primary",
                }}
                data={["Question", "Bug", "Gameplay"]}
                required
              />
              <input
                type="text"
                className="outline-none col-span-2 text-base font-main w-full h-full border-[2px] bg-secondary ml-auto py-[5px] px-[5px] rounded focus:border-blue-400 transition-all"
                placeholder="Description..."
                onChange={(value) => {
                  const data = {
                    ...reportData,
                    description: value.target.value,
                  };

                  setReportData(data);
                }}
                required
              />
              <Button
                className="text-xs rounded-[2px] m-0 border-[2px] bg-destructive col-span-2"
                onClick={() => {}}
                type="submit"
              >
                <AlertTriangle size={16} strokeWidth={2.5} className="mr-1" />
                Submit Report
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default App;
