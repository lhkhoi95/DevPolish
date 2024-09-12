"use client"
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignInButton, useUser, useClerk } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import Image from "next/image";
import { ROUTES } from "@/lib/constants";

export function Navbar() {
    const { isSignedIn, user } = useUser();
    const { signOut } = useClerk();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    return (
        <nav className="flex items-center justify-between p-4 bg-background">
            <div className="flex items-center space-x-4 hover:cursor-pointer hover:opacity-80">
                <Image src="/logo.png" alt="Logo" width={40} height={40} className="rounded-full" />
                <Link href="/" className="text-2xl font-bold">
                    DevPolish
                </Link>
            </div>

            <div className="flex items-center space-x-4">
                {isSignedIn ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="rounded">
                                <Menu className="h-4 w-4 md:mr-2" />
                                <span className="hidden md:inline">Features</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="rounded border border-gray-700">
                            <DropdownMenuItem>
                                <Link href={ROUTES.RESUME_REVIEW} className="w-full">Resume Review</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link href={ROUTES.COVER_LETTER} className="w-full">Cover Letter Generator</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link href={ROUTES.PORTFOLIO} className="w-full">Portfolio Generator</Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <SignInButton mode="modal">
                        <Button variant="outline" className="rounded">
                            <Menu className="h-4 w-4 md:mr-2" />
                            <span className="hidden md:inline">Features</span>
                        </Button>
                    </SignInButton>
                )}


                {isSignedIn ? (
                    <DropdownMenu open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
                        <DropdownMenuTrigger asChild>
                            <Image
                                src={user?.imageUrl || "/default-avatar.png"}
                                alt="User"
                                width={40}
                                height={40}
                                className="rounded-full cursor-pointer"
                            />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="rounded border border-gray-700">
                            <DropdownMenuItem>
                                <Link href={ROUTES.PROFILE} className="w-full">Profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onSelect={() => signOut()}>
                                Sign Out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <SignInButton mode="modal">
                        <Button className="rounded">Sign In</Button>
                    </SignInButton>
                )}
            </div>
        </nav>
    );
}
