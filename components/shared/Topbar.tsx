import { SignedIn, SignOutButton, UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Topbar = () => {
  return (
    <nav className="topbar ">
      <Link href={"/"} className="flex items-center gap-4 ">
        <Image src={"/assets/logo.svg"} alt="LOGO" width={28} height={28} />
        <p className="text-heading3-bold text-light-1 mx-xs:hidden">Threads</p>
      </Link>

      <div className="flex items-center gap-1">
        <div className="block md:hidden">
          <SignedIn>
            <SignOutButton>
              <div className="flex cursor-pointer">
                <Image
                  src={"/assets/logout.svg"}
                  alt="LOGO"
                  width={28}
                  height={28}
                />
              </div>
            </SignOutButton>
          </SignedIn>
        </div>

        <UserButton
          appearance={{
            baseTheme: dark,
          }}
        />
      </div>
    </nav>
  );
};

export default Topbar;
