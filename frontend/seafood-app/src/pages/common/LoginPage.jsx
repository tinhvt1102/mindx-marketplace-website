import { useState, useEffect, useRef } from "react";
import { User, Building2, Home } from "lucide-react";
import { authApi } from "../../api/auth";
import { toast } from "react-hot-toast";

export function LoginPage({ onNavigate, setCart }) {
  const googleBtnRef = useRef(null);
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const roles = [
    {
      id: "buyer",
      icon: User,
      title: "Người mua",
      description: "Mua hải sản tươi sống chất lượng cao",
    },
    {
      id: "business",
      icon: Building2,
      title: "Doanh nghiệp",
      description: "Tìm nguồn hải sản số lượng lớn",
    },
    {
      id: "farmer",
      icon: Home,
      title: "Người nuôi",
      description: "Đăng bán sản lượng hải sản",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      toast.error("Vui lòng nhập đúng định dạng Email!");
      return;
    }

    setLoading(true);
    try {
      if (isForgotPassword) {
        // ================= XỬ LÝ QUÊN MẬT KHẨU =================
        await authApi.forgotPassword(email.trim());
        toast.success("Hệ thống đã gửi hướng dẫn khôi phục vào Email của bạn. Vui lòng kiểm tra hộp thư!");
        setIsForgotPassword(false);
        setIsLogin(true);
      } else if (isLogin) {
        // ================= XỬ LÝ ĐĂNG NHẬP =================
        const response = await authApi.login(email.trim(), password);
        localStorage.setItem("token", response.token);
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            email: response.user?.email || response.email || email,
            name: response.user?.name || response.name || "User",
            role: response.user?.role || response.role || "buyer",
            token: response.token,
          }),
        );

        toast.success(`Đăng nhập thành công!`);
        onNavigate("home");
      } else {
        if (password !== confirmPassword) {
          toast.error("Mật khẩu xác nhận không khớp!");
          setLoading(false);
          return;
        }

        const registrationData = {
          name: fullName ? fullName.trim() : "",
          email: email ? email.trim() : "",
          password: password,
          phone: null,
          address: null
        };

        console.log("Dữ liệu đăng ký gửi đi:", registrationData);
        await authApi.register(registrationData);
        
        toast.success("Đăng ký tài khoản thành công!"); 
        setIsLogin(true);
        setSelectedRole(null);
        setFullName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      const errMsg = error.response?.data?.message || error.message || "Đã có lỗi xảy ra. Vui lòng thử lại!";
      toast.error(errMsg); 
    } finally {
      setLoading(false);
    }
  };

  const handleCredentialResponse = async (response) => {
    setLoading(true);
    try {
      const idToken = response.credential;
      if (!idToken) {
        throw new Error("Không nhận được token từ Google!");
      }

      const apiResponse = await authApi.googleLogin(idToken);

      localStorage.setItem("token", apiResponse.token);
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          email: apiResponse.user?.email || apiResponse.email,
          name: apiResponse.user?.name || apiResponse.name || "Google User",
          role: apiResponse.user?.role || apiResponse.role || "buyer",
          token: apiResponse.token,
        }),
      );

      toast.success("Đăng nhập qua Google thành công!"); 
      onNavigate("home");
    } catch (error) {
      console.error("Google login error:", error);
      toast.error(error.message || "Đăng nhập qua Google thất bại!"); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let script;

    const initializeGoogleSignIn = () => {
      if (window.google && googleBtnRef.current) {
        try {
          window.google.accounts.id.initialize({
            client_id: "273398524893-lu4liu2k1ei4ppn14beasfuq3afkh3bp.apps.googleusercontent.com",
            callback: handleCredentialResponse,
          });

          window.google.accounts.id.renderButton(
            googleBtnRef.current,
            {
              theme: "outline",
              size: "large",
              width: 240,
              type: "standard",
              shape: "rectangular",
              text: "signin_with",
              logo_alignment: "left"
            }
          );
        } catch (error) {
          console.error("Failed to initialize Google Sign-In:", error);
        }
      }
    };

    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (!existingScript) {
      script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.head.appendChild(script);
    } else {
      if (window.google) {
        initializeGoogleSignIn();
      } else {
        existingScript.addEventListener("load", initializeGoogleSignIn);
      }
    }

    const timer = setInterval(() => {
      if (window.google && googleBtnRef.current) {
        initializeGoogleSignIn();
        clearInterval(timer);
      }
    }, 100);

    return () => {
      clearInterval(timer);
      if (existingScript) {
        existingScript.removeEventListener("load", initializeGoogleSignIn);
      }
    };
  }, [isLogin, isForgotPassword]);

  const getTitle = () => {
    if (isForgotPassword) return "Quên mật khẩu";
    return isLogin ? "Đăng nhập" : "Đăng ký";
  };

  const getSubTitle = () => {
    if (isForgotPassword) return "Nhập email để nhận hướng dẫn khôi phục";
    return isLogin ? "Chào mừng bạn trở lại" : "Tạo tài khoản mới";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-6xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1611794501034-13369f948303?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvY2VhbiUyMHdhdmVzJTIwYmx1ZXxlbnwxfHx8fDE3NzI2MzU4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Seafood"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <svg width="60" height="60" viewBox="0 0 40 40" fill="none">
                  <path
                    d="M20 5C15 5 10 8 8 12C6 16 8 20 10 22C12 24 16 26 20 28C24 26 28 24 30 22C32 20 34 16 32 12C30 8 25 5 20 5Z"
                    fill="#0A2647"
                  />
                  <ellipse cx="20" cy="15" rx="8" ry="5" fill="#2C5F8D" />
                  <path
                    d="M20 18C22 18 24 17 25 15.5C26 14 26 12 25 11C24 10 22 9 20 9C18 9 16 10 15 11C14 12 14 14 15 15.5C16 17 18 18 20 18Z"
                    fill="#00BCD4"
                  />
                  <circle cx="18" cy="13" r="1.5" fill="white" />
                </svg>
              </div>
              <h1
                className="mb-2 font-bold text-2xl"
                style={{ color: "#0A2647" }}
              >
                {getTitle()}
              </h1>
              <p className="text-gray-600">
                {getSubTitle()}
              </p>
            </div>

            {!isLogin && !selectedRole && !isForgotPassword ? (
              <div>
                <h3
                  className="mb-4 text-center font-medium"
                  style={{ color: "#0A2647" }}
                >
                  Chọn loại tài khoản
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {roles.map((role) => {
                    const Icon = role.icon;
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setSelectedRole(role.id)}
                        className="p-4 border rounded-lg hover:border-[#00BCD4] hover:bg-blue-50 transition-colors text-left"
                        style={{ borderColor: "#e5e7eb" }}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: "#0A2647" }}
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4
                              className="mb-1 font-semibold"
                              style={{ color: "#0A2647" }}
                            >
                              {role.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {role.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setIsLogin(true)}
                  className="w-full mt-6 text-center text-sm font-medium"
                  style={{ color: "#00BCD4" }}
                >
                  Đã có tài khoản? Đăng nhập ngay
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {!isLogin && !isForgotPassword && (
                    <div>
                      <label className="block text-sm mb-2 font-medium">
                        Họ và tên
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full p-3 border rounded-md focus:ring-2 focus:ring-cyan-500 outline-none"
                        style={{ borderColor: "#e5e7eb" }}
                        placeholder="Nguyễn Văn A"
                        required
                        disabled={loading}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm mb-2 font-medium">
                      Email
                    </label>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-cyan-500 outline-none"
                      style={{ borderColor: "#e5e7eb" }}
                      placeholder="example@gmail.com"
                      required
                      disabled={loading}
                    />
                  </div>

                  {!isForgotPassword && (
                    <div>
                      <label className="block text-sm mb-2 font-medium">
                        Mật khẩu
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border rounded-md focus:ring-2 focus:ring-cyan-500 outline-none"
                        style={{ borderColor: "#e5e7eb" }}
                        placeholder="••••••••"
                        required
                        disabled={loading}
                      />
                    </div>
                  )}

                  {!isLogin && !isForgotPassword && (
                    <div>
                      <label className="block text-sm mb-2 font-medium">
                        Xác nhận mật khẩu
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-3 border rounded-md focus:ring-2 focus:ring-cyan-500 outline-none"
                        style={{ borderColor: "#e5e7eb" }}
                        placeholder="••••••••"
                        required
                        disabled={loading}
                      />
                    </div>
                  )}

                  {isLogin && !isForgotPassword && (
                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded text-cyan-500"
                          disabled={loading}
                        />
                        Ghi nhớ đăng nhập
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotPassword(true);
                        }}
                        className="font-medium bg-none border-none cursor-pointer"
                        style={{ color: "#00BCD4" }}
                      >
                        Quên mật khẩu?
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 rounded-md text-white font-bold hover:opacity-90 transition-opacity shadow-md flex justify-center items-center gap-2"
                    style={{ backgroundColor: "#00BCD4" }}
                    disabled={loading}
                  >
                    {loading && (
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    )}
                    {isForgotPassword
                      ? "Gửi yêu cầu"
                      : isLogin
                        ? "Đăng nhập"
                        : `Đăng ký với vai trò ${roles.find((r) => r.id === selectedRole)?.title}`}
                  </button>
                </div>

                <div className="mt-6 text-center text-sm">
                  {isForgotPassword ? (
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(false);
                        setIsLogin(true);
                      }}
                      className="font-medium"
                      style={{ color: "#00BCD4" }}
                      disabled={loading}
                    >
                      ← Quay lại đăng nhập
                    </button>
                  ) : isLogin ? (
                    <p>
                      Chưa có tài khoản?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setIsLogin(false);
                          setSelectedRole(null);
                        }}
                        className="font-bold"
                        style={{ color: "#00BCD4" }}
                        disabled={loading}
                      >
                        Đăng ký ngay
                      </button>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setIsLogin(true);
                        setSelectedRole(null);
                      }}
                      className="font-medium"
                      style={{ color: "#00BCD4" }}
                      disabled={loading}
                    >
                      ← Quay lại đăng nhập
                    </button>
                  )}
                </div>
                {!isForgotPassword && (
                  <div
                    className="mt-6 pt-6 border-t"
                    style={{ borderColor: "#e5e7eb" }}
                  >
                    <p className="text-center text-sm text-gray-600 mb-4">
                      Hoặc đăng nhập với
                    </p>
                    <div className="flex gap-3 items-center justify-between">
                      <div ref={googleBtnRef} id="google-signin-button" className="flex-1 flex justify-center h-[40px]"></div>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}