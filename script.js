let userList = [];

let timeout = "";
const headerSeachInput = document.querySelector("#header__input");
headerSeachInput.addEventListener("input", (e) => {
  const value = e.currentTarget.value;
  console.log(value);
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    let foundUser = [];
    for (let i = 0; i < userList.length; i++) {
      if (value == "" || fio(userList[i]).includes(value)) {
        foundUser.push(userList[i]);
      }
    }
    tableContact(foundUser);
  }, 300);
});

function fio(user) {
  return user.surname + " " + user.name + " " + user.lastName;
}

//функция создания даты в реальном времени
const getDate = (date) => {
  const getMonth = date.getMonth() + 1;
  const year = date.getFullYear();
  const month = getMonth < 10 ? "0" + getMonth : getMonth;
  const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();

  const time = `${
    date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
  }:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}`;
  return `${day}.${month}.${year} <span class = "table-row__time">${time}</span>`;
};

//функция открытия модального окна
function activeModal(element) {
  element.classList.add("modal__active");
  return element;
}

//функция закрытия модального окна
function closeModal(event, modal, btn = "") {
  if (event.target.dataset.modal) {
    if (btn !== "") {
      clearingModalWindow(modal, btn);
    }
    modal.classList.remove("modal__active");
  }
}

// Функция очищения модального окна
function clearingModalWindow(modal, btn) {
  //Получаем доступ ко всем input
  const nameInput = modal.querySelector("#create__name");
  const surnameInput = modal.querySelector("#create__surname");
  const patronymicInput = modal.querySelector("#create__patronymic");
  const blockLabel = modal.querySelectorAll(".form-contacts__label");
  //Очищаем поля input
  nameInput.value = "";
  surnameInput.value = "";
  patronymicInput.value = "";
  // Удаляем select и убераем margin у кнопки
  blockLabel.forEach((element) => element.remove());
  if (document.querySelectorAll(".form-contacts__label").length == 0) {
    btn.classList.remove("modal__btn-indent");
  }

  // получаем доступ к label для нормальной отрисовки этого элемента, при очистки поля input
  document.querySelector(".label__name").classList.add("form__label");
  document.querySelector(".label__name").classList.remove("form__label-active");

  document.querySelector(".label__surname").classList.add("form__label");
  document
    .querySelector(".label__surname")
    .classList.remove("form__label-active");

  document.querySelector(".label__patronymic").classList.add("form__label");
  document
    .querySelector(".label__patronymic")
    .classList.remove("form__label-active");
}

function modalDeleteContact() {
  const moduleBox = document.createElement("div");
  moduleBox.classList.add("modal__delete", "modal__background");
  //делаем обработчик на скрытие модального окна
  moduleBox.dataset.modal = "close";
  moduleBox.addEventListener("click", (e) => {
    closeModal(e, moduleBox);
  });

  //создаём HTML модального окна
  let modalContact = `
    <div class="modal-delete__box">
        <div class="modal-delete__header">
        <button class="modal__btn-close js-modal-close btn" data-modal="close">
          <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg"  data-modal="close">
            <path  data-modal="close" fill-rule="evenodd" clip-rule="evenodd"
              d="M22.2333 7.73333L21.2666 6.76666L14.4999 13.5334L7.73324 6.7667L6.76658 7.73336L13.5332 14.5L6.7666 21.2667L7.73327 22.2333L14.4999 15.4667L21.2666 22.2334L22.2332 21.2667L15.4666 14.5L22.2333 7.73333Z"
              fill="#B0B0B0" />
          </svg>
        </button>
        <h2 class="modal-delete__heading">
          Удалить
        </h2>
      </div>
      <p class="modal-delete__text">Вы действительно хотите удалить данного клиента?</p>
      <div class="modal-delete__box-button">
        <button type="submit" class="btn modal-creation__btn-action modal-deletion__btn-action">Удалить</button>
        <button data-modal="close" type="button" class="btn modal-creation__btn-cancellation">Отмена</button>
      </div>
     </div> 
        `;
  //Добавляем HTML в бокс маодального окна
  moduleBox.innerHTML = modalContact;

  return moduleBox;
}

