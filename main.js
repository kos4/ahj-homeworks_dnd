/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/functions.js
function getData(id = "") {
  let data = localStorage.getItem("data");
  if (!data) return {};
  data = JSON.parse(data);
  if (id) {
    if (Object.hasOwn(data, id)) {
      return data[id];
    } else {
      return [];
    }
  } else {
    return data;
  }
}
function setData(data) {
  for (let key in data) {
    data[key].sort((a, b) => a.sort - b.sort);
  }
  localStorage.setItem("data", JSON.stringify(data));
}
;// CONCATENATED MODULE: ./src/js/WidgetForm.js


class WidgetForm {
  constructor(container, id) {
    this.container = container;
    this.id = id;
    this.onSubmit = this.onSubmit.bind(this);
  }
  init() {
    this.container.insertAdjacentHTML("beforeend", this.markup());
    const _btnShow = this.container.querySelector(".tasks__btn-showForm");
    const _bntHide = this.container.querySelector(".tasks__btn-hide");
    const _form = this.container.querySelector(".tasks__form");
    _btnShow.addEventListener("click", this.onToggle.bind(this, _form, _btnShow));
    _bntHide.addEventListener("click", this.onToggle.bind(this, _form, _btnShow));
    _form.addEventListener("submit", this.onSubmit);
  }
  onSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    this.save(formData);
  }
  onToggle(_form, _btnShow) {
    _btnShow.classList.toggle("hidden");
    _form.classList.toggle("hidden");
  }
  save(formData) {
    const data = getData();
    const item = {
      id: Date.now(),
      text: formData.get("text")
    };
    const widgetList = new WidgetList(this.container);
    if (Object.hasOwn(data, this.id)) {
      item.sort = data[this.id].length + 1;
      data[this.id].push(item);
    } else {
      item.sort = 1;
      data[this.id] = [item];
    }
    setData(data);
    widgetList.init(this.id);
  }
  markup() {
    return `
      <div class="tasks__btn-showForm">
        + Добавить новую задачу
      </div>
      <form class="form tasks__form hidden">
        <div class="form__group">
          <label for="addTextTaskTodo"></label>
          <textarea class="form__textarea" id="addTextTaskTodo" name="text" placeholder="Введите текст задачи"></textarea>
        </div>
        <div class="form__group">
          <button class="form__button tasks__btn-add">Добавить задачу</button>
          <button class="form__button tasks__btn-hide" type="button" title="Убрать форму"></button>
        </div>
      </form>
    `;
  }
}
;// CONCATENATED MODULE: ./src/js/WidgetList.js


class WidgetList {
  constructor(container) {
    this.container = container;
    this.clearList();
  }
  init(id) {
    this.parentId = id;
    const data = getData(id);
    const _element = this.render(data);
    const widgetForm = new WidgetForm(this.container, id);
    this.container.appendChild(_element);
    widgetForm.init();
    const items = this.container.querySelectorAll(".tasks__item");
    items.forEach(_item => {
      const _remove = _item.querySelector(".tasks__btn-remove");
      _remove.addEventListener("click", this.removeItem.bind(this, _item));
    });
    const _tasksList = this.container.querySelector(".tasks__list");
    let _targetItem, _elementTmp;
    const onMouseOver = e => {
      _targetItem.style.top = e.clientY - e.offsetY + "px";
      _targetItem.style.left = e.clientX - e.offsetX + "px";
    };
    const onMouseUp = e => {
      let mouseUpItem = e.target.closest(".tasks__item");
      if (mouseUpItem) {
        const parent = mouseUpItem.closest(".tasks__list");
        parent.insertBefore(_targetItem, mouseUpItem);
        this.setData();
      } else {
        mouseUpItem = e.target.closest(".tasks__list");
        if (mouseUpItem) {
          mouseUpItem.appendChild(_targetItem);
          this.setData();
        }
      }
      _tasksList.style.cursor = "default";
      _targetItem.classList.remove("tasks__dragged");
      _targetItem.style = "";
      _elementTmp.remove();
      _targetItem = undefined;
      document.documentElement.removeEventListener("mouseup", onMouseUp);
      document.documentElement.removeEventListener("mouseover", onMouseOver);
    };
    _tasksList.addEventListener("mousedown", e => {
      e.preventDefault();
      if (!e.target.classList.contains("tasks__btn-remove")) {
        _targetItem = e.target.closest(".tasks__item");
        _targetItem.classList.add("tasks__dragged");
        _tasksList.style.cursor = "grabbing";
        _targetItem.style.width = _tasksList.offsetWidth + "px";
        _elementTmp = document.createElement("div");
        _elementTmp.classList.add("tasks__tmp");
        _elementTmp.style.height = _targetItem.offsetHeight + "px";
        _targetItem.insertAdjacentElement("afterend", _elementTmp);
        document.documentElement.addEventListener("mouseup", onMouseUp);
        document.documentElement.addEventListener("mouseover", onMouseOver);
      }
    });
  }
  setData() {
    const data = {};
    const tasks = document.querySelectorAll(".tasks__block");
    tasks.forEach(tasksList => {
      data[tasksList.dataset.id] = [];
      const tasksItems = tasksList.querySelectorAll(".tasks__item");
      tasksItems.forEach((item, index) => {
        data[tasksList.dataset.id].push({
          id: item.dataset.id,
          text: item.querySelector(".tasks__item-text").innerText,
          sort: index + 1
        });
      });
    });
    setData(data);
  }
  render(data) {
    const _list = document.createElement("div");
    _list.classList.add("tasks__list");
    if (data.length > 0) {
      data.forEach(item => {
        _list.insertAdjacentHTML("beforeend", this.markupElement(item));
      });
    }
    return _list;
  }
  markupElement(item) {
    return `
      <div class="tasks__item" data-id="${item.id}">
        <div class="tasks__btn-remove"></div>
        <div class="tasks__item-text">${item.text}</div>
      </div>
    `;
  }
  clearList() {
    const _title = this.container.querySelector(".tasks__block-title");
    this.container.innerHTML = "";
    this.container.appendChild(_title);
  }
  removeItem(_item) {
    if (confirm("Удалить задачу?")) {
      _item.remove();
      this.setData();
    }
  }
}
;// CONCATENATED MODULE: ./src/js/app.js

const _tasksBlock = document.querySelectorAll(".tasks__block");
_tasksBlock.forEach(_container => {
  const id = _container.dataset.id;
  const widgetList = new WidgetList(_container);
  widgetList.init(id);
});
;// CONCATENATED MODULE: ./src/index.js


/******/ })()
;