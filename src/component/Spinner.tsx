import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface Spinner {
    className?: string;
}

export default function Spinner({ className }: Spinner) {
    return (
        <FontAwesomeIcon icon={faCircleNotch} className={`animate-spin w-8 h-8 text-[#64748b] ` + className} />
    )
}