async function userСreation(user) {
  const response = await fetch("http://localhost:3000/api/clients", {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  await reloadUserFromServer();
  console.log(data);
  return data;
}

async function reloadUserFromServer() {
  let response = await fetch("http://localhost:3000/api/clients?search=");
  let userListFromServer = await response.json();

  tableContact(userListFromServer);
  userList = userListFromServer;
  console.log(userListFromServer);
}

function tableContact(arrayUserServe) {
  document.querySelector("tbody").innerHTML = "";
  for (let i = 0; i < arrayUserServe.length; i++) {
    let clientId = arrayUserServe[i].id;
    const tr = document.createElement("tr");

    const tdId = document.createElement("td");
    const tdName = document.createElement("td");
    const tdDataCreate = document.createElement("td");
    const tdDataChange = document.createElement("td");
    const tdContacts = document.createElement("td");
    const tdButtons = document.createElement("td");

    const spanDataChange = document.createElement("span");
    const spanDataCreate = document.createElement("span");

    const actionBtnChenge = document.createElement("button");
    const actionBtnDelete = document.createElement("button");

    tdId.classList.add("id__block", "text__grey");
    tdName.classList.add("name-block");
    tdDataCreate.classList.add("data__create-block");
    tdDataChange.classList.add("data__change-block");
    tdContacts.classList.add("contact__block");
    tdButtons.classList.add("action-block");

    spanDataCreate.classList.add("text__grey", "table__span-padding");
    spanDataChange.classList.add("text__grey", "table__span-padding");

    actionBtnChenge.classList.add(
      "btn__change-contact",
      "js__btn-chenge",
      "btn"
    );
    actionBtnDelete.classList.add(
      "btn__delete-contact",
      "js__btn-delete",
      "btn"
    );

    tdId.textContent = arrayUserServe[i].id;
    tdName.textContent = `${arrayUserServe[i].surname} ${arrayUserServe[i].name} ${arrayUserServe[i].lastName}`;
    tdDataCreate.innerHTML = getDate(new Date(arrayUserServe[i].createdAt));
    tdDataChange.innerHTML = getDate(new Date(arrayUserServe[i].updatedAt));
    tdContacts.append(svgContact(arrayUserServe[i].contacts));

    actionBtnChenge.textContent = "Изменить";
    actionBtnDelete.textContent = "Удалить";

    tdDataCreate.append(spanDataCreate);
    tdDataChange.append(spanDataChange);

    tdButtons.append(actionBtnChenge, actionBtnDelete);

    //Добавляем событие на кнопку "Удалить"
    actionBtnDelete.addEventListener("click", () => {
      //modal.modalDelete
      const modal = document.querySelector(".modal__delete");

      let button = document.querySelector(".modal-deletion__btn-action");

      button.addEventListener("click", async function (e) {
        deleteClient(clientId);
        modal.classList.remove("modal__active");
      });

      console.log(modal);
      activeModal(modal);
    });

    //ИЗМеНЕНИЕ ДАННЫХ КЛИЕНТА
    actionBtnChenge.addEventListener("click", () => {
      const modal = document.querySelector(".change__user");

      let buttonDelete = document.querySelector(".delete__client");
      // let inputName = document.getElementById("create__name");
      let userIdLabel = modal.querySelector("#userId");
      let inputName = modal.querySelector("#create__name");
      let inputSurName = modal.querySelector("#create__surname");
      let inputPatronomic = modal.querySelector("#create__patronymic");

      inputName.value = arrayUserServe[i].name;
      inputSurName.value = arrayUserServe[i].surname;
      inputPatronomic.value = arrayUserServe[i].lastName;
      userIdLabel.innerHTML = "ID: " + arrayUserServe[i].id;

      buttonDelete.addEventListener("click", () => {
        const modalDelete = document.querySelector(".modal__delete");
        let button = document.querySelector(".modal-deletion__btn-action");
        button.addEventListener("click", async function (e) {
          deleteClient(clientId);
          modal.classList.remove("modal__active");
        });

        activeModal(modalDelete);
        console.log("hell");
      });

      const whereAdd = modal.querySelector(".contacts");
      renderEditClientContact(arrayUserServe[i], whereAdd);

        
      activeModal(modal);
      // activeModal(modalWithUser);

      let saveButton = modal.querySelector(".modal-creation__btn-action");

      saveButton.addEventListener("click", async () => {
        let userContacts = document.querySelectorAll(".form-contacts__label");
        console.log(userContacts);
        let arrayContacts = dataSelectInputServer(userContacts);

        const data = await editUserToServer(clientId, {
          name: inputName.value,
          surname: inputSurName.value,
          lastName: inputPatronomic.value,
          contacts: arrayContacts
        });

        if (data.message) {
          saveButton.before(data.message);
          return;
        }
      });
    });

    tr.append(tdId, tdName, tdDataCreate, tdDataChange, tdContacts, tdButtons);

    document.querySelector("tbody").append(tr);
  }
}

const editUserToServer = async (id, user) => {
  const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...user }),
  });
  const data = await response.json();

  return data;
};

