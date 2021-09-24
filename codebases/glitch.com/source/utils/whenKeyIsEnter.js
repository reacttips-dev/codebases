export default function whenKeyIsEnter(fn) {
    return (e) => {
        if (e.key === 'Enter') {
            fn(e);
        }
    };
}