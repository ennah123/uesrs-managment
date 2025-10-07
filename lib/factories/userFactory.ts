import { faker } from '@faker-js/faker'
import { hashPassword } from '../auth'

const roles = ['admin','user']
export const createUser = async() => {
    const random = Math.floor(Math.random() * roles.length)
    return {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        role: roles[random],
        password: await hashPassword('user123')
    }
}