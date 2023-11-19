export const getStyles = (columnName) => {
    switch (columnName) {
        case "level":
            return "border-l rounded-l-sm w-20";
        case "message":
            return "w-60";
        case "resourceId":
            return "w-40";
        case "timestamp":
            return "w-40 ";
        case "traceId":
            return "w-32";
        case "spanId":
            return "w-32";
        case "commit":
            return "w-20";
        case "parentResourceId":
            return "w-32 rounded-r-sm";
    }
};

export const boxStyle = () => {
    return "border-b text-sm border-r border-black px-[10px] py-2 h-10 overflow-hidden"
}

