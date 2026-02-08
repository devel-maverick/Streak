import { CompareDemo } from "@/components/CodeBlock";
export default function Home() {
    return (
        <>
        <div className="flex">
            {/*LEFT PART*/}
            <div className="w-1/2">

            </div>
            {/*RIGHT PART*/}
            <div className="w-1/2 py-20">
            <CompareDemo />
            </div>
        </div>
        </>
    )
}