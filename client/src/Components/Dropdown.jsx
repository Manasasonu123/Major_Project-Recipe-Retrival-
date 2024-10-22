import React from 'react'
import { useNavigate } from 'react-router-dom';

const Dropdown = () => {
    const navigate=useNavigate();
  return (
    <div className='flex flex-col Dropdown'>
        <ul className='flex flex-col gap-4'>
            <li onClick={() => navigate("/dashboard/indian")}>Indian Food</li>
            <li onClick={() => navigate("/dashboard/nonindian")}>Non-Indian Food</li>
        </ul>
    </div>
  )
}

export default Dropdown