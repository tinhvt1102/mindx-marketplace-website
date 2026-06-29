import vamLogo from "../assets/logo.png";

export function Logo({ className = "" }) {
  return (
    <div className={`flex items-center -ml-4 ${className}`}>
      <img
        src={vamLogo}
        alt="VAM Logo"
        className="h-25 w-auto object-contain"
      />
    </div>
  );
}