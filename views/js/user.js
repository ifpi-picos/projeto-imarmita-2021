const LOCAL_API_URL = 'http://localhost:8080/api'
const API_URL = LOCAL_API_URL

const profileType = document.getElementById('profileType')
profileType.onchange = async () => {
  if (profileType.value != -1) {
    const tBodyUsers = document.getElementById('bodyTblUsers')
    tBodyUsers.innerHTML = ''
    await getUserListFromAPI(profileType.value, tBodyUsers)
  }
}

async function getUserListFromAPI (profileType, tBodyUsers) {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ profileType })
  })

  if (response.status === 200) {
    const tblMessage = document.getElementById('tblMessage')
    const backData = await response.json()
    const { data, message } = backData

    await data.forEach(user => {
      if (!user.bioDescription) {
        user.bioDescription = '-'
      }
      let userInfo = document.createElement('tr')
      let userRow = `
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.phone}</td>
                    <td>${user.bioDescription}</td>
                    `
      userInfo.innerHTML = userRow
      tBodyUsers.appendChild(userInfo)
    })
    tblMessage.innerText = message
    // window.alert(message)

    // console.log(data)

    // let users = ''
    // data.forEach(user => {
    //   users += `<tr>
    //         <td>${user.id}</td>
    //         <td>${user.name}</td>
    //         <td>${user.email}</td>
    //         <td>${user.phone}</td>
    //         <td>${user.bioDescription}</td>
    //         </tr>`
    //   console.log(users)
    // })
    // tBodyUsers.appendChild(users)
    // tblMessage.innerText(message)
  } else {
    const { message } = await response.json()
    alert(message)
  }
}
