export function NewFapi(domain) {
    return function () {
        arguments[0] = domain + arguments[0]
        return fetch(...arguments)
    }
}
export function jsonPostBody(jsonBody) {
    return {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'credentials': 'include', // Don't forget to specify this if you need cookies'
        },
        body: JSON.stringify(jsonBody)
      }
    }