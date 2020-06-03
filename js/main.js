import prodb, {
  bulkcreate,
  createEle,
  getData,
  SortObj
} from "./module.js";

// создаем бд
let db = prodb("База данных ОрС", {
  products: `++id, name, price`
});

// теги ввода
const userid = document.getElementById("userid");
const proname = document.getElementById("proname");
const price = document.getElementById("price");

// создаем кнопки
const btncreate = document.getElementById("btn-create");
const btnread = document.getElementById("btn-read");
const btnupdate = document.getElementById("btn-update");




// кнопка создания
btncreate.onclick = event => {
 
  let flag = bulkcreate(db.products, {
    name: proname.value,
    price: price.value
  });

  proname.value  = price.value = "";

// установить значение id от 1
  getData(db.products, data => {
    userid.value = data.id + 1 || 2;
  });
  table();

  let insertmsg = document.querySelector(".insertmsg");
  getMsg(flag, insertmsg);
};

// кнопка для сохр изменения данных
btnread.onclick = table;

// кнопка обновления
btnupdate.onclick = () => {
  const id = parseInt(userid.value || 0);
  if (id) {
// вызываем метод обновления dexie
    db.products.update(id, {
      name: proname.value,
      price: price.value
    }).then((updated) => {

      let get = updated ? true : false;

      // пуш смс
      let updatemsg = document.querySelector(".updatemsg");
      getMsg(get, updatemsg);

      proname.value  = price.value = "";
    })
  } else {
    console.log(`Пож выберите ID ${id}`);
  }
}



window.onload = event => {
  // установить значение id
  textID(userid);
};




// создать динамическую таблицу
function table() {
  const tbody = document.getElementById("tbody");
  const notfound = document.getElementById("notfound");
  notfound.textContent = "";

  while (tbody.hasChildNodes()) {
    tbody.removeChild(tbody.firstChild);
  }


  getData(db.products, (data, index) => {
    if (data) {
      createEle("tr", tbody, tr => {
        for (const value in data) {
          createEle("td", tr, td => {
            td.textContent = data.price === data[value] ? `$ ${data[value]}` : data[value];
          });
        }
        createEle("td", tr, td => {
          createEle("i", td, i => {
            i.className += "fas fa-edit btnedit";
            i.setAttribute(`data-id`, data.id);
// сохранить количество кнопок при редактировании
            i.onclick = editbtn;
          });
        })
        createEle("td", tr, td => {
          createEle("i", td, i => {
            i.className += "fas fa-trash-alt btndelete";
            i.setAttribute(`data-id`, data.id);
// сохранить количество кнопок при удалении
            i.onclick = deletebtn;
          });
        })
      });
    } else if(data){
      tbody = tbody;
      tbody++;
    }
    
    else {
      notfound.textContent = "В базе данных нет записей";
    }

  });
}


const editbtn = (event) => {
  let id = parseInt(event.target.dataset.id);
  db.products.get(id, function (data) {
    let newdata = SortObj(data);
    userid.value = newdata.id || 0;
    proname.value = newdata.name || "";
    price.value = newdata.price || "";
  });
}

// когда нажимаем на иконку удалить,удаляем элемент
const deletebtn = event => {
  let id = parseInt(event.target.dataset.id);
  db.products.delete(id);
  table();
}

// textbox id
function textID(textboxid) {
  getData(db.products, data => {
    textboxid.value = data.id + 1 || 1;
  });
}

// функция смс
function getMsg(flag, element) {
  if (flag) {
    element.className += " movedown";

    setTimeout(() => {
      element.classList.forEach(classname => {
        classname == "movedown" ? undefined : element.classList.remove('movedown');
      })
    }, 3000);
  }
}




