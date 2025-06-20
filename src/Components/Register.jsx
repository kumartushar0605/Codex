import React, { useState } from "react";
// import { MdRemoveRedEye } from "react-icons/md";
import { PiEyeDuotone } from "react-icons/pi";
import { PiEyeSlashLight } from "react-icons/pi";

const Register = () => {
  const [activeTab, setActiveTab] = useState("register");
  const [eye, setEye] = useState(true);
  const [eye2, setEye2] = useState(true);
  const [Signform, setSignform] = useState({
    name: "",
    email: "",
    regNo: "",
    branch: "",
    password: "",
    cpassword: "",
  });
  const [Logform, setLogform] = useState({ lemail: "", lpassword: "" });
  const handleChange = (e) => {
    e.preventDefault();
    setSignform({ ...Signform, [e.target.name]: e.target.value });
  };
  const handleEye = (e) => {
    e.preventDefault();
    setEye(!eye);
  };
  const handleEye2 = (e) => {
    e.preventDefault();
    setEye2(!eye2);
  };
  const handleLogin = (e) => {
    e.preventDefault();
    setLogform({ ...Logform, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      Signform.email === "" ||
      Signform.name === "" ||
      Signform.branch === "" ||
      Signform.password === "" ||
      Signform.cpassword === "" ||
      Signform.regNo === ""
    ) {
      alert("Please fill all the feilds");
      return;
    } else if (Signform.password != Signform.cpassword) {
      alert("Check Password");
      return;
    } else if (Signform.regNo.length != 10) {
      alert("Check registration number");
      return;
    } else {
      alert("Thank you");
      setSignform({
        name: "",
        email: "",
        regNo: "",
        branch: "",
        password: "",
        cpassword: "",
      });
    }
  };
  const handleLoginSubmit = (e)=>{
    e.preventDefault();
    if(Logform.lemail===""||Logform.lpassword===""){
        alert("Please fill all the details");
        return;
    }
    else if(Logform.lpassword.length!=10){
        alert("Check Password");
        return;

    }
    alert("Welcome");
    setLogform({ lemail: "", lpassword: "" });

  }
  return (
    <div className=" flex items-center justify-center bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-sm border border-slate-600/50 rounded-3xl p-8">
      <div className="w-full max-w-xl p-6 bg-gray-800 rounded-2xl shadow-lg">
        {/* Tab Headers */}
        <div className="mb-6 flex justify-center space-x-6 border-b border-gray-600">
          {["register", "login"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-4 text-lg font-medium ${
                activeTab === tab
                  ? "bg-gradient-to-r  from-cyan-500 to-blue-400 bg-clip-text text-transparent text-xl font-semibold"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="text-white">
          {activeTab === "register" && (
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors"
                    placeholder="Enter your full name"
                    value={Signform.name}
                    name="name"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors"
                    placeholder="Enter your email"
                    value={Signform.email}
                    name="email"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Registration Number
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors"
                    placeholder="Enter your reg number"
                    value={Signform.regNo}
                    name="regNo"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Branch
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 transition-colors "
                    value={Signform.branch}
                    name="branch"
                    onChange={handleChange}
                  >
                    <option className="text-slate-800" value="">
                      Select your branch
                    </option>
                    <option className="text-slate-800" value="cse">
                      Computer Science & Engineering
                    </option>
                    <option className="text-slate-800" value="it">
                      Information Technology
                    </option>
                    <option className="text-slate-800" value="ece">
                      Electronics & Communication
                    </option>
                    <option className="text-slate-800" value="eee">
                      Electrical & Electronics
                    </option>
                    <option className="text-slate-800" value="other">
                      Other
                    </option>
                  </select>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className=" flex relative ">
                    <input
                      type={eye2 ? "text" : "password"}
                      name="password"
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors"
                      placeholder="Enter your password"
                      value={Signform.password}
                      onChange={handleChange}
                    />
                    {Signform.password.length === 0 ? (
                      ""
                    ) : (
                      <button
                        type="button"
                        className="absolute right-3 top-2 text-3xl cursor-pointer text-cyan-400"
                        onClick={handleEye2}
                      >
                        {eye2 ? <PiEyeSlashLight /> : <PiEyeDuotone />}
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <div className=" flex relative ">
                    <input
                      type={eye ? "text" : "password"}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors"
                      placeholder="Confirm Password"
                      value={Signform.cpassword}
                      name="cpassword"
                      onChange={handleChange}
                    />
                    {Signform.cpassword.length === 0 ? (
                      ""
                    ) : (
                      <button
                        type="button"
                        className="absolute right-3 top-2 text-3xl cursor-pointer text-cyan-400"
                        onClick={handleEye}
                      >
                        {eye ? <PiEyeSlashLight /> : <PiEyeDuotone />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <button
                className="w-full mt-2 px-4 py-2 bg-gradient-to-r from-blue-800 to-purple-500 text-white rounded-md cursor-pointer hover:from-blue-700 hover:to-purple-600 font-bold text-xl"
                onClick={handleSubmit}
              >
                Register
              </button>
            </form>
          )}

          {activeTab === "login" && (
            <form className="space-y-4">
              <div>
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none"
                  value={Logform.lemail}
                  name="lemail"
                  onChange={handleLogin}
                />
              </div>
              <div>
                <label className="block mb-1">Password</label>
                <div className=" flex relative ">
                  <input
                    type={eye ? "text" : "password"}
                    placeholder="Enter your password"
                    value={Logform.lpassword}
                    name="lpassword"
                    onChange={handleLogin}
                    className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none"
                  />
                  {Logform.lpassword.length === 0 ? (
                    ""
                  ) : (
                    <button
                      type="button"
                      className="absolute right-3 top-1  text-3xl cursor-pointer text-cyan-400"
                      onClick={handleEye}
                    >
                      {eye ? <PiEyeSlashLight /> : <PiEyeDuotone />}
                    </button>
                  )}
                </div>
              </div>

              <button className="w-full mt-2 px-4 py-2 bg-gradient-to-r from-blue-800 to-purple-500 text-white rounded-md cursor-pointer hover:from-blue-700 hover:to-purple-600 font-bold text-xl" onClick={handleLoginSubmit}>
                Login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
