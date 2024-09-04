import { Divider, SegmentedControl, Transition } from "@mantine/core";
import React, { useEffect, useState, useCallback } from "react";
import { FaShieldCat } from "react-icons/fa6";
import { IoSettingsSharp } from "react-icons/io5";
import { MdBugReport } from "react-icons/md";
import { TbMessageReportFilled } from "react-icons/tb";
import { Toaster, toast } from "sonner";
import debounce from "debounce";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { debugData } from "../utils/debugData";
import { fetchNui } from "../utils/fetchNui";
import { isEnvBrowser } from "../utils/misc";
import "./App.css";
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
import { Input } from "./ui/input";

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
    const [reportMenuVisible, setReportMenuVisible] = useState(isEnvBrowser());
    const [reportData, setReportData] = useState<reportData>(initialReportData);
    const [activeReports, setActiveReports] = useState<Report[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredReports, setFilteredReports] = useState<Report[]>([]);
    const [myReports, setMyReports] = useState<Report[]>([]);
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

    const [loading, setLoading] = useState(false);

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce((query: string) => {
            const filterPlayers = (data: Report[], query: string) => {
                return data
                    ? Object.values(data).filter((report) => {
                          if (!report) return;
                          const lowerQuery = query.toLowerCase();
                          const reportPlayerId = report.id
                              ?.toString()
                              .toLowerCase();
                          const reportPlayerName =
                              report.playerName.toLowerCase();
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

            setFilteredReports(
                filterPlayers(
                    currentTab === "reports" ? activeReports : myReports,
                    query
                )
            );
            setLoading(false);
        }, 300),
        [activeReports, currentTab, myReports]
    );

    useEffect(() => {
        setLoading(true); // Start loading when searchQuery changes
        debouncedSearch(searchQuery);
    }, [searchQuery, debouncedSearch]);

    useNuiEvent("nui:state:playerdata", setPlayerData);
    useNuiEvent("nui:state:myreports", setMyReports);
    useNuiEvent("nui:state:reportmenu", setReportMenuVisible);
    useNuiEvent("nui:state:reports", setActiveReports);
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
                toast: "font-main !bg-background !border !border-[2px] !rounded-[8px]",
                default: "rounded-[2px] bg-background border-[2px]",
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
            <Transition mounted={visible} transition={"fade-up"} duration={200}>
                {(styles) => (
                    <>
                        <div className="flex w-[100dvw] h-[100dvh] justify-center items-center">
                            <div
                                className="min-w-[50dvw] min-h-[35dvw] bg-background rounded-[2px]"
                                style={styles}
                            >
                                <div className="flex items-center">
                                    <h1 className="m-2 gap-[5px] relative flex justify-center bg-secondary items-center rounded px-4 py-1 font-main text-white border-[2px]">
                                        <FaShieldCat
                                            size={18}
                                            className="text-primary mb-[1px]"
                                        />
                                        Report Menu
                                    </h1>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button className="border-[2px] ml-auto rounded bg-secondary text-white mr-1">
                                                <IoSettingsSharp
                                                    size={13}
                                                    strokeWidth={2.25}
                                                />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="bg-background font-main">
                                            <DropdownMenuLabel className="text-center">
                                                Settings
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuCheckboxItem
                                                checked={
                                                    userSettings.notifications
                                                }
                                                onCheckedChange={(checked) => {
                                                    setUserSettings({
                                                        notifications: checked,
                                                    });
                                                    const settings = {
                                                        notifications: checked,
                                                    };
                                                    setUserSettings(settings);
                                                    fetchNui(
                                                        "reportmenu:nui:cb:settings",
                                                        settings
                                                    );
                                                }}
                                            >
                                                Notifications
                                            </DropdownMenuCheckboxItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <Divider size="xs" />

                                <div className="flex relative items-center justify-center m-5">
                                    <SegmentedControl
                                        className="border-[2px] bg-secondary"
                                        value={currentTab}
                                        onChange={(e) => {
                                            setCurrentTab(e);
                                        }}
                                        classNames={{
                                            label: "mb-1 mr-1",
                                        }}
                                        data={[
                                            {
                                                value: "reports",
                                                disabled: !playerData.isStaff,
                                                label: (
                                                    <>
                                                        <div className="flex justify-center items-center gap-1 text-white">
                                                            <TbMessageReportFilled
                                                                size={18}
                                                                className="text-primary mt-[3px]"
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
                                                            <MdBugReport
                                                                size={18}
                                                                className="text-primary mt-[3px]"
                                                            />
                                                            My Reports
                                                        </div>
                                                    </>
                                                ),
                                            },
                                        ]}
                                    />
                                    <div className="absolute right-0 top-0 h-full flex items-center justify-center">
                                        <Input
                                            type="text"
                                            className="outline-none w-full font-main h-[70%] text-sm border border-secondary-foreground] bg-secondary ml-auto py-[5px] px-[5px] rounded-[8px] focus:border-blue-400 transition-all focus:!ring-1"
                                            placeholder="Search..."
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="border-[1px] flex justify-center items-center h-[55dvh] w-[55dvw] rounded-[8px] m-5">
                                    {loading ? (
                                        <div className="text-center">
                                            Loading...
                                        </div>
                                    ) : (
                                        <Reports
                                            reports={
                                                !searchQuery
                                                    ? currentTab === "reports"
                                                        ? activeReports
                                                        : myReports
                                                    : filteredReports
                                            }
                                            myReports={
                                                currentTab === "reports"
                                                    ? false
                                                    : true
                                            }
                                        />
                                    )}
                                </div>
                                <p className="font-main flex justify-end m-2">
                                    v1.1.2
                                </p>
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
