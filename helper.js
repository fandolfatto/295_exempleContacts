function isValidId(value) {
    return Number.isInteger(Number(value)) && Number(value) > 0;
}

function isValidEmail(email) {
    const regexp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regexp.test(email);
}

export {isValidId, isValidEmail};