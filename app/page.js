"use client";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { useContext } from "react";
import { UserDetailContext } from "./_context/UserDetailContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const { userDetail } = useContext(UserDetailContext);
  const router = useRouter();

  const handleClick = () => {
    router.push("/admin");
  };
  return (
    <div className="h-screen" data-theme={userDetail.admintheme}>
      <div className="">
        <Image
          src="/images/PYh.gif"
          alt="Welcome Gif"
          width={300}
          height={300}
          className="item-start rounded-lg"
        />
      </div>
      <div className="flex flex-col items-center justify-center">
        <h2 className=" text-4xl md:text-5xl lg:text-6xl font-bold border border-primary p-16 rounded-lg">
          Welcome to Craftfolio!
        </h2>
      </div>
      <div className="flex justify-end py-20 mr-4">
        <button className="btn btn-primary " onClick={handleClick}>
          {"Home Page-->"}{" "}
        </button>
      </div>
    </div>
  );
}
