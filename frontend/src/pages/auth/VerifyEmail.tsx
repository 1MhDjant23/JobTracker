import { Loader2 } from "lucide-react";

function VerifyEmail() {
  return (
    <div className="max-w-md w-full">
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10 text-center relative overflow-hidden">
        {/* conditionally render the content based on the verification status */}
        <div className="flex flex-col items-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 rounded-full bg-indigo-100 opacity-25"></div>
            <div className="relative w-20 h-20 bg-indigo-50 rounded-[1.25rem] flex items-center justify-center text-indigo-600 shadow-inner">
              <Loader2 size={40} strokeWidth={1.5} />
            </div>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2 uppercase">Verifying</h2>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;