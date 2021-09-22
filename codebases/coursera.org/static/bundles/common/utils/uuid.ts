// from http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
const generateUUID = (): string => {
  let d = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0; // eslint-disable-line no-bitwise
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x7) | 0x8).toString(16); // eslint-disable-line no-bitwise
  });
  return uuid;
};

export default generateUUID;