function renderEditClientContact(client, whereAdd) {
  for (let a = 0; a < client.contacts.length; a++) {
    // client.contacts
    const label = document.createElement("label");
    const btnClose = document.createElement("button");
    btnClose.classList.add("form-contacts__btn-close", "btn");
    btnClose.type = "button";
    label.classList.add("form-contacts__label");
    var options = ["Телефон", "Email", "Facebook", "Vk", "Другое"];

    const select = document.createElement("select");

    for (let i = 0; i < options.length; i++) {
      var option = document.createElement("option");
      option.value = options[i];
      option.text = options[i];
      option.classList.add("form-contacts__option");
      select.append(option);
    }

    // select.value = "Vk"; // добавим из contacts user когда будет цикл по контактам клиента
    select.value = client.contacts[a].type;

    const input = document.createElement("input");
    // input.value = "@vasyvk.ru"; // добавим из contacts user когда будет цикл по контактам клиента
    input.value = client.contacts[a].value;

    input.classList.add("form-contacts__input");
    input.type = "text";
    input.placeholder = "Ведите данные контакта";

    if (select.value === "Телефон") {
      let im = new Inputmask("+7(999) 999-99-99");
      im.mask(input);
    }

    select.addEventListener("change", () => {
      if (input.inputmask) {
        input.inputmask.remove();
        input.value = "";
      }

      if (select.value === "Телефон") {
        let im = new Inputmask("+7(999) 999-99-99");
        im.mask(input);
      } else {
        // input.inputmask.remove()
      }
    });

    // const inputs = moduleBox.querySelectorAll(".form-contacts__input");

    label.append(select);
    label.append(input);

    const choices = new Choices(select, {
      searchEnabled: false,
      itemSelectText: "",
    });

    //Добавляем кнопку удаления контакта
    label.append(btnClose);

    //Добавляем событие для кнопки удаления контакта
    btnClose.addEventListener("click", async () => {
      // Если информации для связи с клиентом больше 10, то удаляется кнопка для создания поля с созданием поля доп.информацией
      if (document.querySelectorAll(".form-contacts__label").length === 10) {
        document.querySelector(".form__contacts").append(btnAddContact);
      }
      //Удаление поля информации
      label.remove();
      // Если поля с информацией отсутствуют, то кнопка возвращает свои первоначальные размеры
      if (document.querySelectorAll(".form-contacts__label").length == 0) {
        btnAddContact.classList.remove("modal__btn-indent");
      }
    });

    whereAdd.append(label);
  }
  
}

async function deleteClient(clientId) {
  url = "http://localhost:3000/api/clients/" + clientId;
  let response = await fetch(url, {
    method: "DELETE",
  });

  if (!response.ok) {
    console.log("Not able to delete user: " + response.statusText);
  } else {
    console.log("Deleted: " + clientId);
  }

  reloadUserFromServer();
}

