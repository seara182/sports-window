import './Toggle.css';

interface Props {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  label: string;
}

export function Toggle({ checked, onChange, disabled, label }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`toggle${checked ? ' is-on' : ''}`}
      disabled={disabled}
      onClick={onChange}
    >
      <span className="toggle__knob" />
    </button>
  );
}
