import React from "react";
import { Link } from "react-scroll";

function Navbar() {
  return (
    <div className="fixed top-0 left-0 w-full flex border space-x-8 items-center pl-3 py-5 bg-transperant shadow-md z-50">
      <Link
        to="banner"
        smooth={true}
        duration={500}
        className="cursor-pointer font-bold"
      >
        Home
      </Link>
      <Link
        to="about"
        smooth={true}
        duration={500}
        className="cursor-pointer font-bold"
      >
        About
      </Link>
      <Link
        to="prediction"
        smooth={true}
        duration={500}
        className="cursor-pointer font-bold"
      >
        Predict Recipe
      </Link>

      <Link
        to="#"
        smooth={true}
        duration={500}
        className="cursor-pointer font-bold"
      >
        History
      </Link>
    </div>
  );
}

export default Navbar;
