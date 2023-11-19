import React, { useEffect, useState } from "react";
import Row from "./Row";
import { boxStyle, getStyles } from "../utils/styleSelector";

function Table() {
  const columnNames = [
    "level",
    "message",
    "resourceId",
    "timestamp",
    "traceId",
    "spanId",
    "commit",
    "parentResourceId",
  ];

  const [logs, setLogs] = useState([]);
  useEffect(() => {
    setLogs([
      {
        level: "error",
        message: "Failed to connect to DB",
        resourceId: "server-1234",
        timestamp: "2023-09-15T08:00:00Z",
        traceId: "abc-xyz-123",
        spanId: "span-456",
        commit: "5e5342f",
        parentResourceId: "server-0987",
      },
      {
        level: "error",
        message: "Failed to connect to DB",
        resourceId: "server-1234",
        timestamp: "2023-09-15T08:00:00Z",
        traceId: "abc-xyz-123",
        spanId: "span-456",
        commit: "5e5342f",
        parentResourceId: "server-0987",
      },
      {
        level: "error",
        message: "Failed to connect to DB",
        resourceId: "server-1234",
        timestamp: "2023-09-15T08:00:00Z",
        traceId: "abc-xyz-123",
        spanId: "span-456",
        commit: "5e5342f",
        parentResourceId: "server-0987",
      },
      {
        level: "error",
        message: "Failed to connect to DB",
        resourceId: "server-1234",
        timestamp: "2023-09-15T08:00:00Z",
        traceId: "abc-xyz-123",
        spanId: "span-456",
        commit: "5e5342f",
        parentResourceId: "server-0987",
      },
      {
        level: "error",
        message: "Failed to connect to DB",
        resourceId: "server-1234",
        timestamp: "2023-09-15T08:00:00Z",
        traceId: "abc-xyz-123",
        spanId: "span-456",
        commit: "5e5342f",
        parentResourceId: "server-0987",
      },
      {
        level: "error",
        message: "Failed to connect to DB",
        resourceId: "server-1234",
        timestamp: "2023-09-15T08:00:00Z",
        traceId: "abc-xyz-123",
        spanId: "span-456",
        commit: "5e5342f",
        parentResourceId: "server-0987",
      },
    ]);
  }, []);
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
          <Row log={item} index={index} />
        ))}
      </div>
    </div>
  );
}

export default Table;
