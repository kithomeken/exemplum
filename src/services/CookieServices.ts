import Cookie from "universal-cookie"
const cookie = new Cookie()

class CookieService {
    get(key: string) {
        return cookie.get(key)
    }

    set(key: string, value: any, options: object) {
        cookie.set(key, value, options)
    }

    setTimed(key: string, value: any, minutes: any, options: object) {
        const date = new Date()
        date.setTime(date.getTime() + minutes * 60 * 1000)
        cookie.set(key, value, { path: '/', expires: date })
    }

    remove(key: string) {
        cookie.remove(key)
    }
}

export default new CookieService()