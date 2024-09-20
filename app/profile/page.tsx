import GitHubContributionGraph from "./GitHubContributionCard";
import { currentUser } from "@clerk/nextjs/server";
import { retrieveUser } from "@/mongodb/user";
import Image from "next/image";
import Spline from "@splinetool/react-spline";
import { SPLINE_URLS } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export default async function Page() {
    const user = await currentUser();
    const userData = await retrieveUser(user?.username || "");
    const avatar = user?.imageUrl;


    return (
        <div className="container mx-auto">
            {/* First Row: Spline Image and Bio */}
            <div className="flex flex-col md:flex-row items-center justify-between border p-4 rounded-xl mt-4">
                <div className="h-48 w-48 md:h-96 md:w-96 rounded-full mx-auto md:mx-0">
                    <Spline className="rounded-full" scene={SPLINE_URLS.PROFILE} />
                </div>

                <div className="mt-4 md:mt-0 md:ml-8 flex-1 md:px-12 my-4">
                    <div className="px-4">
                        <h1 className="text-3xl font-bold mb-2">{userData?.name || "User"}</h1>
                        <p>{userData?.bio || "No bio available"}</p>
                    </div>
                    {/* Second Row: GitHub Contribution Graph */}
                    <GitHubContributionGraph githubUsername={user?.username || ""} />
                    <div className="px-4 pt-4">
                        <Button className="rounded-full mt-4">Edit Profile</Button>
                    </div>
                </div>
            </div>



            {/* Third Row: Experience */}
            <div className="mt-8">
                <h3>Experience</h3>
                {/* Add experience content here */}
            </div>

            {/* Fourth Row: Education */}
            <div className="mt-8">
                <h3>Education</h3>
                {/* Add education content here */}
            </div>

            {/* Fifth Row: Projects */}
            <div className="mt-8">
                <h3>Projects</h3>
                {/* Add projects content here */}
            </div>
        </div>
    );
}