function svgContact(select) {
  const block = document.createElement("div");
  block.classList.add("contacts-block-1");
  for (let i = 0; i <= select.length - 1; ++i) {
    const img = document.createElement("img");
    if (select[i].type === "Facebook") {
      img.src = "./img/contacts/fb.svg";
      linkType = "http://" + select[i].value;
      block.append(img);
    }
    if (select[i].type === "Телефон") {
      img.src = "./img/contacts/phone.svg";
      linkType = "http://" + select[i].value;
      block.append(img);
    }
    if (select[i].type === "Email") {
      img.src = "./img/contacts/mail.svg";
      linkType = "http://" + select[i].value;
      block.append(img);
    }
    if (select[i].type === "Другое") {
      img.src = "./img/contacts/contact.svg";
      linkType = "http://" + select[i].value;
      block.append(img);
    }
    if (select[i].type === "Vk") {
      img.src = "./img/contacts/vk.svg";
      linkType = "http://" + select[i].value;
      block.append(img);
    }

    tippy(img, {
      allowHTML: true,
      content: `${select[i].type}: <a class= "color-name" href=${linkType}>${select[i].value}</a>`,
      interactive: true,
    });
  }

  return block;
}

function mobileName(name) {
  // Здесь делается действие над тегом label, чтобы он поднимался и отпускался вверх и вниз при введении данных клиента
  // Действие над label name
  name.addEventListener("input", () => {
    if (name.value !== "") {
      setTimeout(() => {
        document
          .querySelector(".label__name")
          .classList.add("form__label-active");
        document.querySelector(".label__name").classList.remove("form__label");
      }, 2);
    } else {
      document.querySelector(".label__name").classList.add("form__label");
      document
        .querySelector(".label__name")
        .classList.remove("form__label-active");
    }
  });
}

// Действие над label surname
function mobileSurname(surname) {
  surname.addEventListener("input", () => {
    if (surname.value !== "") {
      setTimeout(() => {
        document
          .querySelector(".label__surname")
          .classList.add("form__label-active");
        document
          .querySelector(".label__surname")
          .classList.remove("form__label");
      }, 2);
    } else {
      document.querySelector(".label__surname").classList.add("form__label");
      document
        .querySelector(".label__surname")
        .classList.remove("form__label-active");
    }
  });
}

function mobilePatronymic(patronymic) {
  patronymic.addEventListener("input", () => {
    if (patronymic.value !== "") {
      setTimeout(() => {
        document
          .querySelector(".label__patronymic")
          .classList.add("form__label-active");
        document
          .querySelector(".label__patronymic")
          .classList.remove("form__label");
      }, 2);
    } else {
      document.querySelector(".label__patronymic").classList.add("form__label");
      document
        .querySelector(".label__patronymic")
        .classList.remove("form__label-active");
    }
  });
}

function clickBtnAddContact(btnAddContact, whereAdd) {
  // Функция нажатия на кнопку Добавить контакт
  btnAddContact.addEventListener("click", () => {
    const label = document.createElement("label");
    const btnClose = document.createElement("button");
    btnClose.classList.add("form-contacts__btn-close", "btn");
    btnClose.type = "button";
    label.classList.add("form-contacts__label");
    var options = ["Телефон", "Email", "Facebook", "Vk", "Другое"];

    const select = document.createElement("select");

    for (var i = 0; i < options.length; i++) {
      var option = document.createElement("option");
      option.value = options[i];
      option.text = options[i];
      option.classList.add("form-contacts__option");
      select.append(option);
    }

    select.addEventListener("change", () => {
      if (input.inputmask) {
        input.inputmask.remove();
        input.value = "";
      }

      if (select.value === "Телефон") {
        let im = new Inputmask("+7(999) 999-99-99");
        im.mask(input);
      } else {
        // input.inputmask.remove()
      }
    });

    // const inputs = moduleBox.querySelectorAll(".form-contacts__input");
    const input = document.createElement("input");
    let imr = new Inputmask("+7(999) 999-99-99");
    imr.mask(input);
    input.classList.add("form-contacts__input");
    input.type = "text";
    input.placeholder = "Ведите данные контакта";

    label.append(select);
    label.append(input);

    const choices = new Choices(select, {
      searchEnabled: false,
      itemSelectText: "",
    });

    //Добавляем кнопку удаления контакта
    label.append(btnClose);

    //Добавляем событие для кнопки удаления контакта
    btnClose.addEventListener("click", () => {
      // Если информации для связи с клиентом больше 10, то удаляется кнопка для создания поля с созданием поля доп.информацией
      if (document.querySelectorAll(".form-contacts__label").length === 10) {
        document.querySelector(".form__contacts").append(btnAddContact);
      }
      //Удаление поля информации
      label.remove();
      // Если поля с информацией отсутствуют, то кнопка возвращает свои первоначальные размеры
      if (document.querySelectorAll(".form-contacts__label").length == 0) {
        btnAddContact.classList.remove("modal__btn-indent");
      }
    });

    whereAdd.append(label);

    //Стили для кнопки добавления контакта
    if (document.querySelectorAll(".form-contacts__label").length >= 1) {
      btnAddContact.classList.add("modal__btn-indent");
    }
    //Удаление кнопки при излишке контактов
    if (document.querySelectorAll(".form-contacts__label").length === 10) {
      btnAddContact.remove();
      return;
    }
  });
}

