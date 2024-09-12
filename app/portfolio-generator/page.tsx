import PortfolioGenerator from "./PortfolioGenerator";

export default async function Page() {
    return <>
        <div className="w-full md:w-3/5 md:mx-auto px-4 sm:px-6 md:px-8 max-w-full">
            <h1 className="text-3xl sm:text-4xl font-bold my-6 sm:my-8 text-center">
                Portfolio Generator
            </h1>
            <p className="text-center text-gray-500 max-w-xl mx-auto mb-6 sm:mb-8">
                Upload your resume to generate a portfolio.
            </p>
            <PortfolioGenerator />
        </div>
    </>
}