import useTheme from "../../../hooks/useTheme";
import "./style.scss";

type ToggleSwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export default function ToggleSwitch({ checked, onChange }: ToggleSwitchProps) {
  const className = useTheme("toggle-switch");

  return (
    <div className={className} onClick={() => onChange(!checked)}>
      <input type="checkbox" checked={checked} onChange={() => {}} />
      <span className="slider round"></span>
    </div>
  );
}
