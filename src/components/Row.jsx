import React from "react";
import { boxStyle, getStyles } from "../utils/styleSelector";

function Row({ log, index }) {
  return (
    <div className={`flex text-gray-600`}>
      <div className={`${getStyles("level")} ${boxStyle()}`}>{log.level}</div>
      <div className={`${getStyles("message")} ${boxStyle()}`}>
        {log.message}
      </div>
      <div className={`${getStyles("resourceId")} ${boxStyle()}`}>
        {log.resourceId}
      </div>
      <div className={`${getStyles("timestamp")} ${boxStyle()}`}>
        {log.timestamp}
      </div>
      <div className={`${getStyles("traceId")} ${boxStyle()}`}>
        {log.traceId}
      </div>
      <div className={`${getStyles("spanId")} ${boxStyle()}`}>{log.spanId}</div>
      <div className={`${getStyles("commit")} ${boxStyle()}`}>{log.commit}</div>
      <div className={`${getStyles("parentResourceId")} ${boxStyle()} `}>
        {log.parentResourceId}
      </div>
    </div>
  );
}

export default Row;
