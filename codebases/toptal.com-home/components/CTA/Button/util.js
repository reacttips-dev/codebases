export const getAriaLabel = ({
    loading,
    children
}) => {
    if (loading || !children) {
        return typeof children === 'string' ? children : 'Button'
    }
}