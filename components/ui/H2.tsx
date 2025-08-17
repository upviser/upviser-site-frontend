export const H2 = ({ config, text, color, ref }: { config?: string, text?: string, color?: string, ref?: any }) => {
  return (
    <h2
      className={`${config ? config : ''} text-2xl lg:text-4xl`}
      style={{ color: color, lineHeight: '1.1em', letterSpacing: '0.01em' }}
      dangerouslySetInnerHTML={{ __html: text ? text : '' }}
      ref={ref}
    />
  )
};