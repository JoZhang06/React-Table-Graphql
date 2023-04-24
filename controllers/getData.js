"use strict";
function getData() {
    fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            query: "{ users { id name email createdAt updatedAt } }",
        }),
    })
        .then((res) => res.json())
        .then((res) => {
        const users = res.data.users;
        const tableBody = document.getElementById("users-table-body");
        users.forEach((user) => {
            const row = document.createElement("tr");
            row.id = `user-${user.id}`;
            row.innerHTML = `
          <td>${user.id}</td>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${new Date(parseInt(user.createdAt)).toLocaleString()}</td>
          <td>${new Date(parseInt(user.updatedAt)).toLocaleString()}</td>
          <td>
            <button onclick="showEditForm(${user.id}, '${user.name}', '${user.email}')">Edit</button>
            <button onclick="deleteUser(${user.id})">Delete</button>
          </td>
        `;
            tableBody === null || tableBody === void 0 ? void 0 : tableBody.appendChild(row);
        });
    })
        .catch((err) => console.error(err));
}
