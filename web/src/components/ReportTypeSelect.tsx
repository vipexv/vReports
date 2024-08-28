/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { Combobox } from "@/components/ui/combobox"; // Adjust path as necessary

interface ReportTypeSelectProps {
    reportData: { type: string };
    setReportData: (data: any) => void;
}

export function ReportTypeSelect({
    reportData,
    setReportData,
}: ReportTypeSelectProps) {
    const options = [
        { value: "Question", label: "Question" },
        { value: "Bug", label: "Bug" },
        { value: "Gameplay", label: "Gameplay" },
    ];

    return (
        <Combobox
            options={options}
            value={reportData.type}
            onValueChange={(value) => {
                if (!value)
                    return console.log(
                        "[DEBUG] (ReportTypeSelect) value is null"
                    );

                const typedValue = value as "Question" | "Bug" | "Gameplay";
                setReportData({ ...reportData, type: typedValue });
            }}
            placeholder="Report Type"
            buttonClassName="bg-background border-[2px] w-full transition-all font-main text-white"
            inputPlaceholder="Search Report Type..."
        />
    );
}
