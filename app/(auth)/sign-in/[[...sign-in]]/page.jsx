import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-black" >
      <div className="relative flex items-center justify-center  text-white  bg-black w-full md:w-1/2 p-4 my-5 bg-[url('/images/stars.gif')]" >
        <div className="text-center z-10">
          <h1 className="text-4xl font-bold my-3 text-amber-300">CraftFolio</h1>
          <h2 className="text-2xl font-bold">where you</h2>
          <div className="flex gap-2">
            <h2 className="text-2xl font-bold text-yellow-300">
              Craft your Portfolio !
            </h2>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center w-full md:w-1/2 p-4 h-screen bg-[url('/images/stars.gif')]" data-theme="dark">
        <SignIn path="/sign-in" />
      </div>
    </div>
  );
}
