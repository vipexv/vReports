import { Alert, AlertTitle } from "@/components/ui/alert";
import { Divider, SegmentedControl, Transition } from "@mantine/core";
import { Cog, Flag, ShieldAlert, Terminal } from "lucide-react";
import React, { useEffect, useState } from "react";
import { MdLeaderboard } from "react-icons/md";
import { TbFileReport } from "react-icons/tb";
import { Toaster, toast } from "sonner";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { debugData } from "../utils/debugData";
import { fetchNui } from "../utils/fetchNui";
import { isEnvBrowser } from "../utils/misc";
import "./App.css";
import Leaderboard from "./leaderboard";
import ReportModal from "./reportModal";
import Reports, { Report } from "./reports";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

debugData([
  {
    action: "setVisible",
    data: true,
  },
]);

export interface reportData {
  title: string;
  type: "Question" | "Bug" | "Gameplay";
  description: string;
  reportNearestPlayers: boolean;
}

const initialReportData: reportData = {
  title: "",
  type: "Gameplay",
  description: "",
  reportNearestPlayers: false,
};

export interface playerData {
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

export interface UserSettings {
  notifications: boolean;
}

interface notifyData {
  title: string;
  description: string;
  appearOnlyWhenNuiNotOpen?: boolean;
}

type ToasterProps = React.ComponentProps<typeof Toaster>;

export interface ScriptConfig {
  Debug: boolean;
  UseDiscordRestAPI: boolean;
  AcePerm: string;
  MaxDistance: number;
  RoleIDs: Record<string, boolean>;
  ReportCommand: string;
  ReportMenuCommand: string;
  NotificationPos: ToasterProps["position"];
}

const App: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [playerData, setPlayerData] = useState<playerData>(initialPlayerData);
  const [currentTab, setCurrentTab] = useState(
    playerData.isStaff ? "reports" : "myreports"
  );
  const [reportMenuVisible, setReportMenuVisible] = useState(false);
  const [reportData, setReportData] = useState<reportData>(initialReportData);
  const [activeReports, setActiveReports] = useState<Report[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [myReports, setMyReports] = useState<Report[]>([]);
  const [filteredLeaderboardData, setFilteredLeaderboardData] = useState<
    LeaderboardData[]
  >([]);

  const [scriptConfig, setScriptConfig] = useState<ScriptConfig>({
    Debug: true,
    UseDiscordRestAPI: true,
    AcePerm: "vadmin.staff",
    MaxDistance: 20.0,
    RoleIDs: {
      "839129247918194732": true,
    },
    ReportCommand: "report",
    ReportMenuCommand: "reports",
    NotificationPos: "top-center",
  });

  const [userSettings, setUserSettings] = useState<UserSettings>({
    notifications: true,
  });

  const [globalLeaderboardData, setLeaderboardData] = useState<
    LeaderboardData[]
  >([]);

  // Spaghetti code and it's horrible, i'm doing this at 6 am after being at it since 11 PM, i should stop but i'm rushing it to improve later.
  useEffect(() => {
    const filterPlayers = (data: Report[], query: string) => {
      return data
        ? Object.values(data).filter((report) => {
            if (!report) return;
            const lowerQuery = query.toLowerCase();
            const reportPlayerId = report.id?.toString().toLowerCase();
            const reportPlayerName = report.playerName.toLowerCase();
            const reportTitle = report.title.toLowerCase();
            const reportTimeDate = report.timedate.toLowerCase();
            const reportType = report.type.toLowerCase();

            return (
              reportPlayerId.includes(lowerQuery) ||
              reportPlayerName.includes(lowerQuery) ||
              reportTitle.includes(lowerQuery) ||
              reportTimeDate.includes(lowerQuery) ||
              reportType.includes(lowerQuery)
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

  useNuiEvent("nui:state:leaderboard", setLeaderboardData);

  useNuiEvent("nui:state:settings", setUserSettings);

  useNuiEvent("nui:state:scriptconfig", setScriptConfig);

  useNuiEvent("nui:resetstates", () => {
    // Only search query for now.
    setSearchQuery("");
  });

  useNuiEvent<boolean>("setVisible", setVisible);

  useNuiEvent<notifyData>("nui:notify", (data) => {
    if (
      !userSettings.notifications ||
      (data.appearOnlyWhenNuiNotOpen && visible)
    )
      return;
    toast.success(data.title, {
      description: data.description,
      classNames: {
        toast: "font-main !bg-primary !border !border-[2px] !rounded-[2px]",
        default: "rounded-[2px] bg-primary border-[2px]",
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
                            The leaderboard updates your data once you leave.
                          </AlertTitle>
                        </Alert>
                      </>
                    )}
                  </Transition>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="border-[2px] ml-auto rounded bg-secondary text-white mr-1">
                        <Cog size={13} strokeWidth={2.25} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-primary font-main">
                      <DropdownMenuLabel className="text-center">
                        Settings
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem
                        checked={userSettings.notifications}
                        onCheckedChange={(checked) => {
                          setUserSettings({ notifications: checked });
                          const settings = {
                            notifications: checked,
                          };
                          setUserSettings(settings);
                          fetchNui("reportmenu:nui:cb:settings", settings);
                        }}
                      >
                        Notifications
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
                <p className="font-main flex justify-end m-2">v1.0.4</p>
              </div>
            </div>
          </>
        )}
      </Transition>

      <ReportModal
        // @ts-expect-error BEGONE
        reportMenuVisible={reportMenuVisible}
        reportData={reportData}
        setReportData={setReportData}
        setReportMenuVisible={setReportMenuVisible}
      />
      <Toaster theme="dark" position={scriptConfig.NotificationPos} />
    </>
  );
};

export default App;