function modalCreationContact() {
  // Создаём задний фон модалки
  const moduleBox = document.createElement("div");
  moduleBox.classList.add("creatingNew__user", "modal__background");
  // Вешаем data-modal для закрытия при нажатии на фон
  moduleBox.dataset.modal = "close";
  moduleBox.addEventListener("click", (e) => {
    closeModal(e, moduleBox, btnAddContact);
  });

  //Создаём HTML Модального окна нового контакта
  let modalContact = `
  <div class="modal-creation__box">
      <div class="modal-creation__modal-header">
        <button class="modal__btn-close js-modal-close btn" data-modal="close">
          <svg data-modal="close" width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path data-modal="close" fill-rule="evenodd" clip-rule="evenodd"
             d="M22.2333 7.73333L21.2666 6.76666L14.4999 13.5334L7.73324 6.7667L6.76658 7.73336L13.5332 14.5L6.7666 21.2667L7.73327 22.2333L14.4999 15.4667L21.2666 22.2334L22.2332 21.2667L15.4666 14.5L22.2333 7.73333Z"
             fill="#B0B0B0" />
          </svg>
        </button>
           <h2 class="modal-creation__heading">
             Новый клиент
           </h2>
      </div>
      <div class="modal-creation__modal-body">
        <form class="modal-creation__form" method="POST">
          <div class="modal-creation__form-main form__main">
            <div class="form__block">
               <input requerid type="surname" class="form__input" id="create__surname" placeholder="">
               <label for="create__surname" class="form__label label__surname">Фамилия<span class="form-label__span">*</span></label>
            </div>
            <div class="form__block">
               <input requerid type="name" class="form__input" id="create__name" placeholder=''>
               <label for="create__name" class="form__label  label__name">Имя<span class="form-label__span">*</span></label>
            </div>
            <div class="form__block">
               <input type="name2" class="form__input" id="create__patronymic" placeholder=''>
               <label for="create__patronymic" class="form__label label__patronymic">Отчество</label>
            </div>
          </div>
          <div class="modal-creation__form-contacts form__contacts">
             <div class="form-contacts__block-contacts block-contacts">
             </div>
             <button type="button" class="btn form-contacts__add-contact add__contact" id="js-add-contact">Добавить контакт</button>
          </div>
          <div class="modal-creation__box-button">
             <button type="submit" class="btn modal-creation__btn-action" data-modal="close">Сохранить</button>
             <button data-modal="close" type="button" data-modal="close" class="btn modal-creation__btn-cancellation">Отмена</button>
          </div>
        </form>
      </div>
    </div>`;

  // Здесь мы задаём весь HTML блоку модального окна
  moduleBox.innerHTML = modalContact;

  const btnAddContact = moduleBox.querySelector("#js-add-contact");

  //Получаем доступ к кажому input
  // input имени
  const nameFieldValue = moduleBox.querySelector("#create__name");

  // input фамилии
  const surnameFieldValue = moduleBox.querySelector("#create__surname");

  // input Отчества
  const patronymicFieldValue = moduleBox.querySelector("#create__patronymic");

  // Действие над label name
  mobileName(nameFieldValue);

  // Действие над label surname
  mobileSurname(surnameFieldValue);

  // Действие над label patronymic
  mobilePatronymic(patronymicFieldValue);

  const whereAdd = moduleBox.querySelector(".block-contacts");

  //функция нажатия на кнопку добавить контакт
  clickBtnAddContact(btnAddContact, whereAdd);

  //Создания события на кнопке сохранить
  moduleBox
    .querySelector(".modal-creation__btn-action")
    .addEventListener("click", (e) => {
      e.preventDefault();

      // получение доступа ко всем input
      const nameInput = moduleBox.querySelector("#create__name");
      const surnameInput = moduleBox.querySelector("#create__surname");
      const patronymicInput = moduleBox.querySelector("#create__patronymic");

      // получение доступа ко всем select
      const selects = moduleBox.querySelectorAll(".choices__list--single");
      const inputs = moduleBox.querySelectorAll(".form-contacts__input");

      console.log(selects, inputs);

      let userContacts = document.querySelectorAll(".form-contacts__label");
      let arrayContacts = dataSelectInputServer(userContacts);

      //Создания объекта с данными о клиенте
      const newContactValue = {
        name: `${nameInput.value}`,
        surname: `${surnameInput.value}`,
        lastName: `${patronymicInput.value}`,

        contacts: arrayContacts,
      };

      //Выводим контакт в таблицу

      userСreation(newContactValue);

      // Вызываем функцию очищение и закрытия модального окна
      closeModal(e, moduleBox, btnAddContact);
    });

  return moduleBox;
}

