export default (timestamp: number | Date, milliseconds: number) =>
    new Date(+timestamp + milliseconds);
