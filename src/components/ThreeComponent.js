import React, { useEffect, useRef, useState } from "react";
import MainThreeScene from "../Classes/MainThreeScene";
import Logo from "../assets/images/logo-black-removebg-preview.png";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const ThreeComponent = () => {
  const threeContainerRef = useRef(null);
  const otherRef = useRef(null);
  const buttonRef = useRef(null);
  const [isScrollable, setIsScrollable] = useState(true);
  useEffect(() => {
    MainThreeScene.init(
      threeContainerRef.current,
      otherRef.current,
      buttonRef.current
    );
  }, []);

  const onScrollableChange = () => {
    MainThreeScene.scrollableHandlerChange(!isScrollable);
    setIsScrollable(!isScrollable);
  };
  return (
    <>
      <div ref={threeContainerRef} className="three-container">
        <div className="content">
          <div className="top-container">
            <img className="logo" src={Logo} alt="logo" />
          </div>
          <div className="bottom-container">
            <div className="buttons-container">
              <button ref={buttonRef} onClick={onScrollableChange}>
                {isScrollable ? "Loop Animation" : "Scrollable Animation"}
              </button>
            </div>
            <h3>
              Animation by{" "}
              <span>
                <a
                  href="https://www.instagram.com/adamationss/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Adamationss
                </a>
              </span>
            </h3>
          </div>
        </div>
      </div>
      <div ref={otherRef} className="other-component"></div>
    </>
  );
};

export default ThreeComponent;
