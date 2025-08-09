import { SignUp } from "@clerk/nextjs";
export default function Page(){ return <div className="container py-12"><SignUp routing="path" path="/sign-up" /></div>; }
