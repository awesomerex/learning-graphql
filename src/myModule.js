// Named export - Has a name. Have as many as we need.
// Default export - Has no name. You can only have one.
const message = 'Some message from myModule.js'

const name = 'Anderew'

const location = 'Philadelphia'

const getGreeting = (name) => {
    return `Welcome to the course ${name}`
}

export { message, name, getGreeting, location as default }