// Who cares, am i right or...
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Checkbox,
  Divider,
  Modal,
  Select,
  Tooltip,
} from "@mantine/core";
import { fetchNui } from "@/utils/fetchNui";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import { reportData } from "./App";

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
    <>
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

                  const typedValue = value as "Question" | "Bug" | "Gameplay";

                  const data: reportData = {
                    ...reportData,
                    type: typedValue,
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
              <Tooltip
                label="Notifies staff of players near you in the report."
                refProp="rootRef"
                className="font-main rounded-[2px] bg-secondary text-white"
                classNames={{
                  tooltip: "border-[2px]",
                }}
              >
                <Checkbox
                  label="Include nearest players"
                  onChange={(checked) => {
                    const data = {
                      ...reportData,
                      reportNearestPlayers: checked.currentTarget.checked,
                    };

                    setReportData(data);
                  }}
                />
              </Tooltip>
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

export default ReportModal;
