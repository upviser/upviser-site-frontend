export const H2 = ({ config, text, color, ref }: { config?: string, text?: string, color?: string, ref?: any }) => {
  return (
    <h2
      className={`${config ? config : ''} font-semibold text-2xl lg:text-4xl`}
      style={{ color: color }}
      dangerouslySetInnerHTML={{ __html: text ? text : '' }}
      ref={ref}
    />
  )
};