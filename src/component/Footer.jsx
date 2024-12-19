import React, { useState, useEffect } from "react";
import icon from "../images/logo_fpt.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import nghia from '../images/nghia.jpg'
import logo from '../images/logo.png'
import hoc from '../images/hoc.jpg'
import truong from '../images/truong.jpg'
import phat from '../images/phat.jpg'
import hieu from '../images/hieu.jpg'
import nhu from '../images/nhu.jpg'

const Footer = () => {
  // const [flexCol, setFlexCol] = useState("flex-wrap");
  // const [widthFull, setWidthFull] = useState("w-1/3 pt-4");
  // const [marginBottom, setMarginBottom] = useState("mb-4");

  // useEffect(() => {
  //   const handleResize = () => {
  //     if (window.innerWidth <= 783) {
  //       setFlexCol("flex-col");
  //       setWidthFull("w-full mb-3 flex ");
  //       setMarginBottom("");
  //     } else {
  //       setFlexCol("flex-wrap");
  //       setWidthFull("w-1/3 pt-4");
  //       setMarginBottom("mb-6");
  //     }
  //   };
  //   window.addEventListener("resize", handleResize);
  //   // Kiểm tra kích thước màn hình khi component được mount
  //   handleResize();
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, [flexCol, widthFull]);

  return (
    <div className="w-full h-auto px-1">
      <div className="bg-white shadow-md rounded p-6">

        <footer className="border-t border-gray-200 py-6">
          <div
            className={`container ps-12 flex flex-col md:flex-row md:flex-wrap items-start`}
          >
            <div
              className={`w-full md:w-1/3 pt-0 md:pt-4 mb-3 md:mb-0 flex flex-row md:flex-col justify-start`}
            >
              <div className="w-36 mr-8">
                <img src={logo} alt="" className="h-28 w-full" />
              </div>
              <div className="">
                <p className="text-sm py-1">Công viên phần mềm Quang Trung</p>
                <p className="text-sm py-1">Quận 12, TP Hồ Chí Minh</p>
              </div>
            </div>
            <div
              className={`w-full md:w-1/3 pt-0 md:pt-4 mb-3 md:mb-0 flex flex-row md:flex-col justify-start`}
            >
              <p className={`w-36 font-semibold mr-8 mb-0 md:mb-6`}>
                Thông tin liên hệ
              </p>
              <div>
                <p className="text-sm py-1">
                  <FontAwesomeIcon icon={faPhone} style={{ fontSize: "12px" }} /> Số
                  điện thoại: <span className="text-blue-500">0287286789</span>
                </p>
                <p className="text-sm py-1">
                  <FontAwesomeIcon icon={faEnvelope} /> Email:{" "}
                  <span className="text-blue-500">giaidap@fe.edu.vn</span>
                </p>
              </div>
            </div>
            <div
              className={`w-full md:w-1/3 pt-0 md:pt-4 mb-3 md:mb-0 flex flex-row md:flex-col justify-start`}
            >
              <h3 className={`w-36 font-semibold mr-8 mb-0 md:mb-6`}>
                Đơn vị phát triển
              </h3>
              <div>
                <p className="mb-2 text-sm">
                  Sinh viên Cao Đẳng FPT Polytechnic Hồ Chí Minh
                </p>
                {/* Hình ảnh thành viên*/}
                <div className="flex">
                  <img
                    src={nghia}
                    alt="Hữu Nghĩa"
                    className="rounded-full w-10 h-10 -ml-2"
                  />
                  <img
                    src={hoc}
                    alt="Tiến Học"
                    className="rounded-full w-10 h-10 -ml-2"
                  />
                  <img
                    src={hieu}
                    alt="Trung Hiếu"
                    className="rounded-full w-10 h-10 -ml-2"
                  />
                  <img
                    src={phat}
                    alt="Vinh Phát"
                    className="rounded-full w-10 h-10 -ml-2"
                  />
                  <img
                    src={truong}
                    alt="Xuân Trường"
                    className="rounded-full w-10 h-10 -ml-2"
                  />
                  <img
                    src={nhu}
                    alt="Member 6"
                    className="rounded-full w-10 h-10 -ml-2"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* <div className='w-full p-3 mt-3 bg-black text-white'>
                <p>hhyukgyuk</p>
            </div> */}
        </footer>
      </div>
    </div>
  );
};

export default Footer;
