import { AlertCircle, ChevronRight, Eye, Lock, LogIn, UserIcon } from "lucide-react";

function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-[1.24rem] bg-indigo-600 text-white shadow-xl shadow-indigo-100 mb-6">
            <LogIn size={28} strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
            Account Login
          </h2>
          <p>
            Enter you credentials to access the vault .
          </p>
        </div>

        {/* /** Form elements will go here */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 sm:p-10">
          {/* Conditional rendering of the form will go here */}
          {/* <div className="mb-6 flex items-center gap-2 p-4 bg-rose-50 border border-rose-100">
            <AlertCircle size={18} className="shrink-0" />
            <p className="text-[10px] font-black uppercase tracking-wide">
              Error
            </p>
          </div> */}

          <form className="space-y-5">
            <div>
              <label className="block-text-[11-px] font-black text-slate-400 uppercase-widest mb-1 ml-1">
                Identity (Username)
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <UserIcon size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-2xl focus:ring-4 focus:ring-indigo-50
                  focus:border-indigo-600 focus:bg-white transition-all outline-none placeholder:text-slate-300 font-medium"
                  placeholder="mait-taj"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2 ml-1">
                <label className="block-text-[11-px] font-black text-slate-400 uppercase-widest mb-1 ml-1">
                  Password
                </label>
                <a href="#">Lost password?</a>
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  name="password"
                  className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-2xl focus:ring-4 focus:ring-indigo-50
                  focus:border-indigo-600 focus:bg-white transition-all outline-none placeholder:text-slate-300 font-medium"
                  placeholder="********"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <Eye size={18} />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <input type="checkboc" name="rememberMe" id="rememberMe"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-50 border-slate-300 rounded-[6px] cursor-pointer"
               />
              <label htmlFor="rememberMe"
                className="ml-2 block text-xs text-slate-500  font-bold cursor-pointer select-none"
              >
                Remember Me
              </label>
            </div>
            <button
              type="submit"
              className="w-full py-4 text-white bg-slate-900 font-black rounded-2xl hover:bg-indigo-600 active:scale-[0.98] transition-all duration-200 disabled:opacity-70 flex items-center justify-center shadow-lg shadow-slate-200 mt-2 uppercase text-xs tracking-widest"
            >
              Login
            </button>
          </form>
          <div className="mt-10 pt-10 border-t border-slate-50 text-center">
            <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
              New to the System? {" "}
              <a href="#" className="hover:text-indigo-400 transition-colors">
                Register Now
                <ChevronRight size={12} strokeWidth={2} />
              </a>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;