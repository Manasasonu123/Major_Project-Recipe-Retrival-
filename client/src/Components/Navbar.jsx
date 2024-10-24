// import React, { useState } from "react";
// import { Link } from "react-scroll";
// import Dropdown from "./Dropdown"

// function Navbar() {
//   const [open,setopen]=useState(false);
//   return (
//     <div className="fixed top-0 left-0 w-full flex border space-x-8 items-center pl-3 py-5 bg-transperant shadow-md z-50">
//       <Link
//         to="banner"
//         smooth={true}
//         duration={500}
//         className="cursor-pointer font-bold"
//       >
//         Home
//       </Link>
//       <Link
//         to="about"
//         smooth={true}
//         duration={500}
//         className="cursor-pointer font-bold"
//       >
//         About
//       </Link>
//       <Link
//         to="prediction"
//         smooth={true}
//         duration={500}
//         className="cursor-pointer font-bold"
//       >
//         Predict Recipe
//       </Link>

//       <Link
//         to="#"
//         smooth={true}
//         duration={500}
//         className="cursor-pointer font-bold"
//       onclick={()=>setopen((prev)=>!prev)}>
//         Food-Types
//         {
//           open && <Dropdown/>(

//           )
//         }

//       </Link>

//       <Link
//         to="#"
//         smooth={true}
//         duration={500}
//         className="cursor-pointer font-bold"
//       >
//         History
//       </Link>
//     </div>
//   );
// }

// export default Navbar;

import React, { useState } from "react";
import { Link } from "react-scroll";
import Dropdown from "./Dropdown";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setOpen((prev) => !prev); // Toggle dropdown state
  };

  const handleHomeClick = () => {
    navigate("/dashboard"); // Navigate to the dashboard on click
  };

  return (
    <div className="fixed top-0 left-0 w-full flex border space-x-8 items-center pl-3 py-5 bg-transparent shadow-md z-50">
      {/* <Link
        to="banner"
        smooth={true}
        duration={500}
        className="cursor-pointer font-bold"
      >
        Home
      </Link> */}
      <button
        onClick={handleHomeClick} // Use onClick to handle navigation
        className="cursor-pointer font-bold"
      >
        Home
      </button>
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

      {/* Food-Types dropdown */}
      <div className="relative">
        <button
          onClick={toggleDropdown} // Correctly assign the click handler
          className="cursor-pointer font-bold"
        >
          Food-Types
        </button>
        {open && <Dropdown />} {/* Conditionally render Dropdown */}
      </div>

      <Link
        to="#"
        smooth={true}
        duration={500}
        className="cursor-pointer font-bold"
      >
        History
      </Link>
      <div className="ml-auto">
        <Link
          to="#"
          smooth={true}
          duration={500}
          className="bg-red-500 text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-red-600"
        >
          Logout
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
