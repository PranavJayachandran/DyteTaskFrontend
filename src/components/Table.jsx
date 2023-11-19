import React, { useCallback, useEffect, useState } from "react";
import Row from "./Row";
import { boxStyle, getStyles } from "../utils/styleSelector";
import {
  addData,
  getData,
  initDB,
  queryLogsByIndex,
} from "../hooks/useIndexedDB";

function Table() {
  const columnNames = [
    "level",
    "message",
    "resourceId",
    "timeStamp",
    "traceId",
    "spanId",
    "commit",
    "parentResourceId",
  ];
  const [selectedIndex, setSelectedIndex] = useState("levelIndex");
  const [selectedValue, setSelectedValue] = useState("");
  const [queryParams, setQueryParams] = useState([]);
  const [logs, setLogs] = useState([]);
  const fetchData = useCallback(async () => {
    const status = await initDB();
    console.log(status.newDb);
    if (status.newDb === true) {
      var requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      fetch("http://localhost:3000", requestOptions)
        .then((response) => response.json())
        .then(async (result) => {
          try {
            const res = await addData("Logs", result);
          } catch (err) {
            if (err instanceof Error) {
              console.error(err);
            } else {
              console.log("Something went wrong");
            }
          }
          setLogs(result);
        })
        .catch((error) => console.log("error", error));
    } else {
      setLogs(await getData("Logs"));
    }
  }, [initDB, addData, setLogs]);

  const getDataByIndex = async () => {
    console.log("Called");
    let temp = queryParams;
    temp.push({ indexName: selectedIndex, value: selectedValue });

    setLogs(await queryLogsByIndex(temp));
    setQueryParams(temp);
    setSelectedIndex("levelIndex");
    setSelectedValue("");
  };
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return (
    <div className="flex flex-col justify-center items-center">
      <div>
        {queryParams.map(({ indexName, value }) => (
          <div className="flex gap-10">
            <div>{indexName}</div>
            <div>{value}</div>
          </div>
        ))}
      </div>
      <div className="flex mb-4 gap-10">
        <div className="flex gap-10 justify-center items-center">
          <label htmlFor="selectField">Select Field To Query :</label>
          <select
            value={selectedIndex}
            onChange={(e) => setSelectedIndex(e.target.value)}
          >
            <option value="levelIndex">level</option>
            <option value="messageIndex">message</option>
            <option value="resourceIdIndex">resourceId</option>
            <option value="timeStampIndex">timeStamp</option>
            <option value="traceIdIndex">traceId</option>
            <option value="spanIdIndex">spanId</option>
            <option value="commitIndex">commit</option>
            <option value="parentResourceIdIndex">parentResourceId</option>
          </select>
        </div>
        <div>
          <label htmlFor="selectField">QueryValue</label>
          <input
            value={selectedValue}
            onChange={(e) => {
              setSelectedValue(e.target.value);
            }}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 text-sm"
            onClick={getDataByIndex}
          >
            Search
          </button>
        </div>
      </div>
      <div className="flex">
        {columnNames.map((item) => (
          <div
            className={`border-r border-y border-black bg-gray-100 ${getStyles(
              item
            )} ${boxStyle()}`}
          >
            {item}
          </div>
        ))}
      </div>
      <div>
        {logs.map((item, index) => (
          <Row key={index} log={item} index={index} />
        ))}
      </div>
    </div>
  );
}

export default Table;
