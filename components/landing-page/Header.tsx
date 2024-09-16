"use client"
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import Spline from "@splinetool/react-spline";
import { SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { SPLINE_URL } from "@/lib/constants";

export default function Header() {
    const { isSignedIn } = useUser();
    return (
        <header
            className="flex flex-col md:flex-row container mx-auto min-h-screen max-w-7xl items-center p-4 md:p-8 overflow-hidden"
        >
            <div className="w-full flex flex-col justify-center items-center md:items-start gap-4 md:gap-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-center md:text-left bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
                        DevPolish
                    </h1>
                    <h2 className="text-lg md:text-xl lg:text-2xl text-center md:text-left text-gray-300">
                        Boost your career with our AI-powered tools.
                    </h2>
                </div>
                <p className="max-w-md text-center md:text-left text-sm md:text-base text-gray-400">
                    Elevate your dev career with AI-powered tools. Craft stunning portfolios,
                    generate tailored cover letters, and connect with top employers.
                    Your next big opportunity starts here.
                </p>
                {isSignedIn ? (
                    <Button className="rounded">
                        <Link href="/resume-review" className="flex items-center w-full">
                            Get Started
                            <ArrowRight className="ml-2" />
                        </Link>
                    </Button>
                ) : (
                    <SignInButton mode="modal">
                        <Button className="rounded">
                            Get Started
                            <ArrowRight className="ml-2" />
                        </Button>
                    </SignInButton>
                )}

            </div>

            <div className="w-full h-[650px]">
                <Spline
                    className="w-full h-full pointer-events-none rounded-2xl"
                    scene={SPLINE_URL}
                />
            </div>
        </header>
    )
}