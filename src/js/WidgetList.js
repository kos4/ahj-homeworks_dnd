import WidgetForm from "./WidgetForm";
import { getData, setData } from "./functions";

export default class WidgetList {
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
    items.forEach((_item) => {
      const _remove = _item.querySelector(".tasks__btn-remove");
      _remove.addEventListener("click", this.removeItem.bind(this, _item));
    });

    const _tasksList = this.container.querySelector(".tasks__list");
    const tasksListPos = _tasksList.getBoundingClientRect();
    let _targetItem, _elementTmp;

    const onMouseOver = (e) => {
      _targetItem.style.top = e.clientY - tasksListPos.y - e.layerY + "px";
      _targetItem.style.left = e.clientX - tasksListPos.x - e.layerX + "px";
    };

    const onMouseUp = (e) => {
      const mouseUpItem = e.target.closest(".tasks__item");

      _tasksList.insertBefore(_targetItem, mouseUpItem);
      _tasksList.style.cursor = "default";
      _targetItem.classList.remove("tasks__dragged");
      _targetItem.style = "";

      _tasksList.removeEventListener("mouseup", onMouseUp);
      _tasksList.removeEventListener("mouseover", onMouseOver);

      const sort = Array.from(
        _tasksList.querySelectorAll(".tasks__item"),
      ).findIndex((item) => item === _targetItem);
      const id = Number(_targetItem.dataset.id);

      this.setSort(sort, id);
      _elementTmp.remove();
      _targetItem = undefined;
    };

    _tasksList.addEventListener("mousedown", (e) => {
      e.preventDefault();

      _targetItem = e.target.closest(".tasks__item");
      _targetItem.classList.add("tasks__dragged");
      _tasksList.style.cursor = "grabbing";

      _elementTmp = document.createElement("div");
      _elementTmp.classList.add("tasks__tmp");
      _elementTmp.style.height = _targetItem.offsetHeight + "px";
      _targetItem.insertAdjacentElement("afterend", _elementTmp);

      _tasksList.addEventListener("mouseup", onMouseUp);
      _tasksList.addEventListener("mouseover", onMouseOver);
    });
  }

  setSort(sort, id) {
    const data = getData();
    const index = data[this.parentId].findIndex((item) => item.id === id);

    data[this.parentId][index].sort = sort;
    setData(data);
  }

  render(data) {
    const _list = document.createElement("div");
    _list.classList.add("tasks__list");

    if (data.length > 0) {
      data.forEach((item) => {
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
      const parentId = _item.closest(".tasks__block").dataset.id;
      const id = Number(_item.dataset.id);
      const data = getData();

      data[parentId] = data[parentId].filter((item) => item.id !== id);
      setData(data);
      _item.remove();
    }
  }
}
