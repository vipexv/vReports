/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { fetchNui } from "@/utils/fetchNui";
import * as React from "react";
import { FaShieldCat } from "react-icons/fa6";
import { reportData } from "./App";
import { ReportTypeSelect } from "./ReportTypeSelect";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";

const initialReportData: reportData = {
    title: "",
    type: "Gameplay",
    description: "",
    reportNearestPlayers: false,
};

const ReportModal: React.FC = ({
    reportMenuVisible,
    setReportMenuVisible,
    reportData,
    setReportData,
}: any) => {
    return (
        <Dialog
            open={reportMenuVisible}
            onOpenChange={(state) => {
                if (!state) fetchNui("hideFrame");
                setReportMenuVisible(state);
            }}
        >
            <DialogContent className="bg-[#1a1a1a] border-[2px] rounded-[8px]">
                <DialogHeader>
                    <DialogTitle className="font-main mb-2 text-lg flex justify-center items-center gap-[5px]">
                        <FaShieldCat
                            size={18}
                            className="text-primary mb-[1px]"
                        />
                        Report Menu
                    </DialogTitle>
                </DialogHeader>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        setReportMenuVisible(false);
                        fetchNui("hideFrame");
                        fetchNui("reportmenu:nuicb:sendreport", reportData);
                        setReportData(initialReportData);
                    }}
                >
                    <div className="w-full h-full">
                        <div className="grid grid-cols-2 mt-2 gap-4">
                            <Input
                                type="text"
                                className="outline-none text-sm font-main w-full h-full border-[2px] bg-background ml-auto py-2 rounded transition-all"
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

                            <ReportTypeSelect
                                reportData={reportData}
                                setReportData={setReportData}
                            />

                            <Input
                                type="text"
                                className="outline-none col-span-2 font-main w-full h-full border-[2px] bg-background ml-auto p-2 rounded transition-all"
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

                            <div className="w-full h-full flex col-span-2 items-center justify-center">
                                <div className="items-center flex space-x-3 border w-full p-[6px] rounded-[8px] hover:cursor-pointer hover:border-primary transition-all z-20">
                                    <Checkbox
                                        id="checkbox1"
                                        checked={
                                            reportData.reportNearestPlayers
                                        }
                                        onCheckedChange={(checked) => {
                                            const data = {
                                                ...reportData,
                                                reportNearestPlayers: checked,
                                            };
                                            setReportData(data);
                                        }}
                                    />
                                    <div className="grid gap-[2px] hover:!cursor-pointer w-full leading-none">
                                        <label
                                            htmlFor="checkbox1"
                                            className="text-sm font-medium hover:!cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Send players near you?
                                        </label>
                                        <label
                                            htmlFor="checkbox1"
                                            className="text-xs hover:!cursor-pointer text-muted-foreground"
                                        >
                                            Sends a list of every player near
                                            you in the report details.
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <Button
                                className="text-sm gap-1 font-bold font-geist rounded-[2px] m-0 border-[2px] col-span-2"
                                type="submit"
                            >
                                Submit Report
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ReportModal;
