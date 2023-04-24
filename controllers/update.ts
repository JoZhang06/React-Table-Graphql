// Función para mostrar el formulario de edición de usuario
function showEditForm(id: number, name: string, email: string): void {
    const modal = document.createElement("div");
    modal.classList.add("modal");
  
    const form = document.createElement("form");
    form.innerHTML = `
      <label for="name">Nombre:</label>
      <input type="text" name="name" value="${name}" required>
      <label for="email">Correo electrónico:</label>
      <input type="email" name="email" value="${email}" required>
      <button type="submit">Save</button>
      <button type="button" onclick="closeModal()">Cancel</button>
    `;
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const nameInput = form.querySelector("[name='name']") as HTMLInputElement;
      const emailInput = form.querySelector("[name='email']") as HTMLInputElement;
      const newName = nameInput.value;
      const newEmail = emailInput.value;
      editUser(id, newName, newEmail);
      modal.remove();
    });
  
    modal.appendChild(form);
    document.body.appendChild(modal);
  }
  
  // Función para editar un usuario
  function editUser(id: number, name: string, email: string): void {
    fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `mutation {
          updateUser(id: ${id}, name: "${name}", email: "${email}") {
            id
            name
            email
            updatedAt
          }
        }`,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        const user = res.data.updateUser;
        const row = document.getElementById(`user-${user.id}`) as HTMLTableRowElement;
        row.innerHTML = `
          <td>${user.id}</td>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${new Date(parseInt(user.createdAt)).toLocaleString()}</td>
          <td>${new Date(parseInt(user.updatedAt)).toLocaleString()}</td>
          <td>
            <button onclick="showEditForm(${user.id}, '${user.name}', '${user.email}')">Editar</button>
            <button onclick="deleteUser(${user.id})">Eliminar</button>
          </td>
        `;
      })
      .catch((err) => console.error(err));
  }
  
  // Función para cerrar el modal
  function closeModal(): void {
    const modal = document.querySelector(".modal");
    modal?.remove();
  }
  