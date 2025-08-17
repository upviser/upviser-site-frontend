export const H4 = ({ config, text, color }: { config?: string, text?: string, color?: string }) => {
  return (
    <h4
      className={`${config ? config : ''} text-lg lg:text-2xl`}
      style={{ color: color, lineHeight: '1.1em', letterSpacing: '0.01em' }}
      dangerouslySetInnerHTML={{ __html: text ? text : '' }}
    />
  )
};