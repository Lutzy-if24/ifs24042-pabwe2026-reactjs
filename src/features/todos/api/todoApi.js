import apiHelper from "../../../helpers/apiHelper";

const todoApi = (() => {
  const BASE_URL = `${DELCOM_BASEURL}/todos`;

  function _url(path) {
    return BASE_URL + path;
  }

  async function postTodo(title, description) {
    const response = await apiHelper.fetchData(_url("/"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
      }),
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal menambahkan todo");
    }

    return result.data;
  }

  async function postTodoCover(todoId, cover) {
    const formData = new FormData();
    formData.append("cover", cover, cover.name || "cover.jpg");
    const response = await apiHelper.fetchData(_url(`/${todoId}/cover`), {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengubah cover");
    }

    return result.message;
  }

  async function putTodo(todoId, title, description, is_finished) {
    const response = await apiHelper.fetchData(_url(`/${todoId}`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        is_finished: is_finished ? 1 : 0,
      }),
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengubah todo");
    }

    return result.message;
  }

  async function getTodos(is_finished = "") {
    const targetUrl =
      is_finished !== "" && is_finished !== null && is_finished !== undefined
        ? `/?is_finished=${is_finished}`
        : "/";

    const response = await apiHelper.fetchData(_url(targetUrl), {
      method: "GET",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengambil data todo");
    }

    return result.data?.todos || [];
  }

  async function getTodoById(todoId) {
    const response = await apiHelper.fetchData(_url(`/${todoId}`), {
      method: "GET",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengambil detail todo");
    }

    return result.data?.todo;
  }

  async function deleteTodo(todoId) {
    const response = await apiHelper.fetchData(_url(`/${todoId}`), {
      method: "DELETE",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal menghapus todo");
    }

    return result.message;
  }

  return {
    postTodo,
    postTodoCover,
    putTodo,
    getTodos,
    getTodoById,
    deleteTodo,
  };
})();

export default todoApi;
