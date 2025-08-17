export const H2 = ({ config, text, color }: { config?: string, text?: string, color?: string }) => {
  return (
    <h2
      className={`${config ? config : ''} text-2xl lg:text-4xl`}
      style={{ color: color, lineHeight: '1.1em', letterSpacing: '0.01em' }}
      dangerouslySetInnerHTML={{ __html: text ? text : '' }}
    />
  )
};