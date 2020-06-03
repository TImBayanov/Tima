const productsdb = (dbname, table) => {
  const db = new Dexie(dbname);
  db.version(1).stores(table);
  db.open();

  return db;
  /**
       * const db = new Dexie('myDb');
          db.version(1).stores({
          friends: `name, age`
      });
       */
};

//это для бд в консоли
const bulkcreate = (dbtable, data) => {
  let flag = empty(data);
  if (flag) {
    dbtable.bulkAdd([data]);
    console.log("данные вставлены успешно");
  } else {
    console.log("Пож, предоставьте данные");
  }
  return flag;
};

// создаем динамич эл
const createEle = (tagname, appendTo, fn) => {
  const element = document.createElement(tagname);
  if (appendTo) appendTo.appendChild(element);
  if (fn) fn(element);
};

// проверка валидности
const empty = object => {
  let flag = false;
  for (const value in object) {
    if (object[value] != "" && object.hasOwnProperty(value)) {
      flag = true;
    } else {
      flag = false;
    }
  }
  return flag;
};

// getData из бд
const getData = (dbname, fn) => {
  let index = 0;
  let obj = {};
  dbname.count(count => {
// подсчит строки в табл method count
    if (count) {
      dbname.each(table => {
        // table => возвр
        // и сорт
        obj = SortObj(table);
        fn(obj, index++); // вызов функции с арг
      });
    } else {
      fn(0);
    }
  });
};
//сортируем
const SortObj = (sortobj) => {
  let obj = {};
  obj = {
    id: sortobj.id,
    name: sortobj.name,
    price: sortobj.price
  };
  return obj;
}

//эскортиеруем
export default productsdb;
export {
  bulkcreate,
  createEle,
  getData,
  SortObj
};