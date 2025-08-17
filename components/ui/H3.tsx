export const H3 = ({ config, text, color }: { config?: string, text?: string, color?: string }) => {
  return (
    <h3
      className={`${config ? config : ''} text-xl lg:text-3xl`}
      style={{ color: color, lineHeight: '1.1em', letterSpacing: '0.01em' }}
      dangerouslySetInnerHTML={{ __html: text ? text : '' }}
    />
  )
};