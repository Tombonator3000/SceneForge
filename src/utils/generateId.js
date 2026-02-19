// Generate a short random alphanumeric ID
const generateId = () => Math.random().toString(36).slice(2, 9);

export default generateId;
