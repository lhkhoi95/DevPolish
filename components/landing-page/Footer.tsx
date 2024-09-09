import Link from 'next/link';
import { Github, Linkedin } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-8 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-row items-center md:items-start space-x-4">
                    <Image src="/logo.png" alt="Logo" width={100} height={100} className='rounded-full' />
                    <div className="flex flex-col items-start space-y-4">
                        <div className="flex space-x-4">
                            <Link href="https://github.com/lhkhoi95" target="_blank" rel="noopener noreferrer">
                                <Github className="text-2xl hover:text-gray-400 transition-colors" />
                            </Link>
                            <Link href="https://www.linkedin.com/in/lhkhoi95/" target="_blank" rel="noopener noreferrer">
                                <Linkedin className="text-2xl hover:text-gray-400 transition-colors" />
                            </Link>
                        </div>
                        <div className="mb-4 md:mb-0 space-y-2">
                            <h3 className="text-xl font-bold">Khoi Ly</h3>
                            <p className="text-sm text-gray-400">San Jose State University Alumni</p>
                        </div>
                    </div>
                </div>
                <div className="mt-4 text-center text-sm text-gray-400">
                    © {new Date().getFullYear()} Khoi Ly. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