function dataSelectInputServer(userContacts) {
  const arrayContacts = [];
  for (let i = 0; i < userContacts.length; i++) {
    let value = "";
    let type = "";
    for (let j = 0; j < userContacts[i].children.length; j++) {
      if (userContacts[i].children[j].className == "form-contacts__input") {
        value = userContacts[i].children[j].value;
      }
      if (userContacts[i].children[j].className == "choices") {
        type = userContacts[i].children[j].innerText;
      }
    }

    let cont = { type: type, value: value };

    arrayContacts.push(cont);
  }
  return arrayContacts;
}

//изменить контакт КОД
function changeDataContact() {
  const moduleBox = document.createElement("div");
  moduleBox.classList.add("change__user", "modal__background");
  //делаем обработчик на скрытие модального окна
  moduleBox.dataset.modal = "close";
  moduleBox.addEventListener("click", (e) => {
    closeModal(e, moduleBox, btnAddContact);
  });

  //создаём HTML модального окна
  let modalContact = `
  <div class="modal-creation__box">
  <div class="modal-creation__modal-header">
    <button class="modal__btn-close js-modal-close btn" data-modal="close">
      <svg data-modal="close" width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
           <path data-modal="close" fill-rule="evenodd" clip-rule="evenodd"
         d="M22.2333 7.73333L21.2666 6.76666L14.4999 13.5334L7.73324 6.7667L6.76658 7.73336L13.5332 14.5L6.7666 21.2667L7.73327 22.2333L14.4999 15.4667L21.2666 22.2334L22.2332 21.2667L15.4666 14.5L22.2333 7.73333Z"
         fill="#B0B0B0" />
      </svg>
    </button>
       <h2 class="modal-creation__heading">
         Изменить данные <span class="text__grey id__stile" id = "userId">ID: </span>
       </h2>
  </div>
  <div class="modal-creation__modal-body">
    <form class="modal-creation__form" method="PATCH">
      <div class="modal-creation__form-main form__main">
        <div class="form__block">
           <input requerid type="surname" class="form__input" id="create__surname" placeholder="">
           <label for="create__surname" class="form__label label__surname">Фамилия<span class="form-label__span">*</span></label>
        </div>
        <div class="form__block">
           <input requerid type="name" class="form__input" id="create__name" placeholder=''>
           <label for="create__name" class="form__label  label__name">Имя<span class="form-label__span">*</span></label>
        </div>
        <div class="form__block">
           <input type="name2" class="form__input" id="create__patronymic" placeholder=''>
           <label for="create__patronymic" class="form__label label__patronymic">Отчество</label>
        </div>
      </div>
      <div class="modal-creation__form-contacts form__contacts">
         <div class="form-contacts__block-contacts block-contacts contacts">
         </div>
         <button type="button" id = "add" class="btn form-contacts__add-contact add__contact js-add-contact">Добавить контакт</button>
      </div>
      <div class="modal-creation__box-button">
         <button type="submit" class="btn modal-creation__btn-action" data-modal="close">Сохранить</button>
         <button data-modal="close" type="button" class="btn modal-creation__btn-cancellation modal-deletion__btn-action delete__client">Удалить клиента</button>
      </div>
    </form>
  </div>
</div>`;

  //Добавляем HTML в бокс маодального окна
  moduleBox.innerHTML = modalContact;

  const btnAddContact = moduleBox.querySelector("#add");
  const whereAdd = moduleBox.querySelector(".contacts");
  clickBtnAddContact(btnAddContact, whereAdd);

  // input имени

  moduleBox.querySelector(".label__name").classList.add("form__label-active");
  moduleBox
    .querySelector(".label__surname")
    .classList.add("form__label-active");
  moduleBox
    .querySelector(".label__patronymic")
    .classList.add("form__label-active");

  return moduleBox;
}

