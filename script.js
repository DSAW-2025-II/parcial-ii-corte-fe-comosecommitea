// script.js - frontend
const btnLogin = document.getElementById("btnLogin");
const loginMsg = document.getElementById("login-msg");
const btnSearch = document.getElementById("btnSearch");
const pokemonResult = document.getElementById("pokemon-result");

btnLogin.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("/api/v1/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok && data.token) {
     
      localStorage.setItem("sessionToken", data.token);
      loginMsg.textContent = "Login exitoso";
      loginMsg.style.color = "green";
    } else {
      loginMsg.textContent = data.error || "Credenciales inválidas";
      loginMsg.style.color = "red";
    }
  } catch (err) {
    loginMsg.textContent = "Error en la petición";
    loginMsg.style.color = "red";
  }
});

btnSearch.addEventListener("click", async () => {
  pokemonResult.innerHTML = "Cargando...";
  const pokemonName = document.getElementById("pokemonName").value.trim();
  const token = localStorage.getItem("sessionToken");

  try {
    const res = await fetch("/api/v1/pokemonDetails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token || ""}`
      },
      body: JSON.stringify({ pokemonName })
    });

    const data = await res.json();

  
    if (res.status === 403 && data && data.error === "User not authenticated") {
      pokemonResult.innerHTML = `<p style="color:darkred">${data.error}</p>`;
      return;
    }

    
    if (res.status === 400 && data && data.error === "Ups! Pokémon no encontrado") {
      pokemonResult.innerHTML = `<p style="color:darkred">${data.error}</p>`;
      return;
    }

    if (!res.ok) {
      pokemonResult.innerHTML = `<p>Ocurrió un error (status ${res.status})</p>`;
      return;
    }

  
    pokemonResult.innerHTML = `
      <h3>${data.name}</h3>
      <img src="${data.img_url}" alt="${data.name}">
      <p>Species: ${data.species}</p>
      <p>Weight: ${data.weight}</p>
    `;
  } catch (err) {
    pokemonResult.innerHTML = "<p>Error en la petición</p>";
  }
});
