

interface IButtonProp {
  handleClick?: () => void
  title?: string
  disabled?: boolean
}

const Button = ({handleClick, title, disabled} : IButtonProp) => {
  return (
    <button onClick={handleClick} className="button" disabled={disabled}>
        {title}
    </button>
  )
}

export default Button