//сщртировка таблицы

let sortId = document.getElementById("btn-id");
let sortFio = document.getElementById("btn-fio");
let sortDataCreate = document.getElementById("btn-data-create");
let sortDataChange = document.getElementById("btn-data-change");

function compare(left, right, asc) {
  if (asc) {
    // Compare the 2 dates
    if (left < right) return -1;
    if (left > right) return 1;
  } else {
    if (right < left) return -1;
    if (right > left) return 1;
  }
  return 0;
}

sortId.addEventListener("click", function (e) {
  let sortOrder = toggleArrowClass(sortId);
  userList.sort(function (a, b) {
    return compare(a.id, b.id, sortOrder);
  });

  tableContact(userList);
});

sortFio.addEventListener("click", function (e) {
  let sortOrder = toggleArrowClass(sortFio);
  userList.sort(function (a, b) {
    return compare(fio(a), fio(b), sortOrder);
  });

  tableContact(userList);
});

sortDataCreate.addEventListener("click", function (e) {
  let sortOrder = toggleArrowClass(sortDataCreate);
  userList.sort(function (a, b) {
    return compare(a.createdAt, b.createdAt, sortOrder);
  });

  tableContact(userList);
});

sortDataChange.addEventListener("click", function (e) {
  let sortOrder = toggleArrowClass(sortDataChange);
  userList.sort(function (a, b) {
    return compare(a.updatedAt, b.updatedAt, sortOrder);
  });

  tableContact(userList);
});

function toggleArrowClass(elem) {
  let ascSort = true;
  if (elem.classList.contains("th__btnDown")) {
    elem.classList.remove("th__btnDown");
    elem.classList.add("th__btnUP");
    ascSort = false;
  } else {
    elem.classList.remove("th__btnUP");
    elem.classList.add("th__btnDown");
  }

  return ascSort;
}

//////

document.addEventListener("DOMContentLoaded", () => {
  //Объект с модальными окнами
  const modal = {
    modalNewContact: modalCreationContact(),
    modalDelete: modalDeleteContact(),
    modalchangeContact: changeDataContact(),
  };

  document.body.append(modal.modalNewContact);
  document.body.append(modal.modalDelete);
  document.body.append(modal.modalchangeContact);

  reloadUserFromServer();

  //Вызов модального окна на кнопке нового контакта
  document.querySelector(".add__btn").addEventListener("click", () => {
    const modal = document.querySelector(".creatingNew__user");
    activeModal(modal);
  });
});
