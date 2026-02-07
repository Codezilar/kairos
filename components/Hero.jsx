"use client";
import React from "react";
import { BackgroundBeams } from "./ui/background-beams"; 
import Image from "next/image";

export function Hero() {
  return (
    <div
      className="h-[100vh] mt-[5rem] w-full rounded-md relative flex flex-col items-center justify-center antialiased hero">
      <div className="max-w-[1024px] flex flex-col items-center relative w-full mx-auto p-4">
        <h1
          className="relative z-10 text-center font-sans font-bold logo">
          ONE STOP SHOP
        </h1>
        <p></p>
        <p className="text-neutral-100 mx-auto my-2 text-xl text-center relative z-10">
          Welcome to ONE STOP SHOP, where smart shopping begins. Discover a seamless online marketplace built to give you more choice, better prices, and zero stress. From everyday essentials to must-have products, we bring quality, convenience, and value together in one trusted destination
        </p>
        <Image src={"/onestopshop.png"} alt="One Stop Shop" width={100} height={100} className="z-10"/>
      </div>
      <BackgroundBeams />
    </div>
  );
}
