/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useRef, useState } from "react";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { sidebarStructure } from "./Structure.ts";
import { Link } from 'react-router-dom';
import { getUserScope } from '../../utils/authUtils.ts';
import { ROLE } from '../../enum/Role.tsx'

interface SidebarProps {
  setExpand: (value: boolean) => void;
}

const Sidebar: FC<SidebarProps> = ({ setExpand }) => {
  const username = "Miles Heizer";
  const company = "Unilever";
  const profilePic =
    "https://variety.com/wp-content/uploads/2021/04/Avatar.jpg?w=800&h=533&crop=1";
  const link = "/";

  const [openedMenu, setOpenedMenu] = useState<Record<string, any>>({});
  const [activeName, setActiveName] = useState("");
  const activeLink = window.location.pathname;

  const listRef = useRef<Record<string, HTMLUListElement | null>>({});

  const [isExpand, setIsExpand] = useState(true);
  const [isExpandOnHover, setIsExpandOnHover] = useState(false);

  const userRoles = getUserScope() ?? ROLE.STUDENT; // Lấy vai trò người dùng từ token

  const handleHoverExpand = (value: boolean) => {
    if (!isExpand) {
      setIsExpandOnHover(value);
    }
  };

  const handleNavigate = (path: string) => {
    setActiveName(path);
  };

  const handleToggle = (name: string) => {
    const rootEl = name.split(".")[0];

    setOpenedMenu((prevState) => {
      const newState = Object.keys(prevState).reduce((acc, key) => {
        // Đóng tất cả các menu và submenu ngoại trừ menu hiện tại và menu cha
        acc[key] = {
          open: false,
          height: "0px",
        };
        return acc;
      }, {} as typeof prevState);

      // Kiểm tra nếu menu hiện tại đang mở
      const isCurrentlyOpen = prevState[name]?.open;

      // Nếu menu hiện tại đang mở, đóng nó. Ngược lại, mở nó.
      newState[name] = {
        open: !isCurrentlyOpen,
        height: !isCurrentlyOpen
          ? `${listRef.current[name]?.scrollHeight || 0}px`
          : "0px",
      };

      // Nếu menu hiện tại không mở, đảm bảo menu cha vẫn mở
      if (!isCurrentlyOpen) {
        newState[rootEl] = {
          open: true,
          height: `${listRef.current[rootEl]?.scrollHeight || 0}px`,
        };
      }

      return newState;
    });
  };

  const generateIcon = (icon: string) => {
    var icons_map: Record<string, JSX.Element> = {};

    icons_map["dasbor"] = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 576 512"
        className="h-5 w-5 text-current"
        fill="currentColor"
      >
        <path d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"
        /></svg>
    );
    icons_map["transaksi"] = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-current"
        viewBox="0 0 24 24"
      >
        <path
          d="m20.247634 1c1.0125221 0 1.8333334.82081129 1.8333334 1.83333333s-.8208113 1.83333334-1.8333334 1.83333334c-.3158442 0-.6130339-.07986936-.8724738-.22051281l-3.0249251 3.47961717c.1346337.25513483.2108509.5458717.2108509.85441003 0 1.01252204-.8208113 1.83333334-1.8333334 1.83333334-.9820883 0-1.7838173-.7722101-1.8311257-1.74256896l-2.2033918-.75849737c-.336256.40778098-.84535009.66773299-1.41515923.66773299-.32712483 0-.63423886-.08567643-.90012689-.2358141l-2.87560465 2.41277624c.05416355.1730906.08335496.3572185.08335496.5481644 0 1.012522-.8208113 1.8333333-1.83333334 1.8333333s-1.83333333-.8208113-1.83333333-1.8333333c0-1.0125221.82081129-1.83333335 1.83333333-1.83333335.33090488 0 .64133381.08766791.90932763.24104456l2.86960725-2.40787374c-.05621505-.1760311-.0865583-.3636207-.0865583-.55829735 0-1.01252204.8208113-1.83333333 1.83333334-1.83333333.97577423 0 1.77350093.76231258 1.83011983 1.7238777l2.2160025.76325559c.336304-.39976002.8402621-.65379996 1.4035544-.65379996.2130474 0 .4176071.03634016.6078186.10315996l3.1693503-3.64581344c-.0588143-.17965899-.0906208-.37154554-.0906208-.57086091 0-1.01252204.8208113-1.83333333 1.8333333-1.83333333z"
          opacity=".48"
          fill="currentColor"
        />
        <path
          d="m21.1666667 9.60855714c.506261 0 .9166666.41040566.9166666.91666666v10.7540685c0 .2761423-.2238576.5-.5.5h-2.6666666c-.2761424 0-.5-.2238577-.5-.5v-10.7540685c0-.506261.4104056-.91666666.9166666-.91666666zm-5.5 6.42549146c.506261 0 .9166666.4104057.9166666.9166667v4.328577c0 .2761423-.2238576.5-.5.5h-2.6666666c-.2761424 0-.5-.2238577-.5-.5v-4.328577c0-.506261.4104056-.9166667.9166666-.9166667zm-5.5-1.8405511c.506261 0 .9166666.4104057.9166666.9166667v6.1691281c0 .2761423-.2238576.5-.5.5h-2.66666663c-.27614238 0-.5-.2238577-.5-.5v-6.1691281c0-.506261.41040564-.9166667.91666666-.9166667zm-5.50000003 4.7135227c.50626102 0 .91666666.4104057.91666666.9166667v1.4556054c0 .2761423-.22385762.5-.5.5h-2.66666666c-.27614238 0-.5-.2238577-.5-.5v-1.4556054c0-.506261.41040564-.9166667.91666666-.9166667z"
          fill="currentColor"
        />
      </svg>
    );
    icons_map["study"] = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 512"
        className="h-5 w-5 text-current"
        fill="currentColor"
      ><path d="M320 32c-8.1 0-16.1 1.4-23.7 4.1L15.8 137.4C6.3 140.9 0 149.9 0 160s6.3 19.1 15.8 22.6l57.9 20.9C57.3 229.3 48 259.8 48 291.9l0 28.1c0 28.4-10.8 57.7-22.3 80.8c-6.5 13-13.9 25.8-22.5 37.6C0 442.7-.9 448.3 .9 453.4s6 8.9 11.2 10.2l64 16c4.2 1.1 8.7 .3 12.4-2s6.3-6.1 7.1-10.4c8.6-42.8 4.3-81.2-2.1-108.7C90.3 344.3 86 329.8 80 316.5l0-24.6c0-30.2 10.2-58.7 27.9-81.5c12.9-15.5 29.6-28 49.2-35.7l157-61.7c8.2-3.2 17.5 .8 20.7 9s-.8 17.5-9 20.7l-157 61.7c-12.4 4.9-23.3 12.4-32.2 21.6l159.6 57.6c7.6 2.7 15.6 4.1 23.7 4.1s16.1-1.4 23.7-4.1L624.2 182.6c9.5-3.4 15.8-12.5 15.8-22.6s-6.3-19.1-15.8-22.6L343.7 36.1C336.1 33.4 328.1 32 320 32zM128 408c0 35.3 86 72 192 72s192-36.7 192-72L496.7 262.6 354.5 314c-11.1 4-22.8 6-34.5 6s-23.5-2-34.5-6L143.3 262.6 128 408z"
        /></svg>
    );

    icons_map["pusatunduhdata"] = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-current"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-5L9 4H4zm7 5a1 1 0 10-2 0v1.586l-.293-.293a1 1 0 10-1.414 1.414l2 2 .002.002a.997.997 0 001.41 0l.002-.002 2-2a1 1 0 00-1.414-1.414l-.293.293V9z"
        />
      </svg>
    );
    icons_map["users"] = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 512"
        className="h-5 w-5 text-current"
        fill="currentColor"
      >
        <path d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352l117.3 0C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7l-330.7 0c-14.7 0-26.7-11.9-26.7-26.7z"
        /></svg>
    );
    icons_map["clazz"] = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 512"
        className="h-5 w-5 text-current"
        fill="currentColor"
      >
        <path d="M337.8 5.4C327-1.8 313-1.8 302.2 5.4L166.3 96 48 96C21.5 96 0 117.5 0 144L0 464c0 26.5 21.5 48 48 48l208 0 0-96c0-35.3 28.7-64 64-64s64 28.7 64 64l0 96 208 0c26.5 0 48-21.5 48-48l0-320c0-26.5-21.5-48-48-48L473.7 96 337.8 5.4zM96 192l32 0c8.8 0 16 7.2 16 16l0 64c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-64c0-8.8 7.2-16 16-16zm400 16c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 64c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-64zM96 320l32 0c8.8 0 16 7.2 16 16l0 64c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-64c0-8.8 7.2-16 16-16zm400 16c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 64c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-64zM232 176a88 88 0 1 1 176 0 88 88 0 1 1 -176 0zm88-48c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-16 0 0-16c0-8.8-7.2-16-16-16z"
        /></svg>
    );
    icons_map["learning-outcomes"] = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 576 512"
        className="h-5 w-5 text-current"
        fill="currentColor"
      >
        <path d="M249.6 471.5c10.8 3.8 22.4-4.1 22.4-15.5l0-377.4c0-4.2-1.6-8.4-5-11C247.4 52 202.4 32 144 32C93.5 32 46.3 45.3 18.1 56.1C6.8 60.5 0 71.7 0 83.8L0 454.1c0 11.9 12.8 20.2 24.1 16.5C55.6 460.1 105.5 448 144 448c33.9 0 79 14 105.6 23.5zm76.8 0C353 462 398.1 448 432 448c38.5 0 88.4 12.1 119.9 22.6c11.3 3.8 24.1-4.6 24.1-16.5l0-370.3c0-12.1-6.8-23.3-18.1-27.6C529.7 45.3 482.5 32 432 32c-58.4 0-103.4 20-123 35.6c-3.3 2.6-5 6.8-5 11L304 456c0 11.4 11.7 19.3 22.4 15.5z"
        /></svg>
    );
    icons_map["help"] = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        className="h-5 w-5 text-current"
        fill="currentColor"
      >
        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3l58.3 0c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24l0-13.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1l-58.3 0c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"
        /></svg>
    );
    icons_map["calendar"] = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        className="h-5 w-5 text-current"
        fill="currentColor"
      >
        <path d="M128 0c17.7 0 32 14.3 32 32l0 32 128 0 0-32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 32 48 0c26.5 0 48 21.5 48 48l0 48L0 160l0-48C0 85.5 21.5 64 48 64l48 0 0-32c0-17.7 14.3-32 32-32zM0 192l448 0 0 272c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 192zm64 80l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm128 0l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zM64 400l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zm112 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16z"
        /></svg>
    );
    icons_map["find"] = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        className="h-5 w-5 text-current"
        fill="currentColor"
      >
        <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
        /></svg>
    );
    icons_map["teach"] = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 512"
        className="h-5 w-5 text-current"
        fill="currentColor"
      >
        <path d="M160 64c0-35.3 28.7-64 64-64L576 0c35.3 0 64 28.7 64 64l0 288c0 35.3-28.7 64-64 64l-239.2 0c-11.8-25.5-29.9-47.5-52.4-64l99.6 0 0-32c0-17.7 14.3-32 32-32l64 0c17.7 0 32 14.3 32 32l0 32 64 0 0-288L224 64l0 49.1C205.2 102.2 183.3 96 160 96l0-32zm0 64a96 96 0 1 1 0 192 96 96 0 1 1 0-192zM133.3 352l53.3 0C260.3 352 320 411.7 320 485.3c0 14.7-11.9 26.7-26.7 26.7L26.7 512C11.9 512 0 500.1 0 485.3C0 411.7 59.7 352 133.3 352z"
        /></svg>
    );

    return icons_map[icon];
  };

  // Lọc các mục trong sidebar dựa trên vai trò của người dùng
  const filterSidebarByRole = (structure, userRoles) => {
    return structure
      .map(item => {
        // Kiểm tra vai trò cho mục con (nếu có)
        const children = item.child ? filterSidebarByRole(item.child, userRoles) : null;

        // Kiểm tra nếu ít nhất một vai trò của người dùng phù hợp với vai trò yêu cầu của mục
        if (item.role.some(role => userRoles.includes(role))) {
          return {
            ...item,
            child: children // Chỉ thêm các mục con đã lọc
          };
        }

        return null;
      })
      .filter(item => item !== null); // Loại bỏ các mục không có quyền
  };

  const generateMenu = (item: any, index: number, recursive: number = 0) => {
    // Kiểm tra quyền truy cập vào mục dựa trên `role`
    const hasPermission = item.role.some(role => userRoles.includes(role));

    // Bỏ qua render nếu người dùng không có quyền truy cập vào mục
    if (!hasPermission) return null;

    if (activeName === "" && activeLink.includes(item.link)) {
      setActiveName(item.name);
    }
    const classesActive = activeName === item.name ? "active" : "";

    return (
      <li key={index}>
        {item.link ? (
          // Nếu có `link`, sử dụng `Link` để điều hướng
          <Link
            to={item.link}
            role="button"
            tabIndex={0}
            id={item.id}
            onClick={() => handleNavigate(item.name)}
            onKeyDown={(event) => {
              if (event.code === "Space") {
                handleNavigate(item.name);
              }
            }}
            className={[
              "group m-0 flex cursor-pointer rounded-lg items-center justify-between h-12 py-0 pr-3 mb-1 focus:outline-none",
              recursive === 0 ? "pl-4" : recursive === 1 ? "pl-11" : "pl-16",
              activeName === item.name || activeName.split(".")[0] === item.name
                ? `text-blue-600 font-semibold ${item.parent ? "bg-blue-200/20 " : "bg-transparent"}`
                : `text-slate-500 ${item.parent && ""}`,
              "hover:bg-slate-300/20",
              classesActive
            ].join(" ")}
          >
            {/* Nội dung menu */}
            {generateMenuContent(item, classesActive, recursive)}
          </Link>
        ) : (
          // Nếu không có `link`, sử dụng `div` và ngăn điều hướng
          <div
            role="button"
            tabIndex={0}
            id={item.id}
            onClick={(event) => {
              event.preventDefault(); // Ngăn hành vi mặc định
              handleToggle(item.name);
            }}
            onKeyDown={(event) => {
              if (event.code === "Space") {
                event.preventDefault(); // Ngăn hành vi mặc định
                handleToggle(item.name);
              }
            }}
            className={[
              "group m-0 flex cursor-pointer rounded-lg items-center justify-between h-12 py-0 pr-3 mb-1 focus:outline-none",
              recursive === 0 ? "pl-4" : recursive === 1 ? "pl-11" : "pl-16",
              activeName === item.name || activeName.split(".")[0] === item.name
                ? `text-blue-600 font-semibold ${item.parent ? "bg-blue-200/20 " : "bg-transparent"}`
                : `text-slate-500 ${item.parent && ""}`,
              "hover:bg-slate-300/20",
              classesActive
            ].join(" ")}
          >
            {/* Nội dung menu */}
            {generateMenuContent(item, classesActive, recursive)}
            {"child" in item && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        )}
        {"child" in item ? (
          <ul
            ref={(el) => (listRef.current[item.name] = el)}
            className={[
              "overflow-hidden duration-300 ease-in-out",
              isExpand ? "" : isExpandOnHover ? "" : "h-0"
            ].join(" ")}
            style={{ maxHeight: `${openedMenu[item.name]?.height || "0px"}` }}
            key={item.name}
          >
            {item.child.map((value: any, idx: number) =>
              generateMenu(value, idx, recursive + 1)
            )}
          </ul>
        ) : (
          false
        )}
      </li>
    );
  };

  // Hàm render nội dung cho mục menu
  const generateMenuContent = (item: any, classesActive: string, recursive: number) => (
    <div className="flex items-center gap-3">
      {item.icon ? (
        item.icon === "dot" ? (
          <div className="h-3 w-3 flex items-center justify-center">
            <div
              className={[
                `${classesActive ? "h-2 w-2" : "h-1 w-1"}`,
                "bg-current rounded-full duration-200"
              ].join(" ")}
            ></div>
          </div>
        ) : (
          generateIcon(item.icon)
        )
      ) : null}
      <div
        className={`truncate ${isExpand ? "" : isExpandOnHover ? "" : "w-0 h-0 opacity-0"
          }`}
      >
        {item.title}
      </div>
    </div>
  );


  return (
    <aside id="logo-sidebar"
      role="navigation"
      className={[
        "fixed top-0 left-0 z-40 h-screen pt-20 bg-white border-r border-gray-200 md:translate-x-0",
        "duration-300 ease-in-out -translate-x-full",
        `${isExpand
          ? "bg-white w-72"
          : isExpandOnHover
            ? "bg-white w-72 backdrop-blur-md"
            : "bg-white w-20"
        }`
      ].join(" ")}
      aria-label="Sidebar">
      <div className="h-full pb-4 overflow-y-visible bg-white dark:bg-gray-800">
        <button
          className="absolute z-50 bottom-8 -right-3 bg-white hover:bg-slate-100 text-slate-500 p-1.5 rounded-full border border-slate-200 hidden md:block"
          onClick={() => {
            setIsExpand(!isExpand);
            setExpand(!isExpand);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`${isExpand ? "rotate-0" : "rotate-180"
              } transform duration-500 h-4 w-4`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <div
          onMouseEnter={() => handleHoverExpand(true)}
          onMouseLeave={() => handleHoverExpand(false)}
          className={`relative h-screen overflow-hidden`}
        >
          <SimpleBar style={{ height: "100%" }} autoHide >
            <div className="text-slate-500">
              <div className="mt-3 mb-10 p-0">
                <ul className="list-none text-sm font-normal px-3">
                  {sidebarStructure.map((item, index) =>
                    generateMenu(item, index)
                  )}
                </ul>
              </div>
            </div>
          </SimpleBar>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
