import { SignIn } from "@clerk/nextjs";
export default function Page(){ return <div className="container py-12"><SignIn routing="path" path="/sign-in" /></div>; }
