import React, { useCallback, useEffect, useState } from "react";
import Row from "./Row";
import { boxStyle, getStyles } from "../utils/styleSelector";
import { addData, getData, initDB } from "../hooks/useIndexedDB";

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

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return (
    <div className="flex flex-col justify-center items-center">
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
