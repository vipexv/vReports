import React, { useEffect, useState } from "react";
import { ScrollArea } from "@mantine/core";

import "./App.css";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const activeReports = Array.from({ length: 100 }, (_, index) => ({
  id: index,
  type: "Report",
  description: "Very Very racist person!",
  title: `Title ${index}`,
  state: {
    concluded: false,
  },
}));

const Reports: React.FC = () => {
  return (
    <>
      <ScrollArea className="w-full h-full">
        <div className="grid grid-cols-2 m-5 sm:grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-4">
          {Object.values(activeReports).map((report, index) => {
            return (
              <>
                <div
                  key={index}
                  className="flex flex-col py-1 px-2  bg-secondary border-[2px] rounded text-white"
                >
                  <p className="flex items-center">
                    <span className="truncate max-w-[100px]">
                      [{report.id}] {report.title}
                    </span>
                    <span className="ml-auto bg-primary px-1 font-main">
                      {report.type}
                    </span>
                  </p>
                  <p className="text-xs text-white text-opacity-50 truncate max-w-[100px]">
                    {report.description}
                  </p>
                </div>
              </>
            );
          })}
        </div>
      </ScrollArea>
    </>
  );
};

export default Reports;
