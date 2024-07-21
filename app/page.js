"use client";
import Image from "next/image";
import { useContext } from "react";
import { UserDetailContext } from "./_context/UserDetailContext";
import { useRouter } from "next/navigation";
import { Search, ArrowUpRight, MousePointer } from "lucide-react";
export default function Home() {
  const { userDetail } = useContext(UserDetailContext);
  const router = useRouter();

  const handleClick = () => {
    if(userDetail){
      router.push("/admin");
    }else{
      router.push("/create")
    }
  };
  return (
    <div className="h-screen bg-[url('/images/stars.gif')]" data-theme={userDetail?.admintheme}>
        <Image
          src="/images/PYh.gif"
          alt="Welcome Gif"
          width={300}
          height={300}
          className="item-start rounded-lg"
        />
      <div className="flex flex-col items-center justify-center">
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold border border-primary p-8 rounded-lg text-center">
           Welcome to Craftify!
         </h2>
         {/* <p className="mt-4 text-xl md:text-2xl lg:text-3xl text-center font-semibold text-gray-300">
          Crafting your ideas into reality
        </p> */}
        <div className="relative flex flex-col items-center my-4 w-full">
          <label className="input input-bordered flex items-center gap-2 w-full max-w-md">
            <Search/>
            <input
            type="text"
            placeholder="Build a Portfolio"
            disabled
            className="text-xl"/>
          </label>
          {/* <div className="flex justify-center "> */}
          <MousePointer className="w-10 h-10 absolute top-8 "/>
          {/* </div> */}
        </div>
      </div>
      <div className="flex justify-end py-20 mr-4">
        <button className="btn btn-primary " onClick={handleClick}>
          {"Home-->"}
        </button>
      </div>
    </div>
  );
}





