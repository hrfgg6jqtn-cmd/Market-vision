import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="flex justify-center items-center py-20 bg-[#0A0A0A] min-h-screen">
            <SignIn fallbackRedirectUrl="/dashboard" />
        </div>
    );
}
