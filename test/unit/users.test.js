const UsersService = require('../../src/services/users')
jest.mock('../../src/models')
const { Users } = require('../../src/models')

let usersService

beforeAll(() => {
  usersService = new UsersService(Users)
})

afterEach(() => {
  jest.clearAllMocks()
})

const defaultUsers = [
  {
    id: 1,
    name: 'Daniela Marques',
    email: 'test@mail.com',
    phone: '89987654321'
  },
  {
    id: 2,
    name: 'João Araújo',
    email: 'test2@companymail.com',
    phone: '89912345678'
  }
]

// GET USERS TESTS

test('Should fetch all customer users', async () => {
  const customer = defaultUsers
  const count = 1

  Users.findAndCountAll.mockResolvedValue({ rows: customer, count: count })
  const result = await usersService.getCustomers()

  expect(result.count).toEqual(count)
  expect(result.users).toEqual(customer)
  expect(Users.findAndCountAll).toHaveBeenCalledWith({
    attributes: ['id', 'name', 'email', 'phone'],
    where: { profileType: 2 }
  })
})

test('Should fetch all company users', async () => {
  const customer = defaultUsers
  const count = 1

  Users.findAndCountAll.mockResolvedValue({ rows: customer, count: count })
  const result = await usersService.getCompanies()

  expect(result.count).toBe(count)
  expect(result.users).toEqual(customer)
  expect(Users.findAndCountAll).toHaveBeenCalledWith({
    attributes: ['id', 'name', 'email', 'phone', 'bioDescription'],
    where: { profileType: 1 }
  })
})

// CREATE USER TESTS

test('Should create a new user', async () => {
  const user = {
    name: 'Daniela Marques',
    email: 'mail@test.com',
    phone: '8998121345',
    profileType: '1',
    bioDescription: 'Descrição de teste',
    password: '12345678'
  }

  Users.findOrCreate.mockResolvedValue([user, true])
  const res = await usersService.create(user)

  await expect(res).toEqual({
    message: 'Usuário cadastrado com sucesso',
    data: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileType: user.profileType,
      bioDescription: user.bioDescription
    }
  })
})

test('Should NOT create an existent user', async () => {
  const user = {
    name: 'Daniela Marques',
    email: 'mail@test.com',
    phone: '8998121345',
    profileType: '1',
    bioDescription: 'Descrição de teste',
    password: '12345678'
  }

  Users.findOrCreate.mockResolvedValue([user, false])
  await expect(usersService.create(user)).rejects.toThrowError(
    'Usuário já cadastrado'
  )
})

// UPDATE USER TESTS

test('Should UPDATE an user', async () => {
  const user = {
    name: 'TESTE CONSUMIDOR',
    email: 'consumidor@test.com',
    phone: '8998111745',
    bioDescription: '',
    password: '12345678'
  }

  const id = 123

  Users.findAll.mockResolvedValue([])
  Users.update.mockResolvedValue([1])
  Users.findByPk.mockResolvedValue(user)

  const res = await usersService.update(id, user)

  expect(res).toEqual({
    message: 'Usuário atualizado com sucesso',
    data: user
  })
  expect(Users.findByPk).toHaveBeenCalledWith(id, {
    attributes: ['id', 'name', 'email', 'phone', 'bioDescription']
  })
})

test('Should NOT UPDATE an inexistent user', async () => {
  const user = {
    name: 'TESTE CONSUMIDOR',
    email: 'consumidor@test.com',
    phone: '8998111745',
    bioDescription: '',
    password: '12345678'
  }
  const id = 123

  Users.findByPk.mockResolvedValue(null)

  await expect(usersService.update(id, user)).rejects.toThrowError(
    'Usuário não existe! Informe um ID de usuário válido'
  )
})

test('Should NOT allow empty bioDescription on company user', async () => {
  const oldUser = {
    name: 'TESTE CONSUMIDOR',
    email: 'consumidor@test.com',
    phone: '8998111745',
    bioDescription: 'teste',
    password: '12345678',
    profileType: 1
  }

  const newUser = {
    name: 'TESTE CONSUMIDOR',
    email: 'consumidor@test.com',
    phone: '8998111745',
    bioDescription: '',
    password: '12345678'
  }

  const id = 123

  Users.findByPk.mockResolvedValue(oldUser)

  await expect(usersService.update(id, newUser)).rejects.toThrowError(
    'Insira uma descrição para sua empresa.'
  )
})

test('Should NOT update with already registered phone or email', async () => {
  const id = 123
  const oldUser = {
    name: 'TESTE CONSUMIDOR',
    email: 'consumidor@test.com',
    phone: '8998111745',
    bioDescription: 'teste',
    password: '12345678',
    profileType: 1
  }

  const verifiedUser = [{
    id: 999,
    name: 'TESTE CONSUMIDOR',
    email: 'consumidor@test.com',
    phone: '8998111745',
    bioDescription: 'teste',
    password: '12345678',
    profileType: 1
  }]

  Users.findByPk.mockResolvedValue(oldUser)
  Users.findAll.mockResolvedValue(verifiedUser)

  await expect(usersService.update(id, oldUser)).rejects.toThrowError(
    'Email e/ou telefone já cadastrados!'
  )
})


// DELETE USER TEST

test('Should delete an existent user', async() => {
  const id = 123

  await Users.destroy.mockResolvedValue(1)

  const res = await usersService.delete(id)
  expect(res).toEqual({message: 'Usuário apagado com sucesso!'})
})

test('Should NOT delete an inexistent user', async() => {
  const id = 123

  await Users.destroy.mockResolvedValue(0)

  await expect(usersService.delete(id)).rejects.toThrowError('Usuário não existe!')
})