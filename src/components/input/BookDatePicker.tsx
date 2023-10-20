interface Props {
  value: string
  label: string
  tabIndex: number
  readonly?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  isChanged?: boolean
}

export const BookDatePicker: React.FC<Props> = ({
  value,
  label,
  tabIndex,
  readonly = false,
  // eslint-disable-next-line
  onChange = () => {},
  isChanged = false,
}) => {
  return (
    <div className="mb-1">
      <div className="text-gray-400 text-xs mb-1">{label}</div>
      <input
        type="date"
        value={value}
        className={`pl-2 py-1 w-full text-sm sm:text-base ${
          readonly
            ? 'bg-white resize-none border-b appearance-none'
            : 'bg-slate-100 cursor-pointer'
        } ${isChanged ? 'border-2 border-orange-400' : ''}`}
        onChange={onChange}
        tabIndex={tabIndex}
        disabled={readonly}
      />
    </div>
  )
}