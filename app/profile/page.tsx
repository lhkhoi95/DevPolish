import GitHubContributionGraph from "./GitHubContributionCard";
import { currentUser } from "@clerk/nextjs/server";
import { retrieveUser } from "@/mongodb/user";

export default async function Page() {
    const user = await currentUser();
    const userData = await retrieveUser(user?.username || "");
    console.log(userData)



    return (
        <>
            <h1>Profile</h1>
            <GitHubContributionGraph githubUsername={user?.username || ""} />
        </>
    );
}