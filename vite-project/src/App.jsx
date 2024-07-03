import React, { createContext, useState } from "react";
import { Button, Modal, Space } from "antd";

export default function App() {
  const [modal, contextHolder] = Modal.useModal();
  const ReachableContext = createContext(null);
  const config = {
    title: "XÁC NHẬN!",
    content: (
      <>
        <ReachableContext.Consumer>
          {(name) => `${name}!`}
        </ReachableContext.Consumer>
      </>
    ),
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    handleSave();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [updateIndex, setUpdateindex] = useState(-1);
  const [todoInput, setTodoInput] = useState("");
  const [todoList, setTodolist] = useState(
    JSON.parse(localStorage.getItem("todoList")) || []
  );
  const handleChange = (e) => {
    setTodoInput(e.target.value);
  };
  const handleAdd = () => {
    if (todoInput.length === 0) {
      alert("không được để trống");
      return;
    }
    const todo = {
      id: Math.ceil(Math.random() * 1199919),
      text: todoInput,
      status: true,
    };
    const newTodoList = [...todoList, todo];
    setTodolist(newTodoList);
    localStorage.setItem("todoList", JSON.stringify(newTodoList));
  };
  const handleUpdate = (index) => {
    showModal();
    setTodoInput(todoList[index].text);
    setUpdateindex(index);
  };
  const handleSave = () => {
    todoList[updateIndex].text = todoInput;
    const newTodoList = [...todoList];
    setTodolist(newTodoList);
    localStorage.setItem("todoList", JSON.stringify(newTodoList));
    setUpdateindex(-1);
    setTodoInput("");
  };
  const handleDelete = (index) => {
    todoList.splice(index, 1);
    const newTodoList = [...todoList];
    setTodolist(newTodoList);
    localStorage.setItem("todoList", JSON.stringify(newTodoList));
  };
  const handleChangeStatus = (e, index) => {
    console.log(index, e.target.checked);
    todoList[index].status = !e.target.checked;
    const newTodoList = [...todoList];
    setTodolist(newTodoList);
    setOkTodo(() => {
      let a = newTodoList.filter((todo) => todo.status === false);
      return a.length;
    });
    localStorage.setItem("todoList", JSON.stringify(newTodoList));
  };
  const [okTodo, setOkTodo] = useState(() => {
    let a = todoList.filter((todo) => todo.status === false);
    return a.length;
  });
  return (
    <>
      <div>
        <div className="todo-container">
          <h3>Danh sách công việc</h3>
          <div className="todo-input">
            <input
              onChange={handleChange}
              value={todoInput}
              type="text"
              id="todoInput"
              placeholder="Nhập tên công việc"
            />
            <button onClick={handleAdd}>Thêm</button>
          </div>

          <ul className="todo-list" id="todoList">
            {todoList.map((todo, index) => (
              <>
                <li className="todo-item">
                  <input
                    type="checkbox"
                    onChange={(event) => handleChangeStatus(event, index)}
                    checked={!todo.status}
                  />

                  {todo.status ? <span>{todo.text}</span> : <s>{todo.text}</s>}
                  <div>
                    <button
                      onClick={() => {
                        handleUpdate(index);
                      }}
                      className="edit"
                    >
                      <i class="bx bxs-edit-alt"></i>
                    </button>
                    <button
                      className="delete"
                      onClick={async () => {
                        const confim = await modal.confirm(config);
                        {
                          confim && handleDelete(index);
                        }
                      }}
                    >
                      <i class="bx bxs-trash-alt"></i>
                    </button>
                  </div>
                </li>
              </>
            ))}
          </ul>

          {todoList.length === 0 ? (
            <>
              <img
                src="https://th.bing.com/th/id/OIP.N54ZWf97zs5NUo0NBmejFwHaGP?pid=ImgDet&w=195.4397394136808&h=180&c=7&dpr=1.5"
                alt=""
              />
            </>
          ) : (
            <>
              <div className="todo-footer">
                {okTodo < todoList.length ? (
                  <>
                    Công việc đã hoàn thành:{" "}
                    <span id="completedCount">
                      {todoList.filter((todo) => todo.status === false).length}
                    </span>
                    /{todoList.length}
                  </>
                ) : (
                  <>Công việc đã hoàn thành</>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <Modal
        title="Chỉnh sửa"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="todo-input">
          <input
            onChange={handleChange}
            value={todoInput}
            type="text"
            id="todoInput"
            placeholder="Nhập tên công việc"
          />
        </div>
      </Modal>
      <ReachableContext.Provider value="BẠN CÓ CHẮC MUỐN XÓA CÔNG VIỆC NÀY KHÔNG">
        <Space></Space>
        {/* `contextHolder` should always be placed under the context you want to access */}
        {contextHolder}
      </ReachableContext.Provider>
    </>
  );
}
