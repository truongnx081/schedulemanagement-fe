import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface Props {
  title: string;
  titleClassName?: string;
  className?: string;
  disableIcon?: boolean;
}

export default function TitleHeader({
  title,
  titleClassName = "text-[1.25rem] font-medium",
  className,
  disableIcon = false,
}: Props) {
  return (
    <div className={"flex justify-between items-center w-full " + className}>
      <h1 className={titleClassName}>{title}</h1>
      {disableIcon ? null : (
        <FontAwesomeIcon
          icon={faEllipsis}
          className="w-5 text-textSecondary md:block hidden"
        />
      )}
    </div>
  );
}
