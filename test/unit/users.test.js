const UsersService = require('../../src/services/users')
jest.mock('../../src/models')
const { Users } = require('../../src/models')
const bcrypt = require('bcrypt')
const {
  COMPANY_USER,
  ADMIN_USER,
  CUSTOMER_USER
} = require('../../src/enumerators/profileTypes')
const { user } = require('pg/lib/defaults')

let usersService

beforeAll(() => {
  usersService = new UsersService(Users)
})

afterEach(() => {
  jest.clearAllMocks()
})

// DO NOT CHANGE USERS POSITIONS IN THIS ARRAY
const defaultUsers = [
  {
    id: 10,
    name: 'DUMMY customer',
    email: 'customerDummy@mail.com',
    phone: '89912345677',
    profileType: CUSTOMER_USER
  },
  {
    id: 1,
    name: 'João Araújo',
    email: 'company@mail.com',
    phone: '89912345678',
    bioDescription: 'Aberto de seg a sex das 8:00 às 18:00 horas',
    profileType: COMPANY_USER
  },
  {
    id: 2,
    name: 'Daniela Marques',
    email: 'customer@mail.com',
    phone: '89987654321',
    profileType: CUSTOMER_USER
  },
  {
    id: 3,
    name: 'ADMIN',
    email: 'admin@mail.com',
    phone: '89912345675',
    profileType: ADMIN_USER
  }
]

// GET USERS TESTS

test('[ADMIN] Should fetch all Users', async () => {
  const mockUsers = defaultUsers

  const actor = defaultUsers[ADMIN_USER]
  const permission = ADMIN_USER
  const count = defaultUsers.length
  const filter = 0
  const order = [['name', 'ASC']]
  const attributes = [
    'id',
    'name',
    'email',
    'phone',
    'profileType',
    'bioDescription'
  ]

  Users.findByPk.mockResolvedValue(actor)
  const checkPermission = await usersService.checkPermission(
    actor.id,
    permission
  )
  expect(checkPermission).toEqual(true)

  Users.findAndCountAll.mockResolvedValue({ rows: mockUsers, count })
  const result = await usersService.getAllUsers(actor.id, filter)
  expect(result.count).toEqual(count)
  expect(result.users).toEqual(mockUsers)
  expect(Users.findAndCountAll).toHaveBeenCalledWith({
    attributes,
    order
  })
})

test('["CUSTOMER", "COMPANY"] Should NOT fetch all Users', async () => {
  const permission = ADMIN_USER
  const actor = defaultUsers[CUSTOMER_USER]
  const filter = 0

  Users.findByPk.mockResolvedValue(actor)
  await expect(
    usersService.checkPermission(actor.id, permission)
  ).rejects.toThrowError('Usuário não autorizado!')

  await expect(usersService.getAllUsers(actor.id, filter)).rejects.toThrowError(
    'Usuário não autorizado!'
  )
})

test('["CUSTOMER"] Should fetch all company users', async () => {
  const permission = CUSTOMER_USER
  const actor = defaultUsers[CUSTOMER_USER]
  const companies = {
    id: 1,
    name: 'João Araújo',
    email: 'company@mail.com',
    phone: '89912345678',
    bioDescription: 'Aberto de seg a sex das 8:00 às 18:00 horas',
    profileType: COMPANY_USER
  }
  count = companies.length

  const where = { profileType: COMPANY_USER }
  const attributes = ['id', 'name', 'email', 'phone', 'bioDescription']
  const order = [['name', 'ASC']]

  Users.findByPk.mockResolvedValue(actor)
  const checkPermission = await usersService.checkPermission(
    actor.id,
    permission
  )
  expect(checkPermission).toEqual(true)

  Users.findAndCountAll.mockResolvedValue({ rows: companies, count })
  const result = await usersService.getCompanies(actor.id)
  expect(result.count).toEqual(count)
  expect(result.users).toEqual(companies)
  expect(Users.findAndCountAll).toHaveBeenCalledWith({
    where,
    attributes,
    order
  })
})

test('["ADMIN", "COMPANY"] Should NOT fetch all company users', async () => {
  const permission = CUSTOMER_USER
  const actor = defaultUsers[COMPANY_USER]

  Users.findByPk.mockResolvedValue(actor)
  await expect(
    usersService.checkPermission(actor.id, permission)
  ).rejects.toThrowError('Usuário não autorizado!')

  await expect(usersService.getCompanies(actor.id)).rejects.toThrowError(
    'Usuário não autorizado!'
  )
})

// UPDATE USER TESTS

test('["ALL"] Should UPDATE an user', async () => {
  const actor = defaultUsers[CUSTOMER_USER]
  const userToUpdate = actor
  const userDTO = {
    id: userToUpdate.id,
    name: 'Updated Customer',
    email: 'customerUpdated@test.com',
    phone: '89999999999',
    password: '12345678',
    profileType: CUSTOMER_USER
  }

  Users.findByPk.mockResolvedValue(userToUpdate)
  const userExists = await usersService.userExists(userToUpdate.id)
  expect(userExists).toEqual(userToUpdate)

  Users.findByPk.mockResolvedValue(actor)
  Users.findAll.mockResolvedValue([userToUpdate])
  const isDataInUse = await usersService.isDataInUse(userDTO, userToUpdate.id)
  expect(isDataInUse).toEqual(false)

  Users.update.mockResolvedValue([1])
  Users.findByPk.mockResolvedValue(userDTO)
  expect(Users.findByPk).toHaveBeenCalledWith(userToUpdate.id)

  const result = await usersService.update(userToUpdate.id, actor.id, userDTO)
  expect(result).toEqual({
    message: 'Usuário atualizado com sucesso',
    data: userDTO
  })
})

