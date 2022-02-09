const LOCAL_API_URL = "http://localhost:3000/api";
const REMOTE_API_URL = "";
const HOST = window.location.host;
// const API_URL = HOST.includes('') ? REMOTE_API_URL : LOCAL_API_URL
const API_URL = LOCAL_API_URL;

const btnLogin = document.getElementById("btnLogin");
const btnSignUp = document.getElementById("btnSignUp");
const btnUserlist = document.getElementById("btnSUserlist")

if (btnLogin) {
  btnLogin.onclick = (e) => {
    e.preventDefault()
    const login = getDataFromFormLogin();
    sendDataToAPILogin(login);
  };
}

function getDataFromFormLogin() {
  const login = {};
  login.email = document.getElementById("email").value;
  login.password = document.getElementById("password").value;
  return login;
}

function clearForm() {
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
}

function loadMsg(name) {
  const divMessage = document.querySelector("#message");
  const message =
    localStorage.getItem("message") != null
      ? JSON.parse(localStorage.getItem("message"))
      : {};
  const msgHTML = `<p>${message} Seja bem vindo, ${name}.</p>`;
  divMessage.innerHTML = msgHTML;
}

async function sendDataToAPILogin(login) {
  const response = await fetch(`${API_URL}/auth/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(login),
  });
  

  if (response.status === 200) {
    clearForm();
    const data = await response.json();
    const { message, user } = data;
    localStorage.setItem("message", JSON.stringify(message));
    loadMsg(user.name);
    const [divMsg] = document.getElementById("message");
    // divMsg.style.backgroundColor = "green";
    // divMsg.style.color = "red";
    // divMsg.innerHTML = '<p>Login realizado com sucesso!</p>'
    // window.location.href = '/index.html'
  } else {
    clearForm();
    const {message} = await response.json();
    alert(message)
    document.getElementById('email').focus()
  }
}
