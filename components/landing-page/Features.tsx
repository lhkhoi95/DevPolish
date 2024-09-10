"use client"

import Image from "next/image";
import infoCards from "@/lib/info-cards";
import { motion } from "framer-motion";

export default function Features() {
    return (
        <section className="h-fit min-h-screen w-full flex relative items-center justify-center p-8 overflow-hidden">
            <Image
                src="/whirl.svg"
                fill
                className="sm:rotate-90 opacity-50 object-cover"
                alt="Background Whirl"
            />

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full h-full flex items-center justify-center flex-col gap-12 max-w-7xl relative z-10"
            >
                <h3 className="text-5xl md:text-6xl font-bold text-white text-center">
                    Our <span className="text-gradient">Features</span>
                </h3>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-between relative">
                    {infoCards.map((infoCard, index) => (
                        <motion.div
                            key={infoCard.id}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <InfoCard
                                Icon={infoCard.icon}
                                title={infoCard.title}
                            >
                                <div className="grid gap-4">
                                    {infoCard.bodyText.map((text, idx) => (
                                        <p
                                            key={idx}
                                            className="text-sm sm:text-base text-center text-gray-300"
                                        >
                                            {text}
                                        </p>
                                    ))}
                                </div>
                            </InfoCard>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    )
}

function InfoCard({ title, Icon, children }: { title: string, Icon: React.ElementType, children: React.ReactNode }) {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-full h-full rounded-lg flex flex-col justify-around items-center p-8 bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg"
        >
            <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            >
                <Icon className="text-white w-8 h-8" />
            </motion.div>
            <div>
                <h3 className="text-xl font-bold sm:text-2xl text-white">{title}</h3>
            </div>
            <div>{children}</div>
        </motion.div>
    );
}
