import React, { useState } from "react";
import "./App.css";
import { LeaderboardData } from "./App";
import { Pagination } from "@mantine/core";

interface Props {
  leaderboardData: LeaderboardData[];
}

function chunk<T>(array: T[], size: number): T[][] {
  if (!array.length) {
    return [];
  }
  const head = array.slice(0, size);
  const tail = array.slice(size);
  return [head, ...chunk(tail, size)];
}

const Leaderboard: React.FC<Props> = ({ leaderboardData }) => {
  const [activePage, setActivePage] = useState(1);

  const sortedData = [...leaderboardData].sort(
    (a, b) => b.concludedReports - a.concludedReports
  );

  const data = chunk(sortedData, 10);

  const leaderboard = (
    <>
      <table>
        <thead className="rounded font-main">
          <tr>
            {/* <th className="text-center px-4 py-4">#</th> */}
            <th className="text-center px-4 py-4">
              <i className="fa-solid fa-signature" /> Player Name
            </th>
            <th className="text-center px-4 py-4">
              <i className="fa-brands fa-discord"></i> Reports Concluded
            </th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            <>
              {data[activePage - 1].map((player, index) => {
                return (
                  <tr
                    key={index}
                    className="bg-secondary border-[2px] rounded text-center font-main m-2 mt-1"
                  >
                    {/* <td>{player.name}</td> */}
                    <td className="px-4 py-2 rounded max-w-[150px] overflow-hidden overflow-ellipsis whitespace-nowrap">
                      {player.name}
                    </td>
                    <td className="px-4 py-2 rounded">
                      {player.concludedReports}
                    </td>
                  </tr>
                );
              })}
            </>
          ) : (
            <></>
          )}
        </tbody>
      </table>
    </>
  );

  return (
    <>
      <div className="w-full h-full">
        <div className="flex flex-col w-full h-full">{leaderboard}</div>

        <Pagination
          className="rounded font-main flex justify-center items-center"
          classNames={{
            control: "bg-secondary border border-[2px]",
          }}
          total={data.length}
          value={activePage}
          onChange={setActivePage}
          mt="sm"
        />
      </div>
    </>
  );
};

export default Leaderboard;
