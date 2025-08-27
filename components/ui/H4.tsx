export const H4 = ({ config, text, color }: { config?: string, text?: string, color?: string }) => {
  return (
    <h4
      className={`${config ? config : ''} font-semibold text-lg lg:text-2xl`}
      style={{ color: color }}
      dangerouslySetInnerHTML={{ __html: text ? text : '' }}
    />
  )
};