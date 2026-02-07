import React from 'react'
import { HiOutlineUsers } from "react-icons/hi2";
import { IoIosArrowRoundUp } from "react-icons/io";
import { MdOutlineShoppingCart } from "react-icons/md";
import { HiOutlineGift } from "react-icons/hi2";
import { FaMoneyBills } from "react-icons/fa6";
import BarsDataset from '@/components/BarChat';
import Combining from '@/components/Trade';




const page = () => {
  return (
    <div className='dashboard_landing'>
      <div className="dashboard_landing_container">
        <div className="datas">
          <div className="customers">
            <span>
              <HiOutlineGift />
            </span>
            <p className='mt-10 text-sm'>Sales</p>
            <div className='numbers_data'>
              <h1>782</h1>
              <div className="percentyle">
                <IoIosArrowRoundUp className='text-xl' /> 
                <p>11.01%</p>
              </div>
            </div>
          </div>
          <div className="customers">
            <span>
              <FaMoneyBills />
            </span>
            <p className='mt-10 text-sm'>Income</p>
            <div className='numbers_data'>
              <h1>$3,782</h1>
              <div className="percentyle">
                <IoIosArrowRoundUp className='text-xl' /> 
                <p>11.01%</p>
              </div>
            </div>
          </div>
          <div className="customers">
            <span>
              <HiOutlineUsers />
            </span>
            <p className='mt-10 text-sm'>Customers</p>
            <div className='numbers_data'>
              <h1>3,782</h1>
              <div className="percentyle">
                <IoIosArrowRoundUp className='text-xl' /> 
                <p>11.01%</p>
              </div>
            </div>
          </div>
          <div className="customers">
            <span>
              <MdOutlineShoppingCart />
            </span>
            <p className='mt-10 text-sm'>Orders</p>
            <div className='numbers_data'>
              <h1>200</h1>
              <div className="percentyle negative"> {/* Add negative class for downward trends */}
                <IoIosArrowRoundUp className='text-xl' /> 
                <p>11.01%</p>
              </div>
            </div>
          </div>
        </div>
        <div className="target_container">
          <div className="target">
            <BarsDataset />
          </div>
        </div>
      </div>
      <div className="target_container">
        <div className="target">
          <Combining />
        </div>
      </div>
    </div>
  )
}

export default page