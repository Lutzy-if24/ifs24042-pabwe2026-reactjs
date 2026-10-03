import apiHelper from "../../../helpers/apiHelper";

const lostFoundApi = (() => {
  const BASE_URL = `${DELCOM_BASEURL}/lost-founds`;

  function _url(path) {
    return BASE_URL + path;
  }

  function _extractError(result, defaultMsg) {
    if (result.data && typeof result.data === "object") {
      const errorDetails = Object.values(result.data).flat().join(", ");
      if (errorDetails) {
        return `${result.message || defaultMsg}: ${errorDetails}`;
      }
    }
    return result.message || defaultMsg;
  }

  async function getLostFounds({ status = "", is_completed = "", is_me = "" } = {}) {
    const queryParams = new URLSearchParams();
    if (status) queryParams.append("status", status);
    if (is_completed !== "" && is_completed !== undefined && is_completed !== null) {
      queryParams.append("is_completed", String(is_completed));
    }
    if (is_me !== "" && is_me !== undefined && is_me !== null) {
      queryParams.append("is_me", String(is_me));
    }

    const queryString = queryParams.toString();
    const endpoint = _url(queryString ? `?${queryString}` : "");

    const response = await apiHelper.fetchData(endpoint, {
      method: "GET",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(_extractError(result, "Gagal mengambil daftar barang"));
    }

    return result.data?.lost_founds || [];
  }

  async function getLostFoundById(id) {
    const response = await apiHelper.fetchData(_url(`/${id}`), {
      method: "GET",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(_extractError(result, "Gagal mengambil detail barang"));
    }

    return result.data?.lost_found;
  }

  async function postLostFound({ title, description, status }) {
    const response = await apiHelper.fetchData(_url(""), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        status,
      }),
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(_extractError(result, "Gagal menambah barang"));
    }

    return result.message || "Barang berhasil ditambahkan!";
  }

  async function putLostFound(id, { title, description, status, is_completed }) {
    const response = await apiHelper.fetchData(_url(`/${id}`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        status,
        is_completed: Number(is_completed),
      }),
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(_extractError(result, "Gagal memperbarui barang"));
    }

    return result.message || "Barang berhasil diperbarui!";
  }

  async function postLostFoundCover(id, coverFile) {
    const formData = new FormData();
    formData.append("cover", coverFile, coverFile.name || "cover.png");

    const response = await apiHelper.fetchData(_url(`/${id}/cover`), {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(_extractError(result, "Gagal mengunggah cover"));
    }

    return result.message || "Cover berhasil diperbarui!";
  }

  async function deleteLostFound(id) {
    const response = await apiHelper.fetchData(_url(`/${id}`), {
      method: "DELETE",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(_extractError(result, "Gagal menghapus barang"));
    }

    return result.message || "Barang berhasil dihapus!";
  }

  async function deleteMyLostFounds() {
    const response = await apiHelper.fetchData(_url(""), {
      method: "DELETE",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(_extractError(result, "Gagal menghapus semua barang saya"));
    }

    return result.message || "Semua barang saya berhasil dihapus!";
  }

  async function getLostFoundStats({ end_date = "", total_data = "", type = "daily" } = {}) {
    const queryParams = new URLSearchParams();
    if (end_date) queryParams.append("end_date", end_date);
    if (total_data) queryParams.append("total_data", String(total_data));

    const queryString = queryParams.toString();
    const path = `/stats/${type === "monthly" ? "monthly" : "daily"}${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await apiHelper.fetchData(_url(path), {
      method: "GET",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(_extractError(result, "Gagal mengambil statistik"));
    }

    return result.data || {};
  }

  return {
    getLostFounds,
    getLostFoundById,
    postLostFound,
    putLostFound,
    postLostFoundCover,
    deleteLostFound,
    deleteMyLostFounds,
    getLostFoundStats,
  };
})();

export default lostFoundApi;