test('["ALL"] Should NOT UPDATE an inexistent user', async () => {
  const actor = defaultUsers[CUSTOMER_USER]
  const userId = 888 // unexistent id
  const userDTO = {
    id: userId.id,
    name: 'Updated Dummy Customer',
    email: 'customerDummy2@test.com',
    phone: '89999999999',
    password: '12345678',
    profileType: CUSTOMER_USER
  }
  const user = undefined

  await Users.findByPk.mockResolvedValue(user)
  await expect(usersService.userExists(userId)).rejects.toThrowError(
    'Usuário não existe!'
  )

  await expect(
    usersService.update(userId.id, actor.id, userDTO)
  ).rejects.toThrowError('Usuário não existe!')
})

test('["ALL] Should NOT UPDATE another user', async () => {
  const actor = defaultUsers[CUSTOMER_USER]
  const userToUpdate = defaultUsers[0] // Dummy customer
  const userDTO = {
    id: userToUpdate.id,
    name: 'Updated Customer',
    email: 'customerUpdated@test.com',
    phone: '89999999999',
    password: '12345678',
    profileType: CUSTOMER_USER
  }

  Users.findByPk.mockResolvedValue(userToUpdate)
  const userExists = await usersService.userExists(userToUpdate.id)
  expect(userExists).toEqual(userToUpdate)

  Users.findByPk.mockResolvedValue(actor)

  await expect(
    usersService.update(userToUpdate.id, actor.id, userDTO)
  ).rejects.toThrowError('Usuário não autorizado!')
})

test('["COMPANY"] Should NOT UPDATE if empty bioDescription on company user', async () => {
  const actor = defaultUsers[COMPANY_USER]
  const userToUpdate = actor
  const userDTO = {
    id: userToUpdate.id,
    name: 'Updated Dummy Customer',
    email: 'customerDummy2@test.com',
    phone: '89999999999',
    password: '12345678',
    profileType: userToUpdate.profileType,
    bioDescription: ''
  }

  Users.findByPk.mockResolvedValue(userToUpdate)
  const userExists = await usersService.userExists(userToUpdate.id)
  expect(userExists).toEqual(userToUpdate)

  Users.findByPk.mockResolvedValue(actor)
  Users.findAll.mockResolvedValue([userToUpdate])
  const isDataInUse = await usersService.isDataInUse(userDTO, userToUpdate.id)
  expect(isDataInUse).toEqual(false)

  await expect(
    usersService.update(userToUpdate.id, actor.id, userDTO)
  ).rejects.toThrowError('Insira uma descrição para sua empresa.')
})

test('["ALL"] Should NOT update with data from another user', async () => {
  const actor = defaultUsers[CUSTOMER_USER]
  const userToUpdate = actor
  const dummyUser = defaultUsers[0]
  const equalPhone = defaultUsers[0].phone //phone of a dummy customer
  const userDTO = {
    id: userToUpdate.id,
    name: 'Updated Customer',
    email: 'customerUpdated@test.com',
    phone: equalPhone,
    password: '12345678',
    profileType: userToUpdate.profileType
  }

  const usersWithSamePhone = [userDTO, dummyUser]

  Users.findByPk.mockResolvedValue(userToUpdate)
  const userExists = await usersService.userExists(userToUpdate.id)
  expect(userExists).toEqual(userToUpdate)
  Users.findByPk.mockResolvedValue(actor)

  Users.findAll.mockResolvedValue(usersWithSamePhone)
  await expect(
    usersService.isDataInUse(userDTO, userToUpdate.id)
  ).rejects.toThrowError('Email e/ou telefone já cadastrados!')
})

// DELETE USER TEST

test('["ALL"] Should delete an existent user', async () => {
  // ACTOR === UserToDelete
  const actor = defaultUsers[CUSTOMER_USER]
  const id = actor.id

  await Users.findByPk.mockResolvedValue(actor)
  const userExists = await usersService.userExists(id)
  expect(userExists).toEqual(actor)

  await Users.destroy.mockResolvedValue(1)
  const res = await usersService.delete(id, actor.id)
  expect(res).toEqual({ message: 'Usuário apagado com sucesso!' })
})

test('["ALL"] Should NOT delete an inexistent user', async () => {
  const userId = 888 // unexistent id
  const user = undefined

  await Users.findByPk.mockResolvedValue(user)
  await expect(usersService.userExists(userId)).rejects.toThrowError(
    'Usuário não existe!'
  )

  await expect(usersService.delete(user)).rejects.toThrowError(
    'Usuário não existe!'
  )
})

test('["ALL"] Should NOT delete a different user', async () => {
  const userToBeDeleted = defaultUsers[0] // dummy costumer
  const actor = defaultUsers[CUSTOMER_USER]

  await Users.findByPk.mockResolvedValue(userToBeDeleted)
  const userExists = await usersService.userExists(userToBeDeleted.id)
  await expect(userExists).toEqual(userToBeDeleted)

  await Users.findByPk.mockResolvedValue(actor)
  await expect(usersService.delete(userToBeDeleted.id)).rejects.toThrowError(
    'Usuário não autorizado!'
  )
})
